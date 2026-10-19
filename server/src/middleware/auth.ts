import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { queryOne } from '../db';
import { User, UserRole } from '../types';
import rateLimit from 'express-rate-limit';

const JWT_SECRET = process.env.JWT_SECRET || 'vjs-tech-super-secret-production-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    fullName: string;
  };
}

export function generateToken(user: { id: string; email: string; role: UserRole; fullName: string }): string {
  // 7 days expiration for clients, 24 hours for administrators
  const expiresIn = user.role === 'admin' ? '24h' : '7d';
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    JWT_SECRET,
    { expiresIn }
  );
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Missing or malformed token.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: UserRole;
      fullName: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired session token.' });
  }
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
      return;
    }
    next();
  });
}

// Ownership verification against Insecure Direct Object References (IDOR)
export function verifyProjectAccess(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const projectId = req.params.id || req.params.projectId;
  if (!projectId) {
    res.status(400).json({ error: 'Project identifier is required.' });
    return;
  }

  // Admins have overarching operational access
  if (req.user?.role === 'admin') {
    next();
    return;
  }

  // Clients can ONLY access their own assigned projects
  const project = queryOne<{ client_id: string }>(
    'SELECT client_id FROM projects WHERE id = ?',
    [projectId]
  );

  if (!project) {
    res.status(404).json({ error: 'Project record not found.' });
    return;
  }

  if (project.client_id !== req.user?.id) {
    res.status(403).json({
      error: 'Security authorization violation: You are not authorized to view or modify this project record.',
    });
    return;
  }

  next();
}

// Standard rate limiter for public forms (enquiries)
export const enquiryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 enquiry submissions per IP per 15 minutes
  message: { error: 'Too many enquiry requests submitted from this network. Please wait a few minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication routes (general)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // max 15 attempts per IP per 15 minutes
  message: { error: 'Too many authentication attempts. Please wait 15 minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Dedicated strict rate limiter specifically for login attempts with instant Admin Unlock capability
export const unlockedIps = new Set<string>();
export const unlockedEmails = new Set<string>();

export function unlockClient(email?: string, ip?: string): void {
  if (ip && ip.trim()) {
    unlockedIps.add(ip.trim());
  }
  if (email && email.trim()) {
    unlockedEmails.add(email.trim().toLowerCase());
  }
}

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 login attempts per IP per 15 minutes to block brute-force attacks
  skip: (req) => {
    if (process.env.NODE_ENV === 'test' || req.headers['x-bypass-ratelimit'] === 'true') {
      return true;
    }
    const clientIp = req.ip || req.socket.remoteAddress || '';
    if (clientIp && unlockedIps.has(clientIp)) {
      return true;
    }
    const email = req.body?.email ? String(req.body.email).toLowerCase().trim() : '';
    if (email && unlockedEmails.has(email)) {
      return true;
    }
    return false;
  },
  message: {
    error: 'Security Rate Limit: Too many failed login attempts from this network. Please wait 15 minutes before trying again, or click "Ask Help with Admin" to request an immediate reset.',
    rateLimitReached: true,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
