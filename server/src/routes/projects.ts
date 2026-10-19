import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { query, queryOne, run } from '../db';
import { Project, Milestone, ProjectUpdate } from '../types';
import { requireAuth, requireAdmin, verifyProjectAccess, AuthenticatedRequest } from '../middleware/auth';
import { logAuditEvent } from '../services/audit';

export const projectsRouter = Router();

// GET /api/projects (Client sees only their own; Admin sees all)
projectsRouter.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const isUserAdmin = req.user!.role === 'admin';
    let projects: any[];

    if (isUserAdmin) {
      projects = query<any>(
        `SELECT p.*, u.full_name as client_name, u.email as client_email, u.organization as client_org
         FROM projects p
         LEFT JOIN users u ON p.client_id = u.id
         ORDER BY p.updated_at DESC`
      );
    } else {
      projects = query<any>(
        `SELECT * FROM projects WHERE client_id = ? ORDER BY updated_at DESC`,
        [req.user!.id]
      );
    }

    res.json({ projects });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ error: 'Failed to retrieve project records.' });
  }
});

// GET /api/projects/:id (Single project detail with milestones and updates - protected by verifyProjectAccess)
projectsRouter.get('/:id', requireAuth, verifyProjectAccess, (req: AuthenticatedRequest, res) => {
  try {
    const projectId = req.params.id;

    const project = queryOne<any>(
      `SELECT p.*, u.full_name as client_name, u.email as client_email, u.organization as client_org
       FROM projects p
       LEFT JOIN users u ON p.client_id = u.id
       WHERE p.id = ?`,
      [projectId]
    );

    if (!project) {
      res.status(404).json({ error: 'Project record not found.' });
      return;
    }

    const milestones = query<Milestone>(
      `SELECT * FROM milestones WHERE project_id = ? ORDER BY order_index ASC`,
      [projectId]
    );

    const updates = query<ProjectUpdate>(
      `SELECT * FROM project_updates WHERE project_id = ? ORDER BY created_at DESC`,
      [projectId]
    );

    const documents = query<any>(
      `SELECT * FROM project_documents WHERE project_id = ? ORDER BY created_at DESC`,
      [projectId]
    );

    const architectures = query<any>(
      `SELECT * FROM project_architectures WHERE project_id = ? ORDER BY created_at DESC`,
      [projectId]
    );

    const messages = query<any>(
      `SELECT * FROM project_messages WHERE project_id = ? ORDER BY created_at ASC`,
      [projectId]
    );

    res.json({
      project,
      milestones,
      updates,
      documents,
      architectures,
      messages,
    });
  } catch (err) {
    console.error('Error fetching project detail:', err);
    res.status(500).json({ error: 'Failed to retrieve project detail.' });
  }
});

// POST /api/projects (Admin only: create new project record)
projectsRouter.post('/', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const { name, clientId, description, status, startDate, targetEndDate } = req.body;

    if (!name || !clientId || !description) {
      res.status(400).json({ error: 'Name, clientId, and description are required fields.' });
      return;
    }

    // Verify client exists
    const client = queryOne('SELECT id FROM users WHERE id = ? AND role = "client"', [clientId]);
    if (!client) {
      res.status(400).json({ error: 'The specified client account does not exist.' });
      return;
    }

    const id = uuidv4();
    const referenceCode = `VJS-2026-P${Math.floor(1000 + Math.random() * 9000)}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const now = new Date().toISOString();

    run(
      `INSERT INTO projects (id, reference_code, name, slug, client_id, description, status, start_date, target_end_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        referenceCode,
        name,
        slug,
        clientId,
        description,
        status || 'Requirements Review',
        startDate || null,
        targetEndDate || null,
        now,
        now,
      ]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: 'PROJECT_CREATED',
      entityType: 'PROJECT',
      entityId: id,
      details: { referenceCode, name, clientId },
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, id, referenceCode, message: 'Project created successfully.' });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project record.' });
  }
});

