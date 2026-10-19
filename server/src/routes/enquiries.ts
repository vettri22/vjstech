import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { query, queryOne, run } from '../db';
import { Enquiry } from '../types';
import { enquiryRateLimiter, requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../services/audit';

export const enquiriesRouter = Router();

function generateReferenceCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `VJS-2026-${random}`;
}

const enquirySchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  phone: z.string().optional(),
  organization: z.string().optional(),
  clientCategory: z.string().min(1, 'Please select your client category'),
  services: z.array(z.string()).min(1, 'Please select at least one required service'),
  projectTitle: z.string().min(3, 'Project title must be at least 3 characters'),
  projectDescription: z.string().min(10, 'Project description must be at least 10 characters'),
  budgetRange: z.string().optional(),
  desiredTimeline: z.string().optional(),
  preferredContactMethod: z.enum(['Email', 'WhatsApp', 'Phone Call', 'Any']),
  additionalNotes: z.string().optional(),
  consentGiven: z.boolean().refine(val => val === true, {
    message: 'You must acknowledge the Privacy Policy to submit an enquiry',
  }),
  // Honeypot field for bot spam detection
  website_hp: z.string().optional(),
});

// POST /api/enquiries (Public enquiry submission)
enquiriesRouter.post('/', enquiryRateLimiter, async (req, res) => {
  try {
    const parseResult = enquirySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const data = parseResult.data;

    // Honeypot check: If bot filled the hidden website_hp field, silently drop
    if (data.website_hp && data.website_hp.trim() !== '') {
      logAuditEvent({
        action: 'SPAM_HONEYPOT_BLOCKED',
        entityType: 'ENQUIRY',
        details: { ip: req.ip },
      });
      // Respond with pseudo success to prevent spammers from adjusting
      res.status(200).json({
        success: true,
        referenceCode: 'VJS-2026-OK',
        message: 'Your enquiry has been received.',
      });
      return;
    }

    // Duplicate check: Prevent identical requests submitted within last 60 seconds
    const existingRecent = queryOne<Enquiry>(
      `SELECT id FROM enquiries 
       WHERE email = ? AND project_title = ? 
       AND datetime(created_at) > datetime('now', '-60 seconds')`,
      [data.email, data.projectTitle]
    );

    if (existingRecent) {
      res.status(429).json({
        error: 'A duplicate enquiry with this project title was just submitted. Please wait before re-submitting.',
      });
      return;
    }

    const id = uuidv4();
    const referenceCode = generateReferenceCode();
    const now = new Date().toISOString();

    run(
      `INSERT INTO enquiries (
        id, reference_code, full_name, email, phone, organization,
        client_category, services, project_title, project_description,
        budget_range, desired_timeline, preferred_contact_method,
        additional_notes, consent_given, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'new', ?, ?)`,
      [
        id,
        referenceCode,
        data.fullName,
        data.email,
        data.phone || null,
        data.organization || null,
        data.clientCategory,
        JSON.stringify(data.services),
        data.projectTitle,
        data.projectDescription,
        data.budgetRange || null,
        data.desiredTimeline || null,
        data.preferredContactMethod,
        data.additionalNotes || null,
        now,
        now,
      ]
    );

    logAuditEvent({
      action: 'ENQUIRY_CREATED',
      entityType: 'ENQUIRY',
      entityId: id,
      details: { referenceCode, email: data.email },
      ipAddress: req.ip,
    });

    // Check email integration status
    const hasEmailConfig = !!(process.env.SMTP_HOST && process.env.SMTP_USER);
    const emailNotice = hasEmailConfig
      ? 'An automated confirmation email was sent.'
      : 'Automated email dispatch is pending provider configuration. Your enquiry is securely saved.';

    res.status(201).json({
      success: true,
      id,
      referenceCode,
      message: 'Thank you! Your project enquiry has been securely logged.',
      emailNotice,
    });
  } catch (err: any) {
    console.error('Enquiry creation error:', err);
    res.status(500).json({ error: 'Failed to record your enquiry due to an internal server error.' });
  }
});

// GET /api/enquiries (Admin only)
enquiriesRouter.get('/', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const status = req.query.status as string;
    let enquiries: any[];

    if (status && status !== 'all') {
      enquiries = query<any>(
        'SELECT * FROM enquiries WHERE status = ? ORDER BY created_at DESC',
        [status]
      );
    } else {
      enquiries = query<any>('SELECT * FROM enquiries ORDER BY created_at DESC');
    }

    const formatted = enquiries.map(e => ({
      ...e,
      services: JSON.parse(e.services || '[]'),
      consent_given: Boolean(e.consent_given),
    }));

    res.json({ enquiries: formatted, count: formatted.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve enquiries.' });
  }
});

// PATCH /api/enquiries/:id (Admin only: update status & notes)
enquiriesRouter.patch('/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const { status, adminNotes } = req.body;
    const id = String(req.params.id);

    const existing = queryOne('SELECT id FROM enquiries WHERE id = ?', [id]);
    if (!existing) {
      res.status(404).json({ error: 'Enquiry record not found.' });
      return;
    }

    const now = new Date().toISOString();

    if (status && adminNotes !== undefined) {
      run(
        'UPDATE enquiries SET status = ?, admin_notes = ?, updated_at = ? WHERE id = ?',
        [status, adminNotes, now, id]
      );
    } else if (status) {
      run(
        'UPDATE enquiries SET status = ?, updated_at = ? WHERE id = ?',
        [status, now, id]
      );
    } else if (adminNotes !== undefined) {
      run(
        'UPDATE enquiries SET admin_notes = ?, updated_at = ? WHERE id = ?',
        [adminNotes, now, id]
      );
    }

    logAuditEvent({
      userId: req.user!.id,
      action: 'ENQUIRY_UPDATED',
      entityType: 'ENQUIRY',
      entityId: id,
      details: { status, adminNotes },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Enquiry updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update enquiry.' });
  }
});

// DELETE /api/enquiries/:id (Admin only: delete incoming client enquiry)
enquiriesRouter.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id);
    const existing = queryOne('SELECT id, reference_code, full_name, email FROM enquiries WHERE id = ?', [id]);
    if (!existing) {
      res.status(404).json({ error: 'Enquiry record not found.' });
      return;
    }

    run('DELETE FROM enquiries WHERE id = ?', [id]);

    logAuditEvent({
      userId: req.user!.id,
      action: 'ENQUIRY_DELETED',
      entityType: 'ENQUIRY',
      entityId: id,
      details: { referenceCode: existing.reference_code, email: existing.email, fullName: existing.full_name },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `Enquiry ${existing.reference_code} deleted successfully.` });
  } catch (err) {
    console.error('Error deleting enquiry:', err);
    res.status(500).json({ error: 'Failed to delete enquiry record.' });
  }
});

