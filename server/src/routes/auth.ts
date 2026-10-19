import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { query, queryOne, run } from '../db';
import { User } from '../types';
import { authRateLimiter, loginRateLimiter, generateToken, requireAuth, requireAdmin, AuthenticatedRequest, unlockClient } from '../middleware/auth';
import { logAuditEvent } from '../services/audit';

export const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  fullName: z.string().min(2, 'Full name is required'),
  organization: z.string().optional(),
  phone: z.string().optional(),
  clientStatus: z.enum(['active', 'inactive', 'finished']).optional(),
});

// POST /api/auth/login (Strict 5 attempts per 15 min rate limiter)
authRouter.post('/login', loginRateLimiter, async (req, res) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const { email, password } = parseResult.data;
    const user = queryOne<User>('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      logAuditEvent({
        action: 'LOGIN_FAILURE',
        entityType: 'USER',
        details: { email, reason: 'User not found' },
        ipAddress: req.ip,
      });
      res.status(401).json({ error: 'Invalid email address or password.' });
      return;
    }

    if (user.role === 'client' && user.client_status === 'inactive') {
      res.status(403).json({ error: 'Your client account is currently set to inactive. Please contact VJS TECH administration.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      logAuditEvent({
        userId: user.id,
        action: 'LOGIN_FAILURE',
        entityType: 'USER',
        details: { email, reason: 'Password mismatch' },
        ipAddress: req.ip,
      });
      res.status(401).json({ error: 'Invalid email address or password.' });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    });

    logAuditEvent({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      entityType: 'USER',
      entityId: user.id,
      ipAddress: req.ip,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        clientStatus: user.client_status || 'active',
        organization: user.organization,
        phone: user.phone,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'An unexpected internal error occurred during authentication.' });
  }
});

// POST /api/auth/register (Client self-registration)
authRouter.post('/register', authRateLimiter, async (req, res) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const { email, password, fullName, organization, phone } = parseResult.data;

    // Check if user already exists
    const existing = queryOne<User>('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const now = new Date().toISOString();

    run(
      `INSERT INTO users (id, email, password_hash, full_name, role, organization, phone, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'client', ?, ?, ?, ?)`,
      [id, email, passwordHash, fullName, organization || null, phone || null, now, now]
    );

    const token = generateToken({
      id,
      email,
      role: 'client',
      fullName,
    });

    logAuditEvent({
      userId: id,
      action: 'CLIENT_REGISTERED',
      entityType: 'USER',
      entityId: id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      token,
      user: {
        id,
        email,
        fullName,
        role: 'client',
        organization,
        phone,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'An internal error occurred during account creation.' });
  }
});

// GET /api/auth/me (Current user session)
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  try {
    const user = queryOne<User>(
      'SELECT id, email, full_name, role, organization, phone, created_at FROM users WHERE id = ?',
      [req.user!.id]
    );

    if (!user) {
      res.status(404).json({ error: 'User profile no longer exists.' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        organization: user.organization,
        phone: user.phone,
        createdAt: user.created_at,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
});

// POST /api/auth/logout
authRouter.post('/logout', requireAuth, (req: AuthenticatedRequest, res) => {
  logAuditEvent({
    userId: req.user!.id,
    action: 'LOGOUT',
    entityType: 'USER',
    entityId: req.user!.id,
    ipAddress: req.ip,
  });
  res.json({ message: 'Successfully logged out.' });
});

// GET /api/auth/clients (Admin only: list all client accounts)
authRouter.get('/clients', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const clients = query<any>(
      `SELECT id, email, full_name, organization, phone, COALESCE(client_status, 'active') as client_status, created_at, updated_at
       FROM users
       WHERE role = 'client'
       ORDER BY created_at DESC`
    );
    res.json({ clients });
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Failed to retrieve client directory.' });
  }
});

// POST /api/auth/create-client (Admin only: create a login ID and password for a client)
authRouter.post('/create-client', requireAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const { email, password, fullName, organization, phone, clientStatus } = parseResult.data;

    const existing = queryOne<User>('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      res.status(409).json({ error: 'A user account with this email address already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const now = new Date().toISOString();
    const status = clientStatus || 'active';

    run(
      `INSERT INTO users (id, email, password_hash, full_name, role, client_status, organization, phone, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'client', ?, ?, ?, ?, ?)`,
      [id, email, passwordHash, fullName, status, organization || null, phone || null, now, now]
    );

    logAuditEvent({
      userId: req.user!.id,
      action: 'ADMIN_CREATED_CLIENT',
      entityType: 'USER',
      entityId: id,
      details: { email, fullName, organization, clientStatus: status },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      client: {
        id,
        email,
        fullName,
        role: 'client',
        clientStatus: status,
        organization,
        phone,
      },
      message: `Client account created successfully for ${email}.`,
    });
  } catch (err: any) {
    console.error('Client creation error:', err);
    res.status(500).json({ error: 'Failed to provision client account.' });
  }
});

