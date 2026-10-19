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

  // Safe schema migration for portfolio order_index column
  try {
    dbInstance.exec("ALTER TABLE portfolio_projects ADD COLUMN order_index INTEGER NOT NULL DEFAULT 0;");
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
        id: '5a047602-88d8-4ab0-849f-056ddc57bdf9',
        name: 'Vijay Vasanthan K S',
        role: 'Project Lead + Client Communication',
        bio: 'Coordinates project planning, client communication, requirement discussions, and delivery alignment.',
        responsibilities: 'Coordinates project planning, client communication, requirement discussions, and delivery alignment.',
        skills: JSON.stringify(['Project Management', 'Client Relations', 'Requirements Engineering', 'Agile Delivery']),
        avatar_initials: 'VV',
        photo_url: '/uploads/team/team_5a047602-88d8-4ab0-849f-056ddc57bdf9_1792401529766.jpg',
        order_index: 1,
      },
      {
        id: 'f0281466-edf5-4394-908c-e8e6e7d4d248',
        name: 'Jai pirajhith M',
        role: 'UI/UX + Frontend',
        bio: 'Focuses on interface design, user experience, responsive layouts, and frontend implementation.',
        responsibilities: 'Focuses on interface design, user experience, responsive layouts, and frontend implementation.',
        skills: JSON.stringify(['UI/UX Design', 'React / TypeScript', 'Design Systems', 'Responsive Web', 'WCAG Accessibility']),
        avatar_initials: 'JP',
        photo_url: '/uploads/team/team_f0281466-edf5-4394-908c-e8e6e7d4d248_1792401279893.png',
        order_index: 2,
      },
      {
        id: '42ad33d5-ca77-4b3c-8777-9d5b1def6bdc',
        name: 'Keerthinandhan Y',
        role: 'Backend + API',
        bio: 'Focuses on backend services, application logic, API development, and system integration.',
        responsibilities: 'Focuses on backend services, application logic, API development, and system integration.',
        skills: JSON.stringify(['REST APIs', 'Node.js / Express', 'Python / FastAPI', 'System Integration', 'Auth & Security']),
        avatar_initials: 'KY',
        photo_url: '/uploads/team/team_42ad33d5-ca77-4b3c-8777-9d5b1def6bdc_1792399975615.png',
        order_index: 3,
      },
      {
        id: '27f1ff30-51f6-4ee2-ba38-bd234364273d',
        name: 'Vettriselvam U',
        role: 'Database + DevOps',
        bio: 'Focuses on database design, data management, deployment workflows, and DevOps responsibilities.',
        responsibilities: 'Focuses on database design, data management, deployment workflows, and DevOps responsibilities.',
        skills: JSON.stringify(['PostgreSQL / SQL', 'Database Optimization', 'Docker & CI/CD', 'Cloud Deployment', 'Linux']),
        avatar_initials: 'VU',
        photo_url: '/uploads/team/team_27f1ff30-51f6-4ee2-ba38-bd234364273d_1792401680094.jpg',
        order_index: 4,
      },
      {
        id: '38df086b-17ea-4089-86a3-723705b77761',
        name: 'Sanjay Kumar E',
        role: 'AI/ML + QA + Security',
        bio: 'Focuses on AI/ML integration, quality assurance, software testing, and security-focused reviews.',
        responsibilities: 'Focuses on AI/ML integration, quality assurance, software testing, and security-focused reviews.',
        skills: JSON.stringify(['AI/ML Integrations', 'Automated Testing', 'Application Security', 'Defensive Hardening', 'Quality Assurance']),
        avatar_initials: 'SK',
        photo_url: '/uploads/team/team_38df086b-17ea-4089-86a3-723705b77761_1792401476777.jpg',
        order_index: 5,
      },
    ];

    for (const member of officialTeam) {
      run(
        `INSERT INTO team_members (id, name, role, bio, responsibilities, skills, avatar_initials, photo_url, order_index, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        [member.id, member.name, member.role, member.bio, member.responsibilities, member.skills, member.avatar_initials, member.photo_url, member.order_index, now, now]
      );
    }
  } else {
    // Migration: Update existing team members with their portrait photo if currently missing
    const defaultPhotos: Record<string, string> = {
      'Vijay Vasanthan K S': '/uploads/team/team_5a047602-88d8-4ab0-849f-056ddc57bdf9_1792401529766.jpg',
      'Jai pirajhith M': '/uploads/team/team_f0281466-edf5-4394-908c-e8e6e7d4d248_1792401279893.png',
      'Keerthinandhan Y': '/uploads/team/team_42ad33d5-ca77-4b3c-8777-9d5b1def6bdc_1792399975615.png',
      'Vettriselvam U': '/uploads/team/team_27f1ff30-51f6-4ee2-ba38-bd234364273d_1792401680094.jpg',
      'Sanjay Kumar E': '/uploads/team/team_38df086b-17ea-4089-86a3-723705b77761_1792401476777.jpg',
    };
    for (const [name, photo] of Object.entries(defaultPhotos)) {
      run("UPDATE team_members SET photo_url = ? WHERE name = ? AND (photo_url IS NULL OR photo_url = '')", [photo, name]);
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

  // Portfolio items seed (All 4 authentic projects including Komudha Boutique and uploaded screenshots)
  const defaultShowcaseProjects = [
    {
      id: '5f44f40b-a4e7-44e1-960e-76d1b4641836',
      title: 'Komudha Boutique',
      slug: 'komudha-boutique-e-commerce-website',
      short_desc: 'Komudha Boutique is a modern women’s fashion e-commerce website featuring an elegant UI, saree and ethnic-wear collections, mobile OTP authentication, product browsing, wishlist, shopping cart, and a seamless online shopping experience. Built with Flask, MySQL, and Razorpay integration.',
      full_desc: 'Komudha Boutique is a full-stack fashion e-commerce website designed to deliver an elegant and seamless online shopping experience. Featuring sarees, kurtis, lehengas, and gowns, the platform combines a modern, responsive UI with product browsing, mobile OTP authentication, wishlist, shopping cart, and online payment integration. Built using Python, Flask, MySQL, HTML, CSS, and JavaScript, the project focuses on user-friendly shopping, secure transactions, and efficient store management.',
      category: 'Full-Stack Web Applications',
      technologies: JSON.stringify(['Python', 'Flask', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Razorpay']),
      cover_image: '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398610269_0.png',
      gallery_images: JSON.stringify([
        '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398610269_0.png',
        '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398623499_0.png',
        '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398623506_1.png',
        '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398623509_2.png',
        '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398623512_3.png',
        '/uploads/portfolio/portfolio_5f44f40b-a4e7-44e1-960e-76d1b4641836_1792398623514_4.png',
      ]),
      role: 'Full Stack Developer',
      architecture_highlights: JSON.stringify([
        'Modular Architecture: Flask-based backend separates application logic from the user interface.',
        'Responsive Frontend: HTML, CSS, and JavaScript deliver a consistent shopping experience across devices.',
        'Relational Database: MySQL organizes customer, product, and order data.',
        'Authentication: Mobile OTP-based login supports convenient account access.',
        'Payment Integration: Razorpay enables online payment processing.',
        'Scalable Design: Modular components support future enhancements, including AI-powered customer assistance and advanced store management.',
      ]),
      project_url: '',
      repo_url: 'https://github.com/vettri22/FUTURE_FS_03.git',
      completion_date: 'Delivered',
      challenge: 'Traditional boutique shopping often requires customers to visit physical stores or browse social media to discover fashion collections. Komudha Boutique addresses this challenge by providing a centralized online platform to explore sarees, kurtis, lehengas, and gowns.',
      solution: 'Komudha Boutique was developed as a full-stack e-commerce platform using Python Flask for backend logic, MySQL for database management, and HTML, CSS, and JavaScript for an interactive frontend. The system features categorized product browsing, mobile OTP authentication, wishlist and cart functionality, Razorpay payment integration, and administrative product and order management. Its responsive design and modular structure provide a user-friendly shopping experience while allowing future enhancements.',
      results: "- Unified Shopping Experience: Integrated fashion categories into a centralized storefront.\n- Responsive UI: Designed a consistent interface for browsing across different screen sizes.\n- Database Integration: Used MySQL to organize and manage application data.\n- Backend Functionality: Implemented server-side application logic using Python and Flask.\n- Payment Readiness: Integrated Razorpay for online payment processing.\n- Maintainable Architecture: Structured the application to support future features and improvements.",
      order_index: 0,
    },
    {
      id: '0dce8433-0aeb-47ea-8339-52b145800a1d',
      title: 'DevBites',
      slug: 'devbites',
      short_desc: 'A full-stack application for bite-sized developer learning and interactive quizzes, with XP and streak-based gamification, automated PDF certificate generation, an administrative panel, analytics dashboards, and a rule-based recommendation system.',
      full_desc: 'DevBites is a full-stack educational web application designed for developer micro-learning and interactive quizzes. The platform features an XP and streak-based gamification engine, automated on-demand PDF certificate generation, an administrative management panel, student performance analytics dashboards, and an intelligent rule-based recommendation system that personalizes learning progression.',
      category: 'Full-Stack Web Applications',
      technologies: JSON.stringify(['Python', 'Flask', 'Chart.js', 'PDF Generation', 'Gamification', 'REST APIs']),
      cover_image: '/uploads/portfolio/portfolio_0dce8433-0aeb-47ea-8339-52b145800a1d_1792397483911_0.png',
      gallery_images: JSON.stringify([
        '/uploads/portfolio/portfolio_0dce8433-0aeb-47ea-8339-52b145800a1d_1792397483911_0.png',
        '/uploads/portfolio/portfolio_0dce8433-0aeb-47ea-8339-52b145800a1d_1792397483916_1.png',
        '/uploads/portfolio/portfolio_0dce8433-0aeb-47ea-8339-52b145800a1d_1792397483917_2.png',
      ]),
      role: 'Full Stack Developer',
      architecture_highlights: JSON.stringify([
        'Rule-based recommendation engine tailoring quizzes to individual progression',
        'Gamification subsystem tracking XP, levels, and consecutive day streaks',
        'Automated server-side PDF certificate generation and verification pipeline',
        'Interactive Chart.js analytics dashboard for administrative oversight',
      ]),
      project_url: '',
      repo_url: 'https://github.com/vettri22/devbites',
      completion_date: 'Completed',
      challenge: 'Designing an engaging developer micro-learning environment that balances fast interactive quizzes with streak gamification, dynamic PDF certificate generation on completion, and insightful instructor analytics without performance lag.',
      solution: 'Architected a modular Python Flask backend with rule-based topic recommendation algorithms, Chart.js learning curve visualization, server-side PDF certificate compilation, and a responsive frontend dashboard.',
      results: 'Delivered gamified XP and streak mechanics, automated on-demand PDF certificate generation, and an administrative analytics portal.',
      order_index: 1,
    },
    {
      id: '5d0706c9-a1a8-43e3-a98f-295d0509d6aa',
      title: 'MineEnergyAI',
      slug: 'mine-energy-ai',
      short_desc: 'An AI-assisted energy-management platform for iron ore mining operations. The project focuses on monitoring and analyzing energy consumption across crushers, conveyors, excavators, pumps, drills, and processing plants, with analytics and prediction-oriented functionality to support energy optimization.',
      full_desc: 'MineEnergyAI is an AI-assisted industrial energy-management platform specifically engineered for iron ore mining operations. It enables granular monitoring and analysis of electrical energy consumption across key machinery—crushers, conveyors, excavators, pumps, drills, and processing plants—providing analytical and prediction-oriented functionality to uncover power waste and support operational energy optimization.',
      category: 'AI & Data Analytics',
      technologies: JSON.stringify(['Python', 'Flask', 'AI/ML', 'Data Analytics', 'Prediction Models']),
      cover_image: '/uploads/portfolio/portfolio_5d0706c9-a1a8-43e3-a98f-295d0509d6aa_1792397512877_1.png',
      gallery_images: JSON.stringify([
        '/uploads/portfolio/portfolio_5d0706c9-a1a8-43e3-a98f-295d0509d6aa_1792397512877_1.png',
        '/uploads/portfolio/portfolio_5d0706c9-a1a8-43e3-a98f-295d0509d6aa_1792397567494_0.png',
      ]),
      role: 'Full Stack & AI Developer',
      architecture_highlights: JSON.stringify([
        'Dedicated telemetry monitoring for crushers, conveyors, excavators, pumps, and drills',
        'AI/ML predictive models forecasting industrial energy consumption trends',
        'Interactive visual analytics tracking machine load profiles and peak power windows',
        'Data-driven recommendations to minimize energy waste in mining processing plants',
      ]),
      project_url: 'https://mineenergyai.onrender.com',
      repo_url: 'https://github.com/vettri22/MineEnergyAI',
      completion_date: 'Completed',
      challenge: 'Heavy mining equipment displays erratic and massive energy consumption curves across varied shifts and ore densities. Identifying energy waste, peak demand surges, and mechanical anomalies requires continuous data modeling across disparate machinery.',
      solution: 'Developed an AI/ML-driven analytics platform with Python and Flask that benchmarks equipment-specific baseline consumption, visualizes multi-tier power usage distributions, and applies predictive models to support proactive energy management.',
      results: 'Delivered multi-equipment energy monitoring across 6 distinct machinery classes with automated outlier detection and predictive optimization analytics.',
      order_index: 2,
    },
    {
      id: 'a54090cb-59fe-46e3-960a-d683a7df6a71',
      title: 'Neural-X',
      slug: 'neural-x',
      short_desc: 'A cybersecurity-focused web platform integrating URL threat detection, QR code intelligence, image forensics, domain intelligence, automated PDF reporting, and security-dashboard features.',
      full_desc: 'Neural-X is a unified cybersecurity and threat intelligence web platform that consolidates essential threat-detection tools into a single operational interface. The system features machine learning-powered URL threat detection, QR code payload extraction and safety analysis, EXIF and structural image forensics, domain DNS/WHOIS intelligence, automated PDF audit reporting, and interactive visual security dashboards.',
      category: 'Cybersecurity & Machine Learning',
      technologies: JSON.stringify(['Python', 'Flask', 'Machine Learning', 'Chart.js', 'Threat Detection', 'Image Forensics']),
      cover_image: '/uploads/portfolio/portfolio_a54090cb-59fe-46e3-960a-d683a7df6a71_1792397529700_0.png',
      gallery_images: JSON.stringify([
        '/uploads/portfolio/portfolio_a54090cb-59fe-46e3-960a-d683a7df6a71_1792397529700_0.png',
        '/uploads/portfolio/portfolio_a54090cb-59fe-46e3-960a-d683a7df6a71_1792397662762_0.png',
        '/uploads/portfolio/portfolio_a54090cb-59fe-46e3-960a-d683a7df6a71_1792397662767_1.png',
      ]),
      role: 'Python & Web Developer',
      architecture_highlights: JSON.stringify([
        'Multi-stage machine learning heuristic model for phishing and malicious URL classification',
        'QR code forensic decoding module extracting raw bytecode and malicious payload redirect paths',
        'Automated EXIF forensic analyzer detecting image alteration, anomalies, and structural integrity',
        'Dynamic domain intelligence querying WHOIS records, SSL parameters, and DNS records',
      ]),
      project_url: 'https://neural-x.onrender.com',
      repo_url: 'https://github.com/vettri22/neural-x',
      completion_date: 'Completed',
      challenge: 'Investigating modern multi-stage cyber threats requires switching between multiple fragmented utilities for URL scanning, QR analysis, image manipulation checks, and domain lookups, leading to slow incident response.',
      solution: 'Constructed a multi-engine security workbench in Python and Flask utilizing machine learning models for URL risk classification, image forensic metadata parsing, QR code verification, domain intelligence gathering, and instant PDF report generation.',
      results: 'Integrated 5 core threat analysis modules into a responsive, real-time security dashboard with automated PDF compliance reports.',
      order_index: 3,
    },
  ];

  const portfolioCheck = query<{ count: number }>('SELECT COUNT(*) as count FROM portfolio_projects');
  if (portfolioCheck[0]?.count === 0) {
    const now = new Date().toISOString();
    for (const p of defaultShowcaseProjects) {
      run(
        `INSERT INTO portfolio_projects (id, title, slug, short_desc, full_desc, category, technologies, cover_image, gallery_images, role, architecture_highlights, project_url, repo_url, completion_date, challenge, solution, results, order_index, is_published, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        [p.id, p.title, p.slug, p.short_desc, p.full_desc, p.category, p.technologies, p.cover_image, p.gallery_images, p.role, p.architecture_highlights, p.project_url, p.repo_url, p.completion_date, p.challenge, p.solution, p.results, p.order_index, now, now]
      );
    }
  } else {
    // Migration: ensure Komudha Boutique exists and all 4 projects have their screenshots and full fields
    const now = new Date().toISOString();
    for (const p of defaultShowcaseProjects) {
      const exists = queryOne<{ id: string; cover_image?: string }>('SELECT id, cover_image FROM portfolio_projects WHERE slug = ?', [p.slug]);
      if (!exists) {
        run(
          `INSERT INTO portfolio_projects (id, title, slug, short_desc, full_desc, category, technologies, cover_image, gallery_images, role, architecture_highlights, project_url, repo_url, completion_date, challenge, solution, results, order_index, is_published, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
          [p.id, p.title, p.slug, p.short_desc, p.full_desc, p.category, p.technologies, p.cover_image, p.gallery_images, p.role, p.architecture_highlights, p.project_url, p.repo_url, p.completion_date, p.challenge, p.solution, p.results, p.order_index, now, now]
        );
      } else if (!exists.cover_image || exists.cover_image === '') {
        run(
          `UPDATE portfolio_projects 
           SET cover_image = ?, gallery_images = ?, role = ?, architecture_highlights = ?, updated_at = ?
           WHERE slug = ?`,
          [p.cover_image, p.gallery_images, p.role, p.architecture_highlights, now, p.slug]
        );
      }
    }
  }
}