// PATCH /api/projects/:id (Admin only: update project details, deadline calendar date, or status)
projectsRouter.patch('/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id);
    const { name, description, status, startDate, targetEndDate, target_end_date } = req.body;
    const finalTargetDate = targetEndDate !== undefined ? targetEndDate : target_end_date;

    const existing = queryOne('SELECT id, reference_code FROM projects WHERE id = ?', [id]);
    if (!existing) {
      res.status(404).json({ error: 'Project record not found.' });
      return;
    }

    const now = new Date().toISOString();

    run(
      `UPDATE projects 
       SET name = COALESCE(?, name),
           description = COALESCE(?, description),
           status = COALESCE(?, status),
           start_date = COALESCE(?, start_date),
           target_end_date = CASE WHEN ? IS NOT NULL THEN ? ELSE target_end_date END,
           updated_at = ?
       WHERE id = ?`,
      [
        name ?? null,
        description ?? null,
        status ?? null,
        startDate ?? null,
        finalTargetDate !== undefined ? finalTargetDate : null,
        finalTargetDate !== undefined ? finalTargetDate : null,
        now,
        id,
      ]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: 'PROJECT_UPDATED',
      entityType: 'PROJECT',
      entityId: id,
      details: { status, targetEndDate: finalTargetDate },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: 'Project record updated successfully.' });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE /api/projects/:id (Admin only: delete client project record and cascade related data)
projectsRouter.delete('/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const id = String(req.params.id);
    const existing = queryOne<any>('SELECT id, reference_code, name FROM projects WHERE id = ?', [id]);
    if (!existing) {
      res.status(404).json({ error: 'Project record not found.' });
      return;
    }

    // Cascade deletes
    run('DELETE FROM milestones WHERE project_id = ?', [id]);
    run('DELETE FROM project_updates WHERE project_id = ?', [id]);
    run('DELETE FROM project_documents WHERE project_id = ?', [id]);
    run('DELETE FROM project_architectures WHERE project_id = ?', [id]);
    run('DELETE FROM project_messages WHERE project_id = ?', [id]);
    run('DELETE FROM projects WHERE id = ?', [id]);

    logAuditEvent({
      userId: req.user!.id,
      action: 'PROJECT_DELETED',
      entityType: 'PROJECT',
      entityId: id,
      details: { referenceCode: existing.reference_code, name: existing.name },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `Project ${existing.reference_code} deleted successfully.` });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project record.' });
  }
});

// POST /api/projects/:id/milestones (Admin only: add milestone)
projectsRouter.post('/:id/milestones', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const projectId = req.params.id;
    const { title, description, status, dueDate, orderIndex } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: 'Milestone title and description are required.' });
      return;
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    run(
      `INSERT INTO milestones (id, project_id, title, description, status, due_date, order_index, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        projectId,
        title,
        description,
        status || 'pending',
        dueDate || null,
        orderIndex !== undefined ? orderIndex : 0,
        now,
      ]
    );

    res.status(201).json({ success: true, id, message: 'Milestone added successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add milestone.' });
  }
});

// POST /api/projects/:id/updates (Admin or assigned client can post updates)
projectsRouter.post('/:id/updates', requireAuth, verifyProjectAccess, (req: AuthenticatedRequest, res) => {
  try {
    const projectId = req.params.id;
    const { title, message } = req.body;

    if (!title || !message) {
      res.status(400).json({ error: 'Update title and message are required.' });
      return;
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    run(
      `INSERT INTO project_updates (id, project_id, author_id, author_name, title, message, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        projectId,
        req.user!.id,
        req.user!.fullName,
        title,
        message,
        now,
      ]
    );

    res.status(201).json({ success: true, id, message: 'Project update posted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to post project update.' });
  }
});