// PATCH /api/auth/clients/:id/status (Admin only: change client status: active, inactive, finished)
authRouter.patch('/clients/:id/status', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const clientId = req.params.id;
    const { status } = req.body;

    if (!['active', 'inactive', 'finished'].includes(status)) {
      res.status(400).json({ error: 'Invalid client status. Allowed: active, inactive, finished.' });
      return;
    }

    const client = queryOne('SELECT id, email FROM users WHERE id = ? AND role = "client"', [clientId]);
    if (!client) {
      res.status(404).json({ error: 'Client account not found.' });
      return;
    }

    const now = new Date().toISOString();
    run('UPDATE users SET client_status = ?, updated_at = ? WHERE id = ?', [status, now, clientId]);

    logAuditEvent({
      userId: req.user!.id,
      action: 'ADMIN_UPDATED_CLIENT_STATUS',
      entityType: 'USER',
      entityId: clientId,
      details: { email: client.email, newStatus: status },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `Client status updated to "${status}".` });
  } catch (err) {
    console.error('Error updating client status:', err);
    res.status(500).json({ error: 'Failed to update client status.' });
  }
});

// DELETE /api/auth/clients/:id (Admin only: delete client account and cascade assigned records)
authRouter.delete('/clients/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const clientId = req.params.id;
    const client = queryOne<User>('SELECT id, email, full_name FROM users WHERE id = ? AND role = "client"', [clientId]);
    if (!client) {
      res.status(404).json({ error: 'Client account not found.' });
      return;
    }

    run('DELETE FROM users WHERE id = ?', [clientId]);

    logAuditEvent({
      userId: req.user!.id,
      action: 'ADMIN_DELETED_CLIENT',
      entityType: 'USER',
      entityId: clientId,
      details: { email: client.email, fullName: client.full_name },
      ipAddress: req.ip,
    });

    res.json({ success: true, message: `Client account ${client.email} deleted successfully.` });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ error: 'Failed to delete client account.' });
  }
});

// POST /api/auth/request-unlock (Public: client asks help with admin when login rate limited)
authRouter.post('/request-unlock', (req, res) => {
  try {
    const { email, reason } = req.body;
    if (!email || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required to request rate limit unlock.' });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const id = uuidv4();
    const now = new Date().toISOString();
    const ipAddress = req.ip || req.socket.remoteAddress || '';

    // Check if there is already a recent pending request for this email
    const existing = queryOne(
      'SELECT id FROM rate_limit_unlocks WHERE email = ? AND status = "pending"',
      [normalizedEmail]
    );

    if (existing) {
      res.json({
        success: true,
        message: 'Your unlock request is already pending review with VJS TECH administration. We will unblock access immediately upon review.',
      });
      return;
    }

    run(
      `INSERT INTO rate_limit_unlocks (id, email, ip_address, reason, status, created_at)
       VALUES (?, ?, ?, ?, 'pending', ?)`,
      [id, normalizedEmail, ipAddress, reason || 'Login Rate Limit Encountered', now]
    );

    logAuditEvent({
      action: 'RATE_LIMIT_UNLOCK_REQUESTED',
      entityType: 'USER',
      details: { email: normalizedEmail, ipAddress },
      ipAddress,
    });

    res.json({
      success: true,
      message: 'Help request sent to VJS TECH administration. When the administrator approves, you will be able to sign in immediately.',
    });
  } catch (err) {
    console.error('Error creating unlock request:', err);
    res.status(500).json({ error: 'Failed to submit help request.' });
  }
});

// GET /api/auth/unlock-requests (Admin only: view pending and recent unlock requests)
authRouter.get('/unlock-requests', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const requests = query<any>(
      'SELECT * FROM rate_limit_unlocks ORDER BY created_at DESC LIMIT 50'
    );
    res.json({ requests });
  } catch (err) {
    console.error('Error fetching unlock requests:', err);
    res.status(500).json({ error: 'Failed to retrieve unlock requests.' });
  }
});

// POST /api/auth/approve-unlock/:id (Admin only: approve rate limit and allow client to sign in immediately)
authRouter.post('/approve-unlock/:id', requireAdmin, (req: AuthenticatedRequest, res) => {
  try {
    const unlockId = req.params.id;
    const item = queryOne<any>('SELECT * FROM rate_limit_unlocks WHERE id = ?', [unlockId]);
    if (!item) {
      res.status(404).json({ error: 'Unlock request not found.' });
      return;
    }

    const now = new Date().toISOString();
    run('UPDATE rate_limit_unlocks SET status = "approved", resolved_at = ? WHERE id = ?', [now, unlockId]);

    // Instantly unlock in memory for the rate limiter!
    unlockClient(item.email, item.ip_address);

    logAuditEvent({
      userId: req.user!.id,
      action: 'RATE_LIMIT_UNLOCK_APPROVED',
      entityType: 'USER',
      details: { email: item.email, ipAddress: item.ip_address },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: `Rate limit approved for ${item.email}. They can now sign in immediately!`,
    });
  } catch (err) {
    console.error('Error approving unlock:', err);
    res.status(500).json({ error: 'Failed to approve rate limit unlock.' });
  }
});
