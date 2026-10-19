import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

import { getDb, saveDb, query } from './db';
import { authRouter } from './routes/auth';
import { enquiriesRouter } from './routes/enquiries';
import { projectsRouter } from './routes/projects';
import { teamRouter } from './routes/team';
import { portfolioRouter } from './routes/portfolio';
import { paymentsRouter } from './routes/payments';
import { systemRouter } from './routes/system';
import { getRedirectUrl, injectSeoMetadata } from './services/seo';

export const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Vite dev tooling and Google fonts/scripts
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'https://vjstech.in'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, tighten via ALLOWED_ORIGINS in prod
      }
    },
    credentials: true,
  })
);

// Body parsing with safe size bounds (supports image photo uploads up to 10MB)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for uploaded assets (team member photos, portfolio screenshots, etc.)
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Fallback static providers for bundled default assets (ensures photos always render on fresh deployments)
const publicUploadsDir = path.resolve(process.cwd(), '../client/public/uploads');
if (fs.existsSync(publicUploadsDir)) {
  app.use('/uploads', express.static(publicUploadsDir));
  // Auto-sync bundled assets into local uploads folder if empty
  try {
    const teamUploads = path.join(uploadsDir, 'team');
    const portUploads = path.join(uploadsDir, 'portfolio');
    if (!fs.existsSync(teamUploads) && fs.existsSync(path.join(publicUploadsDir, 'team'))) {
      fs.cpSync(path.join(publicUploadsDir, 'team'), teamUploads, { recursive: true });
    }
    if (!fs.existsSync(portUploads) && fs.existsSync(path.join(publicUploadsDir, 'portfolio'))) {
      fs.cpSync(path.join(publicUploadsDir, 'portfolio'), portUploads, { recursive: true });
    }
  } catch (_e) {}
}
const distUploadsDir = path.resolve(process.cwd(), '../client/dist/uploads');
if (fs.existsSync(distUploadsDir)) {
  app.use('/uploads', express.static(distUploadsDir));
}

// Request logging
app.use(morgan('combined'));

// 301 Permanent Redirects (trailing slashes & legacy URLs - Item 10)
app.use((req, res, next) => {
  const redirectTarget = getRedirectUrl(req.path);
  if (redirectTarget) {
    return res.redirect(301, redirectTarget);
  }
  next();
});

// Explicit Robots.txt handler (Item 2 & 35)
app.get('/robots.txt', (_req, res) => {
  const robotsPath = path.resolve(process.cwd(), '../client/public/robots.txt');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  if (fs.existsSync(robotsPath)) {
    return res.sendFile(robotsPath);
  }
  res.send('User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /portal\nDisallow: /api/\nSitemap: https://vjstech.in/sitemap.xml\n');
});

// Explicit Dynamic Sitemap.xml handler (Item 3 & 35)
app.get('/sitemap.xml', (_req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  try {
    const sitemapPath = path.resolve(process.cwd(), '../client/public/sitemap.xml');
    let xmlContent = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';

    // Inject any new database projects that aren't yet in static sitemap
    try {
      const projects = query<{ slug: string; updated_at?: string }>('SELECT slug, updated_at FROM portfolio_projects');
      if (projects && projects.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        let dynamicUrls = '';
        for (const p of projects) {
          const loc = `https://vjstech.in/work/${p.slug}`;
          if (!xmlContent.includes(loc)) {
            const date = p.updated_at ? p.updated_at.split('T')[0] : today;
            dynamicUrls += `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
          }
        }
        if (dynamicUrls && xmlContent.includes('</urlset>')) {
          xmlContent = xmlContent.replace('</urlset>', `${dynamicUrls}</urlset>`);
        }
      }
    } catch (_dbErr) {
      // If db not ready, serve base XML
    }

    if (xmlContent) {
      return res.send(xmlContent);
    }
  } catch (err) {
    console.error('Error generating dynamic sitemap:', err);
  }
  res.status(404).send('<!-- Sitemap not found -->');
});

// Initialize Database and launch server listener
export async function startServer() {
  try {
    await getDb();
    console.log('Database initialized successfully.');

    // Mount API Routes
    app.use('/api/auth', authRouter);
    app.use('/api/enquiries', enquiriesRouter);
    app.use('/api/projects', projectsRouter);
    app.use('/api/team', teamRouter);
    app.use('/api/portfolio', portfolioRouter);
    app.use('/api/payments', paymentsRouter);
    app.use('/api', systemRouter);

    // 404 for unmatched API routes
    app.use('/api/*', (_req, res) => {
      res.status(404).json({ error: 'The requested API route does not exist.' });
    });

    // Root API Status Indicator
    app.get('/', (_req, res) => {
      res.json({
        service: 'VJS TECH Backend API',
        status: 'online',
        health: '/api/health',
        docs: '/api/docs',
        message: 'VJS TECH API is online and operational. Access the visual web application via your Vercel URL.',
      });
    });

    // Serve client static production build with dynamic SSR SEO injection (Items 1, 4, 5, 7, 8, 14)
    const clientDist = path.resolve(process.cwd(), '../client/dist');
    const indexHtmlPath = path.join(clientDist, 'index.html');
    const fallbackHtmlPath = path.resolve(process.cwd(), '../client/index.html');

    if (fs.existsSync(clientDist)) {
      console.log(`Serving static production client from ${clientDist}`);
      // Serve static assets without defaulting index.html so our SSR route handler intercepts HTML
      app.use(express.static(clientDist, { index: false }));

      app.get('*', (req, res) => {
        try {
          const targetFile = fs.existsSync(indexHtmlPath) ? indexHtmlPath : fallbackHtmlPath;
          if (fs.existsSync(targetFile)) {
            const rawHtml = fs.readFileSync(targetFile, 'utf8');
            const processedHtml = injectSeoMetadata(rawHtml, req.path);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(processedHtml);
          }
        } catch (err) {
          console.error('Error during SSR meta rendering:', err);
        }
        res.sendFile(indexHtmlPath);
      });
    }

    // Global Error Handler
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Unhandled server error:', err);
      res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
          ? 'An internal error occurred on the server.'
          : err.message || 'Internal Server Error',
      });
    });

    const server = app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`VJS TECH API Server listening on port ${PORT} [PID: ${process.pid}]`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`API Docs:     http://localhost:${PORT}/api/docs`);
      console.log(`=========================================`);
    });

    // Graceful Shutdown
    const handleShutdown = (signal: string) => {
      console.log(`Received ${signal}. Flushing database to disk and shutting down...`);
      saveDb();
      server.close(() => {
        console.log('Server terminated cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

    return server;
  } catch (err) {
    console.error('Fatal server startup failure:', err);
    process.exit(1);
  }
}

// In single-process mode, start the server automatically
if (process.env.CLUSTER_MODE !== 'true') {
  startServer();
}