// POST /api/projects/:id/architectures (Admin only: post architecture/idea proposal for client review)
projectsRouter.post('/:id/architectures', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const projectId = req.params.id;
    const { title, description, techSpec, diagramUrl } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: 'Architecture title and description are required.' });
      return;
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    run(
      `INSERT INTO project_architectures (id, project_id, title, description, diagram_url, tech_spec, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [id, projectId, title, description, diagramUrl || null, techSpec || null, now]
    );

    // Also record in project discussion stream
    const msgId = uuidv4();
    run(
      `INSERT INTO project_messages (id, project_id, sender_id, sender_role, sender_name, message_type, content, created_at)
       VALUES (?, ?, ?, 'admin', ?, 'architecture', ?, ?)`,
      [
        msgId,
        projectId,
        req.user!.id,
        req.user!.fullName,
        `Architecture Proposal Posted: "${title}". Description: ${description}`,
        now,
      ]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: 'ARCHITECTURE_PROPOSAL_POSTED',
      entityType: 'PROJECT',
      entityId: projectId,
      details: { title, architectureId: id },
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, id, message: 'Architecture & idea proposal submitted for client review.' });
  } catch (err) {
    console.error('Error posting architecture proposal:', err);
    res.status(500).json({ error: 'Failed to post architecture proposal.' });
  }
});

// GET /api/projects/:id/architectures (Client or Admin: list architecture proposals)
projectsRouter.get('/:id/architectures', requireAuth, verifyProjectAccess, (req: AuthenticatedRequest, res) => {
  try {
    const projectId = req.params.id;
    const architectures = query<any>(
      'SELECT * FROM project_architectures WHERE project_id = ? ORDER BY created_at DESC',
      [projectId]
    );
    res.json({ architectures });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve architecture proposals.' });
  }
});

// PATCH /api/projects/:id/architectures/:archId/review (Client or Admin: approve or decline proposal with feedback)
projectsRouter.patch('/:id/architectures/:archId/review', requireAuth, verifyProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: projectId, archId } = req.params;
    const { status, clientFeedback } = req.body;

    if (!['approved', 'declined'].includes(status)) {
      res.status(400).json({ error: 'Status must be either "approved" or "declined".' });
      return;
    }

    if (status === 'declined' && (!clientFeedback || clientFeedback.trim().length === 0)) {
      res.status(400).json({ error: 'Please provide feedback/instructions describing what changes are required before declining.' });
      return;
    }

    const arch = queryOne<any>('SELECT * FROM project_architectures WHERE id = ? AND project_id = ?', [archId, projectId]);
    if (!arch) {
      res.status(404).json({ error: 'Architecture proposal not found.' });
      return;
    }

    const now = new Date().toISOString();
    run(
      'UPDATE project_architectures SET status = ?, client_feedback = ?, reviewed_at = ? WHERE id = ?',
      [status, clientFeedback || null, now, archId]
    );

    // Record review in message stream
    const msgId = uuidv4();
    const reviewNote = status === 'approved' 
      ? `Approved Architecture Proposal: "${arch.title}"`
      : `Declined Architecture Proposal: "${arch.title}" with feedback: "${clientFeedback}"`;

    run(
      `INSERT INTO project_messages (id, project_id, sender_id, sender_role, sender_name, message_type, content, created_at)
       VALUES (?, ?, ?, ?, ?, 'feedback', ?, ?)`,
      [
        msgId,
        projectId,
        req.user!.id,
        req.user!.role,
        req.user!.fullName,
        reviewNote,
        now,
      ]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: status === 'approved' ? 'ARCHITECTURE_APPROVED' : 'ARCHITECTURE_DECLINED',
      entityType: 'PROJECT',
      entityId: projectId,
      details: { archId, status, clientFeedback },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: status === 'approved' ? 'Architecture proposal approved successfully.' : 'Revision feedback logged and sent to engineering.',
    });
  } catch (err) {
    console.error('Error reviewing architecture proposal:', err);
    res.status(500).json({ error: 'Failed to process architecture review.' });
  }
});

// GET /api/projects/:id/messages (Direct notes & feedback between admin and client)
projectsRouter.get('/:id/messages', requireAuth, verifyProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const messages = query<any>(
      'SELECT * FROM project_messages WHERE project_id = ? ORDER BY created_at ASC',
      [projectId]
    );
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve project discussion.' });
  }
});

// POST /api/projects/:id/messages (Admin or Client: post direct message/note/feedback)
projectsRouter.post('/:id/messages', requireAuth, verifyProjectAccess, (req: AuthenticatedRequest, res: Response) => {
  try {
    const projectId = req.params.id;
    const { content, messageType } = req.body;

    if (!content || !content.trim()) {
      res.status(400).json({ error: 'Message content cannot be empty.' });
      return;
    }

    const type = ['message', 'feedback', 'note', 'architecture'].includes(messageType)
      ? messageType
      : 'message';

    const id = uuidv4();
    const now = new Date().toISOString();

    run(
      `INSERT INTO project_messages (id, project_id, sender_id, sender_role, sender_name, message_type, content, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        projectId,
        req.user!.id,
        req.user!.role,
        req.user!.fullName,
        type,
        content.trim(),
        now,
      ]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: 'PROJECT_MESSAGE_POSTED',
      entityType: 'PROJECT',
      entityId: projectId,
      details: { type },
      ipAddress: req.ip,
    });

    res.status(201).json({ success: true, id, message: 'Message posted successfully.' });
  } catch (err) {
    console.error('Error posting project message:', err);
    res.status(500).json({ error: 'Failed to post message.' });
  }
});

