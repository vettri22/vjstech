import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { query, queryOne, run } from '../db';
import { TeamMember } from '../types';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../services/audit';

export const teamRouter = Router();

// GET /api/team (Public: Returns official team members in order with photos)
teamRouter.get('/', (_req: Request, res: Response) => {
  try {
    const members = query<any>(
      `SELECT id, name, role, bio, responsibilities, skills, avatar_initials, photo_url, order_index
       FROM team_members 
       WHERE is_active = 1 
       ORDER BY order_index ASC`
    );

    const formatted = members.map(m => ({
      ...m,
      skills: JSON.parse(m.skills || '[]'),
    }));

    res.json({ team: formatted });
  } catch (err) {
    console.error('Error fetching team members:', err);
    res.status(500).json({ error: 'Failed to retrieve team profiles.' });
  }
});

// POST /api/team/:id/photo (Admin only: Upload and save team member photo)
teamRouter.post('/:id/photo', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { photoData, photoUrl } = req.body;

    const existing = queryOne<{ id: string; name: string }>(
      'SELECT id, name FROM team_members WHERE id = ?',
      [id]
    );
    if (!existing) {
      res.status(404).json({ error: 'Team member record not found.' });
      return;
    }

    let finalPhotoUrl = '';

    if (photoData && typeof photoData === 'string' && photoData.startsWith('data:image/')) {
      // Parse Base64 Image payload
      const matches = photoData.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        res.status(400).json({ error: 'Invalid image format. Supported formats: JPG, PNG, WebP.' });
        return;
      }

      let ext = matches[1].toLowerCase();
      if (ext === 'jpeg') ext = 'jpg';
      const base64Buffer = Buffer.from(matches[2], 'base64');

      // Maximum file size bound (10MB)
      if (base64Buffer.length > 10 * 1024 * 1024) {
        res.status(400).json({ error: 'Selected photo exceeds the maximum size limit of 10MB.' });
        return;
      }

      // Ensure storage directory exists
      const teamUploadsDir = path.resolve(process.cwd(), 'uploads/team');
      if (!fs.existsSync(teamUploadsDir)) {
        fs.mkdirSync(teamUploadsDir, { recursive: true });
      }

      const filename = `team_${id}_${Date.now()}.${ext}`;
      const filePath = path.join(teamUploadsDir, filename);
      fs.writeFileSync(filePath, base64Buffer);

      // Sync to client public directory for seamless Vite dev access
      try {
        const clientUploadsDir = path.resolve(process.cwd(), '../client/public/uploads/team');
        if (!fs.existsSync(clientUploadsDir)) {
          fs.mkdirSync(clientUploadsDir, { recursive: true });
        }
        fs.writeFileSync(path.join(clientUploadsDir, filename), base64Buffer);
      } catch (_syncErr) {
        // Non-critical in standalone server environments
      }

      finalPhotoUrl = `/uploads/team/${filename}`;
    } else if (photoUrl && typeof photoUrl === 'string' && photoUrl.trim().length > 0) {
      finalPhotoUrl = photoUrl.trim();
    } else {
      res.status(400).json({ error: 'Please select an image file or provide a valid photo URL.' });
      return;
    }

    const now = new Date().toISOString();
    run('UPDATE team_members SET photo_url = ?, updated_at = ? WHERE id = ?', [
      finalPhotoUrl,
      now,
      id,
    ]);

    logAuditEvent({
      userId: req.user!.id,
      action: 'TEAM_MEMBER_PHOTO_UPDATED',
      entityType: 'TEAM',
      entityId: id,
      details: { memberName: existing.name, photoUrl: finalPhotoUrl },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `Photo updated successfully for ${existing.name}.`,
      photoUrl: finalPhotoUrl,
    });
  } catch (err) {
    console.error('Error uploading team photo:', err);
    res.status(500).json({ error: 'An error occurred while uploading team member photo.' });
  }
});

// DELETE /api/team/:id/photo (Admin only: Remove photo and revert to initials)
teamRouter.delete('/:id/photo', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const existing = queryOne<{ id: string; name: string }>(
      'SELECT id, name FROM team_members WHERE id = ?',
      [id]
    );
    if (!existing) {
      res.status(404).json({ error: 'Team member record not found.' });
      return;
    }

    const now = new Date().toISOString();
    run('UPDATE team_members SET photo_url = NULL, updated_at = ? WHERE id = ?', [now, id]);

    logAuditEvent({
      userId: req.user!.id,
      action: 'TEAM_MEMBER_PHOTO_REMOVED',
      entityType: 'TEAM',
      entityId: id,
      details: { memberName: existing.name },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `Photo removed for ${existing.name}. Initials avatar restored.` });
  } catch (err) {
    console.error('Error removing team photo:', err);
    res.status(500).json({ error: 'Failed to remove team member photo.' });
  }
});

// PATCH /api/team/:id (Admin only: Update team member information)
teamRouter.patch('/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { name, role, bio, responsibilities, skills, avatar_initials, photo_url, order_index, is_active } = req.body;

    const existing = queryOne('SELECT id FROM team_members WHERE id = ?', [id]);
    if (!existing) {
      res.status(404).json({ error: 'Team member record not found.' });
      return;
    }

    const now = new Date().toISOString();
    const skillsJson = skills ? JSON.stringify(skills) : undefined;

    run(
      `UPDATE team_members
       SET name = COALESCE(?, name),
           role = COALESCE(?, role),
           bio = COALESCE(?, bio),
           responsibilities = COALESCE(?, responsibilities),
           skills = COALESCE(?, skills),
           avatar_initials = COALESCE(?, avatar_initials),
           photo_url = COALESCE(?, photo_url),
           order_index = COALESCE(?, order_index),
           is_active = COALESCE(?, is_active),
           updated_at = ?
       WHERE id = ?`,
      [name, role, bio, responsibilities, skillsJson, avatar_initials, photo_url, order_index, is_active, now, id]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: 'TEAM_MEMBER_UPDATED',
      entityType: 'TEAM',
      entityId: id,
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Team profile updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update team profile.' });
  }
});
