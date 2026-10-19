import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { SCHEMA_SQL } from './schema';

let dbInstance: SqlJsDatabase | null = null;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'vjstech.db');

export async function getDb(): Promise<SqlJsDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    dbInstance = new SQL.Database(fileBuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  // Initialize schema
  dbInstance.exec(SCHEMA_SQL);

  // Safe schema migration for team member photo_url column
  try {
    dbInstance.exec('ALTER TABLE team_members ADD COLUMN photo_url TEXT;');
  } catch (_e) {
    // Column already exists
  }

  // Safe schema migration for users client_status column
  try {
    dbInstance.exec("ALTER TABLE users ADD COLUMN client_status TEXT NOT NULL DEFAULT 'active';");
  } catch (_e) {
    // Column already exists
  }

  // Safe schema migration for portfolio gallery_images column
  try {
    dbInstance.exec("ALTER TABLE portfolio_projects ADD COLUMN gallery_images TEXT DEFAULT '[]';");
  } catch (_e) {
    // Column already exists
  }

  // Safe schema migration for portfolio role column
  try {
    dbInstance.exec("ALTER TABLE portfolio_projects ADD COLUMN role TEXT DEFAULT 'Full Stack Developer';");
  } catch (_e) {
    // Column already exists
  }

  // Safe schema migration for portfolio architecture_highlights column
  try {
    dbInstance.exec("ALTER TABLE portfolio_projects ADD COLUMN architecture_highlights TEXT DEFAULT '[]';");
  } catch (_e) {
    // Column already exists
  }

  saveDb();

  // Run initial seeds if needed
  await seedInitialData(dbInstance);

  return dbInstance;
}

export function saveDb(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to save database to disk:', err);
  }
}

export function query<T = any>(sqlStr: string, params: any[] = []): T[] {
  if (!dbInstance) throw new Error('Database not initialized. Call getDb() first.');
  const stmt = dbInstance.prepare(sqlStr);
  stmt.bind(params);
  const rows: T[] = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject() as unknown as T);
  }
  stmt.free();
  return rows;
}

export function queryOne<T = any>(sqlStr: string, params: any[] = []): T | null {
  const rows = query<T>(sqlStr, params);
  return rows.length > 0 ? rows[0] : null;
}

export function run(sqlStr: string, params: any[] = []): { changes: number } {
  if (!dbInstance) throw new Error('Database not initialized. Call getDb() first.');
  const stmt = dbInstance.prepare(sqlStr);
  stmt.run(params);
  stmt.free();
  const changes = dbInstance.getRowsModified();
  saveDb();
  return { changes };
}

export function exec(sqlStr: string): void {
  if (!dbInstance) throw new Error('Database not initialized. Call getDb() first.');
  dbInstance.exec(sqlStr);
  saveDb();
}

