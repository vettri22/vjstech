import { Router, Request, Response } from 'express';
import { queryOne } from '../db';
import { getAuditEvents } from '../services/audit';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';

export const systemRouter = Router();

// GET /api/health
systemRouter.get('/health', (_req: Request, res: Response) => {
  try {
    const dbCheck = queryOne('SELECT 1 as alive');
    const memory = process.memoryUsage();

    res.json({
      status: 'healthy',
      service: 'VJS TECH Backend API',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbCheck?.alive === 1 ? 'connected' : 'unreachable',
      environment: process.env.NODE_ENV || 'development',
      memory: {
        rssMb: Math.round(memory.rss / 1024 / 1024),
        heapUsedMb: Math.round(memory.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(memory.heapTotal / 1024 / 1024),
      },
      nodeVersion: process.version,
    });
  } catch (err: any) {
    res.status(503).json({
      status: 'unhealthy',
      error: err.message,
    });
  }
});

// GET /api/audit (Admin only)
systemRouter.get('/audit', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const events = getAuditEvents(limit);
    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve audit trail.' });
  }
});

// GET /api/docs (OpenAPI-style endpoint directory)
systemRouter.get('/docs', (_req: Request, res: Response) => {
  res.json({
    title: 'VJS TECH Agency & Client Portal API',
    version: '1.0.0',
    endpoints: [
      { path: '/api/health', method: 'GET', auth: 'None', desc: 'System health and metrics' },
      { path: '/api/auth/login', method: 'POST', auth: 'None (Rate-Limited)', desc: 'Client/Admin login' },
      { path: '/api/auth/register', method: 'POST', auth: 'None (Rate-Limited)', desc: 'Client registration' },
      { path: '/api/auth/me', method: 'GET', auth: 'Bearer Token', desc: 'Current user profile' },
      { path: '/api/auth/logout', method: 'POST', auth: 'Bearer Token', desc: 'Invalidate session' },
      { path: '/api/enquiries', method: 'POST', auth: 'Honeypot + Rate-Limited', desc: 'Submit project enquiry' },
      { path: '/api/enquiries', method: 'GET', auth: 'Admin', desc: 'List and filter enquiries' },
      { path: '/api/enquiries/:id', method: 'PATCH', auth: 'Admin', desc: 'Update enquiry status/notes' },
      { path: '/api/projects', method: 'GET', auth: 'Client/Admin', desc: 'List authorized projects (isolated)' },
      { path: '/api/projects/:id', method: 'GET', auth: 'Client/Admin (IDOR Guard)', desc: 'Project detail with milestones' },
      { path: '/api/projects', method: 'POST', auth: 'Admin', desc: 'Create new project record' },
      { path: '/api/team', method: 'GET', auth: 'None', desc: 'List confirmed agency team members' },
      { path: '/api/portfolio', method: 'GET', auth: 'None', desc: 'List verified case studies' },
      { path: '/api/payments/create-order', method: 'POST', auth: 'Client/Admin', desc: 'Server-side validated order' },
      { path: '/api/payments/verify', method: 'POST', auth: 'Client/Admin', desc: 'HMAC signature verification' },
      { path: '/api/audit', method: 'GET', auth: 'Admin', desc: 'Security audit trail' },
    ],
  });
});