async function seedInitialData(db: SqlJsDatabase): Promise<void> {
  // Check if team members are seeded
  const teamCheck = query<{ count: number }>('SELECT COUNT(*) as count FROM team_members');
  if (teamCheck[0]?.count === 0) {
    console.log('Seeding official VJS TECH team members...');
    const now = new Date().toISOString();

    const officialTeam = [
      {
        id: uuidv4(),
        name: 'Vijay Vasanthan K S',
        role: 'Project Lead + Client Communication',
        bio: 'Coordinates project planning, client communication, requirement discussions, and delivery alignment.',
        responsibilities: 'Coordinates project planning, client communication, requirement discussions, and delivery alignment.',
        skills: JSON.stringify(['Project Management', 'Client Relations', 'Requirements Engineering', 'Agile Delivery']),
        avatar_initials: 'VV',
        order_index: 1,
      },
      {
        id: uuidv4(),
        name: 'Jai pirajhith M',
        role: 'UI/UX + Frontend',
        bio: 'Focuses on interface design, user experience, responsive layouts, and frontend implementation.',
        responsibilities: 'Focuses on interface design, user experience, responsive layouts, and frontend implementation.',
        skills: JSON.stringify(['UI/UX Design', 'React / TypeScript', 'Design Systems', 'Responsive Web', 'WCAG Accessibility']),
        avatar_initials: 'JP',
        order_index: 2,
      },
      {
        id: uuidv4(),
        name: 'Keerthinandhan Y',
        role: 'Backend + API',
        bio: 'Focuses on backend services, application logic, API development, and system integration.',
        responsibilities: 'Focuses on backend services, application logic, API development, and system integration.',
        skills: JSON.stringify(['REST APIs', 'Node.js / Express', 'Python / FastAPI', 'System Integration', 'Auth & Security']),
        avatar_initials: 'KY',
        order_index: 3,
      },
      {
        id: uuidv4(),
        name: 'Vettriselvam U',
        role: 'Database + DevOps',
        bio: 'Focuses on database design, data management, deployment workflows, and DevOps responsibilities.',
        responsibilities: 'Focuses on database design, data management, deployment workflows, and DevOps responsibilities.',
        skills: JSON.stringify(['PostgreSQL / SQL', 'Database Optimization', 'Docker & CI/CD', 'Cloud Deployment', 'Linux']),
        avatar_initials: 'VU',
        order_index: 4,
      },
      {
        id: uuidv4(),
        name: 'Sanjay Kumar E',
        role: 'AI/ML + QA + Security',
        bio: 'Focuses on AI/ML integration, quality assurance, software testing, and security-focused reviews.',
        responsibilities: 'Focuses on AI/ML integration, quality assurance, software testing, and security-focused reviews.',
        skills: JSON.stringify(['AI/ML Integrations', 'Automated Testing', 'Application Security', 'Defensive Hardening', 'Quality Assurance']),
        avatar_initials: 'SK',
        order_index: 5,
      },
    ];

    for (const member of officialTeam) {
      run(
        `INSERT INTO team_members (id, name, role, bio, responsibilities, skills, avatar_initials, order_index, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        [member.id, member.name, member.role, member.bio, member.responsibilities, member.skills, member.avatar_initials, member.order_index, now, now]
      );
    }
  }

  // Clean up old placeholder admin if present
  run("DELETE FROM users WHERE email = 'admin@vjstech.local'");

  // Ensure definitive admin user exists and is provisioned securely via environment variables
  const adminEmail = process.env.ADMIN_INITIAL_EMAIL;
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const now = new Date().toISOString();

    const existingAdmin = queryOne<{ id: string }>('SELECT id FROM users WHERE email = ?', [adminEmail]);
    if (!existingAdmin) {
      const adminId = uuidv4();
      run(
        `INSERT INTO users (id, email, password_hash, full_name, role, organization, phone, created_at, updated_at)
         VALUES (?, ?, ?, ?, 'admin', 'VJS TECH Administration', '+91 9360761552', ?, ?)`,
        [adminId, adminEmail, passwordHash, 'VJS TECH Administrator', now, now]
      );
      console.log(`Administrator account provisioned: ${adminEmail}`);
    } else {
      run(
        `UPDATE users SET password_hash = ?, role = 'admin', full_name = ?, updated_at = ? WHERE id = ?`,
        [passwordHash, 'VJS TECH Administrator', now, existingAdmin.id]
      );
    }
  } else {
    // If no environment variables are provided, verify that at least one admin already exists in the database
    const adminCount = queryOne<{ count: number }>("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    if (!adminCount || adminCount.count === 0) {
      console.warn('[SECURITY NOTICE] No admin user exists and ADMIN_INITIAL_EMAIL / ADMIN_INITIAL_PASSWORD are not set.');
      console.warn('[SECURITY NOTICE] Please define ADMIN_INITIAL_EMAIL and ADMIN_INITIAL_PASSWORD in your environment variables.');
    }
  }

  // Check demo client user for client portal demonstration/testing
  const clientCheck = query<{ count: number }>("SELECT COUNT(*) as count FROM users WHERE role = 'client'");
  if (clientCheck[0]?.count === 0) {
    const clientEmail = 'client@example.com';
    const clientPassword = 'ClientDemo@2026';
    const passwordHash = await bcrypt.hash(clientPassword, 10);
    const now = new Date().toISOString();
    const clientId = uuidv4();

    run(
      `INSERT INTO users (id, email, password_hash, full_name, role, organization, phone, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'client', 'Nexus Solutions Ltd', '+91 9876543210', ?, ?)`,
      [clientId, clientEmail, passwordHash, 'Rohan Verma', now, now]
    );

    // Create an authorized demo project for this client to demonstrate real milestone tracking and status
    const projectId = uuidv4();
    run(
      `INSERT INTO projects (id, reference_code, name, slug, client_id, description, status, start_date, target_end_date, created_at, updated_at)
       VALUES (?, 'VJS-2026-NEX01', 'Operations Management Portal', 'operations-management-portal', ?, ?, 'In Development', '2026-10-01', '2026-11-30', ?, ?)`,
      [
        projectId,
        clientId,
        'Custom enterprise dashboard for inventory tracking, order management workflows, and automated reporting.',
        now,
        now,
      ]
    );

    // Milestones for this project
    const milestones = [
      { title: 'Requirements Architecture & User Flow Mapping', desc: 'Wireframes, schema design, and API contract specification.', status: 'approved', order: 1, date: '2026-10-08' },
      { title: 'Database Schema & Core Backend API Endpoints', desc: 'PostgreSQL data models, JWT authentication, and inventory service.', status: 'completed', order: 2, date: '2026-10-18' },
      { title: 'Responsive Frontend Dashboard & Admin Views', desc: 'React components, responsive data tables, filtering, and theme support.', status: 'in_progress', order: 3, date: '2026-11-05' },
      { title: 'Automated Testing, Security Review & Handover', desc: 'End-to-end testing, role authorization audits, and deployment documentation.', status: 'pending', order: 4, date: '2026-11-25' },
    ];

    for (const m of milestones) {
      run(
        `INSERT INTO milestones (id, project_id, title, description, status, due_date, order_index, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), projectId, m.title, m.desc, m.status, m.date, m.order, now]
      );
    }

    // Add initial project update
    run(
      `INSERT INTO project_updates (id, project_id, author_id, author_name, title, message, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        projectId,
        clientId,
        'Vijay Vasanthan K S (Project Lead)',
        'Sprint 2 Complete: Core API & Database Layer',
        'Backend CRUD endpoints for inventory items and auth role guard have been finalized. The frontend dashboard layout integration is now underway.',
        now,
      ]
    );
  }

  // Clean up obsolete dummy projects if present
  run("DELETE FROM portfolio_projects WHERE slug IN ('gesture-vision-studio', 'taskflow-operations-engine', 'securegate-access-control')");

  // Portfolio items seed (Authentic projects from resume with transparent architecture)
  const portfolioCheck = query<{ count: number }>('SELECT COUNT(*) as count FROM portfolio_projects');
  if (portfolioCheck[0]?.count === 0) {
    const now = new Date().toISOString();
    const showcaseProjects = [
      {
        id: uuidv4(),
        title: 'DevBites',
        slug: 'devbites',
        short_desc: 'A full-stack application for bite-sized developer learning and interactive quizzes, with XP and streak-based gamification, automated PDF certificate generation, an administrative panel, analytics dashboards, and a rule-based recommendation system.',
        full_desc: 'DevBites is a full-stack educational web application designed for developer micro-learning and interactive quizzes. The platform features an XP and streak-based gamification engine, automated on-demand PDF certificate generation, an administrative management panel, student performance analytics dashboards, and an intelligent rule-based recommendation system that personalizes learning progression.',
        category: 'Full-Stack Web Applications',
        technologies: JSON.stringify(['Python', 'Flask', 'Chart.js', 'PDF Generation', 'Gamification', 'REST APIs']),
        cover_image: '',
        project_url: '',
        repo_url: 'https://github.com/vettri22/devbites',
        challenge: 'Designing an engaging developer micro-learning environment that balances fast interactive quizzes with streak gamification, dynamic PDF certificate generation on completion, and insightful instructor analytics without performance lag.',
        solution: 'Architected a modular Python Flask backend with rule-based topic recommendation algorithms, Chart.js learning curve visualization, server-side PDF certificate compilation, and a responsive frontend dashboard.',
        results: 'Delivered gamified XP and streak mechanics, automated on-demand PDF certificate generation, and an administrative analytics portal.',
      },
      {
        id: uuidv4(),
        title: 'MineEnergyAI',
        slug: 'mine-energy-ai',
        short_desc: 'An AI-assisted energy-management platform for iron ore mining operations. The project focuses on monitoring and analyzing energy consumption across crushers, conveyors, excavators, pumps, drills, and processing plants, with analytics and prediction-oriented functionality to support energy optimization.',
        full_desc: 'MineEnergyAI is an AI-assisted industrial energy-management platform specifically engineered for iron ore mining operations. It enables granular monitoring and analysis of electrical energy consumption across key machinery—crushers, conveyors, excavators, pumps, drills, and processing plants—providing analytical and prediction-oriented functionality to uncover power waste and support operational energy optimization.',
        category: 'AI & Data Analytics',
        technologies: JSON.stringify(['Python', 'Flask', 'AI/ML', 'Data Analytics', 'Prediction Models']),
        cover_image: '',
        project_url: '',
        repo_url: 'https://github.com/vettri22/MineEnergyAI',
        challenge: 'Heavy mining equipment displays erratic and massive energy consumption curves across varied shifts and ore densities. Identifying energy waste, peak demand surges, and mechanical anomalies requires continuous data modeling across disparate machinery.',
        solution: 'Developed an AI/ML-driven analytics platform with Python and Flask that benchmarks equipment-specific baseline consumption, visualizes multi-tier power usage distributions, and applies predictive models to support proactive energy management.',
        results: 'Delivered multi-equipment energy monitoring across 6 distinct machinery classes with automated outlier detection and predictive optimization analytics.',
      },
      {
        id: uuidv4(),
        title: 'Neural-X',
        slug: 'neural-x',
        short_desc: 'A cybersecurity-focused web platform integrating URL threat detection, QR code intelligence, image forensics, domain intelligence, automated PDF reporting, and security-dashboard features.',
        full_desc: 'Neural-X is a unified cybersecurity and threat intelligence web platform that consolidates essential threat-detection tools into a single operational interface. The system features machine learning-powered URL threat detection, QR code payload extraction and safety analysis, EXIF and structural image forensics, domain DNS/WHOIS intelligence, automated PDF audit reporting, and interactive visual security dashboards.',
        category: 'Cybersecurity & Machine Learning',
        technologies: JSON.stringify(['Python', 'Flask', 'Machine Learning', 'Chart.js', 'Threat Detection', 'Image Forensics']),
        cover_image: '',
        project_url: '',
        repo_url: 'https://github.com/vettri22/neural-x',
        challenge: 'Investigating modern multi-stage cyber threats requires switching between multiple fragmented utilities for URL scanning, QR analysis, image manipulation checks, and domain lookups, leading to slow incident response.',
        solution: 'Constructed a multi-engine security workbench in Python and Flask utilizing machine learning models for URL risk classification, image forensic metadata parsing, QR code verification, domain intelligence gathering, and instant PDF report generation.',
        results: 'Integrated 5 core threat analysis modules into a responsive, real-time security dashboard with automated PDF compliance reports.',
      },
    ];

    for (const p of showcaseProjects) {
      run(
        `INSERT INTO portfolio_projects (id, title, slug, short_desc, full_desc, category, technologies, cover_image, project_url, repo_url, challenge, solution, results, is_published, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        [p.id, p.title, p.slug, p.short_desc, p.full_desc, p.category, p.technologies, p.cover_image, p.project_url, p.repo_url, p.challenge, p.solution, p.results, now, now]
      );
    }
  }

  // Populate authentic role and architecture_highlights for seeded portfolio projects if empty
  try {
    run(
      `UPDATE portfolio_projects 
       SET role = 'Full Stack Developer',
           architecture_highlights = ?,
           completion_date = 'Completed'
       WHERE slug = 'devbites' AND (architecture_highlights IS NULL OR architecture_highlights = '[]')`,
      [JSON.stringify([
        'Rule-based recommendation engine tailoring quizzes to individual progression',
        'Gamification subsystem tracking XP, levels, and consecutive day streaks',
        'Automated server-side PDF certificate generation and verification pipeline',
        'Interactive Chart.js analytics dashboard for administrative oversight',
      ])]
    );

    run(
      `UPDATE portfolio_projects 
       SET role = 'Full Stack & AI Developer',
           architecture_highlights = ?,
           completion_date = 'Completed'
       WHERE slug = 'mine-energy-ai' AND (architecture_highlights IS NULL OR architecture_highlights = '[]')`,
      [JSON.stringify([
        'Dedicated telemetry monitoring for crushers, conveyors, excavators, pumps, and drills',
        'AI/ML predictive models forecasting industrial energy consumption trends',
        'Interactive visual analytics tracking machine load profiles and peak power windows',
        'Data-driven recommendations to minimize energy waste in mining processing plants',
      ])]
    );

    run(
      `UPDATE portfolio_projects 
       SET role = 'Python & Web Developer',
           architecture_highlights = ?,
           completion_date = 'Completed'
       WHERE slug = 'neural-x' AND (architecture_highlights IS NULL OR architecture_highlights = '[]')`,
      [JSON.stringify([
        'Multi-stage machine learning heuristic model for phishing and malicious URL classification',
        'QR code forensic decoding module extracting raw bytecode and malicious payload redirect paths',
        'Automated EXIF forensic analyzer detecting image alteration, anomalies, and structural integrity',
        'Dynamic domain intelligence querying WHOIS records, SSL parameters, and DNS records',
      ])]
    );
  } catch (_e) {}
}
