export interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  ogType?: string;
  ogImage?: string;
  h1: string;
  breadcrumb?: Array<{ name: string; url: string }>;
}

export const SEO_ROUTES: Record<string, RouteMeta> = {
  '/': {
    title: 'VJS TECH — Ideas to Intelligent Software | Freelance Software Solutions Agency',
    description: 'VJS TECH is a freelance software solutions agency based in India. We engineer purposeful web applications, custom digital tools, and scalable software architectures.',
    canonical: 'https://vjstech.in/',
    ogType: 'website',
    ogImage: 'https://vjstech.in/og-image.svg',
    h1: 'Ideas to Intelligent Software.',
  },
  '/services': {
    title: 'Services | VJS TECH — Software Engineering & Digital Solutions',
    description: 'Explore VJS TECH software development capabilities: Web Development, Full-Stack Applications, AI Solutions, Cybersecurity, API Integrations, and UI/UX Architecture.',
    canonical: 'https://vjstech.in/services',
    ogType: 'website',
    ogImage: 'https://vjstech.in/og-image.svg',
    h1: 'Software Solutions Engineered for Real Business Needs',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Services', url: 'https://vjstech.in/services' },
    ],
  },
  '/services/web-development': {
    title: 'Web Development Services | VJS TECH',
    description: 'Modern, high-performance web engineering with TypeScript, React, Vite, responsive architecture, and strict accessibility standards.',
    canonical: 'https://vjstech.in/services/web-development',
    ogType: 'website',
    h1: 'Web Application Development',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Services', url: 'https://vjstech.in/services' },
      { name: 'Web Development', url: 'https://vjstech.in/services/web-development' },
    ],
  },
  '/services/full-stack-apps': {
    title: 'Full-Stack Application Development | VJS TECH',
    description: 'Scalable backend APIs, database modeling, secure authentication, and resilient client interfaces built with Python, Node.js, and SQL.',
    canonical: 'https://vjstech.in/services/full-stack-apps',
    ogType: 'website',
    h1: 'Full-Stack Web Applications',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Services', url: 'https://vjstech.in/services' },
      { name: 'Full-Stack Apps', url: 'https://vjstech.in/services/full-stack-apps' },
    ],
  },
  '/services/ui-ux-design': {
    title: 'UI/UX & Design Systems | VJS TECH',
    description: 'Design systems, accessible component architectures, and typography-first interfaces designed for maximum clarity and conversion.',
    canonical: 'https://vjstech.in/services/ui-ux-design',
    ogType: 'website',
    h1: 'UI/UX Design & Design Systems',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Services', url: 'https://vjstech.in/services' },
      { name: 'UI/UX Design', url: 'https://vjstech.in/services/ui-ux-design' },
    ],
  },
  '/services/ai-solutions': {
    title: 'AI & Machine Learning Solutions | VJS TECH',
    description: 'Pragmatic machine learning models, predictive energy analytics, and automated decision engines tailored for operational efficiency.',
    canonical: 'https://vjstech.in/services/ai-solutions',
    ogType: 'website',
    h1: 'AI-Powered Solutions & Data Intelligence',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Services', url: 'https://vjstech.in/services' },
      { name: 'AI Solutions', url: 'https://vjstech.in/services/ai-solutions' },
    ],
  },
  '/services/database-development': {
    title: 'Database Architecture & Optimization | VJS TECH',
    description: 'Relational database schema design, indexing, ACID transaction integrity, and migration pipelines for PostgreSQL and SQLite.',
    canonical: 'https://vjstech.in/services/database-development',
    ogType: 'website',
    h1: 'Database Development & Architecture',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Services', url: 'https://vjstech.in/services' },
      { name: 'Database Development', url: 'https://vjstech.in/services/database-development' },
    ],
  },
  '/services/api-integrations': {
    title: 'API Integrations & Microservices | VJS TECH',
    description: 'RESTful and GraphQL service development, third-party payment gateways, webhook handlers, and enterprise integration middleware.',
    canonical: 'https://vjstech.in/services/api-integrations',
    ogType: 'website',
    h1: 'API Development & Integrations',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Services', url: 'https://vjstech.in/services' },
      { name: 'API Integrations', url: 'https://vjstech.in/services/api-integrations' },
    ],
  },
  '/services/automation-tools': {
    title: 'Automation Tools & Workflow Engineering | VJS TECH',
    description: 'Background job processing, report generation pipelines, PDF automation, and operational scripting to eliminate manual overhead.',
    canonical: 'https://vjstech.in/services/automation-tools',
    ogType: 'website',
    h1: 'Automation & Business Tools',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Services', url: 'https://vjstech.in/services' },
      { name: 'Automation Tools', url: 'https://vjstech.in/services/automation-tools' },
    ],
  },
  '/services/cybersecurity-solutions': {
    title: 'Cybersecurity & Forensic Solutions | VJS TECH',
    description: 'Threat detection tooling, URL intelligence, input sanitization audits, IDOR protection, and security-hardened deployment architecture.',
    canonical: 'https://vjstech.in/services/cybersecurity-solutions',
    ogType: 'website',
    h1: 'Cybersecurity Solutions & Forensics',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Services', url: 'https://vjstech.in/services' },
      { name: 'Cybersecurity', url: 'https://vjstech.in/services/cybersecurity-solutions' },
    ],
  },
  '/work': {
    title: 'Portfolio & Technical Case Studies | VJS TECH',
    description: 'Real-world engineering projects: DevBites developer quiz platform, MineEnergyAI industrial mining energy monitoring, and Neural-X threat intelligence.',
    canonical: 'https://vjstech.in/work',
    ogType: 'website',
    ogImage: 'https://vjstech.in/og-image.svg',
    h1: 'Selected Software Engineering Work',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Work', url: 'https://vjstech.in/work' },
    ],
  },
  '/work/komudha-boutique-e-commerce-website': {
    title: 'Komudha Boutique E-Commerce Website Case Study | VJS TECH',
    description: 'Bespoke modern e-commerce storefront with high-performance product indexing, responsive visual catalog, dynamic cart management, and resilient architecture.',
    canonical: 'https://vjstech.in/work/komudha-boutique-e-commerce-website',
    ogType: 'article',
    h1: 'Komudha Boutique — Modern E-Commerce Platform',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Work', url: 'https://vjstech.in/work' },
      { name: 'Komudha Boutique', url: 'https://vjstech.in/work/komudha-boutique-e-commerce-website' },
    ],
  },
  '/work/devbites': {
    title: 'DevBites Case Study | VJS TECH',
    description: 'Interactive gamified developer learning platform built with Python, Flask, automated PDF certificate generation, and analytics dashboards.',
    canonical: 'https://vjstech.in/work/devbites',
    ogType: 'article',
    h1: 'DevBites — Developer Learning & Gamified Quiz Platform',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Work', url: 'https://vjstech.in/work' },
      { name: 'DevBites', url: 'https://vjstech.in/work/devbites' },
    ],
  },
  '/work/mine-energy-ai': {
    title: 'MineEnergyAI Case Study | VJS TECH',
    description: 'Industrial AI-assisted energy monitoring platform optimizing electrical consumption across heavy mining machinery and crushers.',
    canonical: 'https://vjstech.in/work/mine-energy-ai',
    ogType: 'article',
    h1: 'MineEnergyAI — AI-Assisted Mining Energy Optimization',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Work', url: 'https://vjstech.in/work' },
      { name: 'MineEnergyAI', url: 'https://vjstech.in/work/mine-energy-ai' },
    ],
  },
  '/work/neural-x': {
    title: 'Neural-X Cybersecurity Case Study | VJS TECH',
    description: 'Cybersecurity forensics platform featuring URL intelligence, QR code threat decoding, image forensics, and automated threat reporting.',
    canonical: 'https://vjstech.in/work/neural-x',
    ogType: 'article',
    h1: 'Neural-X — Cybersecurity & Threat Intelligence Platform',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Work', url: 'https://vjstech.in/work' },
      { name: 'Neural-X', url: 'https://vjstech.in/work/neural-x' },
    ],
  },
  '/about': {
    title: 'About Us | VJS TECH — Freelance Software Solutions Agency',
    description: 'Learn about VJS TECH, our engineering philosophy, commitment to transparent delivery, and technical capabilities based in India.',
    canonical: 'https://vjstech.in/about',
    ogType: 'website',
    h1: 'Ideas to Intelligent Software.',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'About', url: 'https://vjstech.in/about' },
    ],
  },
  '/team': {
    title: 'Team & Leadership | VJS TECH',
    description: 'Meet the engineering and product team behind VJS TECH, led by founder Vettriselvam V.',
    canonical: 'https://vjstech.in/team',
    ogType: 'website',
    h1: 'Engineering & Product Team',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Team', url: 'https://vjstech.in/team' },
    ],
  },
  '/process': {
    title: 'Our Engineering Process | VJS TECH',
    description: 'Discovery, architecture, iterative development, security verification, and structured handover: how we build software systematically.',
    canonical: 'https://vjstech.in/process',
    ogType: 'website',
    h1: 'Disciplined, Milestone-Driven Engineering',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Process', url: 'https://vjstech.in/process' },
    ],
  },
  '/contact': {
    title: 'Contact & Project Enquiry | VJS TECH',
    description: 'Directly discuss your software requirements with VJS TECH. WhatsApp: +91 9360761552, Email: vjstechofficial@gmail.com.',
    canonical: 'https://vjstech.in/contact',
    ogType: 'website',
    h1: 'Initiate a Project Engagement',
    breadcrumb: [
      { name: 'Home', url: 'https://vjstech.in/' },
      { name: 'Contact', url: 'https://vjstech.in/contact' },
    ],
  },
  '/privacy': {
    title: 'Privacy Policy | VJS TECH',
    description: 'VJS TECH privacy policy detailing data protection, client information security, and compliance with the Digital Personal Data Protection Act.',
    canonical: 'https://vjstech.in/privacy',
    ogType: 'website',
    h1: 'Privacy Policy & Data Notice',
  },
  '/terms': {
    title: 'Terms of Service | VJS TECH',
    description: 'VJS TECH terms and conditions governing software development services, deliverables, intellectual property, and payment milestones.',
    canonical: 'https://vjstech.in/terms',
    ogType: 'website',
    h1: 'Terms of Service & Engagement',
  },
  '/cookies': {
    title: 'Cookie Policy | VJS TECH',
    description: 'Information about cookie usage, essential session tokens, and privacy preferences on the VJS TECH website.',
    canonical: 'https://vjstech.in/cookies',
    ogType: 'website',
    h1: 'Cookie Policy & Audit',
  },
  '/refunds': {
    title: 'Refund Policy | VJS TECH',
    description: 'VJS TECH refund and cancellation terms for software development milestones and consulting services.',
    canonical: 'https://vjstech.in/refunds',
    ogType: 'website',
    h1: 'Refund & Cancellation Policy',
  },
  '/login': {
    title: 'Client & Admin Login | VJS TECH',
    description: 'Secure portal authentication for VJS TECH clients and administrators.',
    canonical: 'https://vjstech.in/login',
    ogType: 'website',
    h1: 'Log In to Client Portal',
  },
  '/404': {
    title: 'Page Not Found | VJS TECH',
    description: 'The requested page could not be located on the VJS TECH server.',
    canonical: 'https://vjstech.in/404',
    ogType: 'website',
    h1: 'Page Not Located',
  },
};

/**
 * Checks for 301 Permanent Redirect targets
 */
export function getRedirectUrl(requestPath: string): string | null {
  // 1. Normalize trailing slash (e.g. /services/ -> /services)
  if (requestPath.length > 1 && requestPath.endsWith('/')) {
    return requestPath.slice(0, -1);
  }

  // 2. Legacy alias redirects (301 Moved Permanently)
  const legacyMap: Record<string, string> = {
    '/portfolio': '/work',
    '/portfolio/devbites': '/work/devbites',
    '/portfolio/mine-energy-ai': '/work/mine-energy-ai',
    '/portfolio/neural-x': '/work/neural-x',
    '/case-studies': '/work',
    '/case-study': '/work',
    '/case-study/devbites': '/work/devbites',
    '/case-study/mine-energy-ai': '/work/mine-energy-ai',
    '/case-study/neural-x': '/work/neural-x',
    '/home': '/',
  };

  if (legacyMap[requestPath]) {
    return legacyMap[requestPath];
  }

  return null;
}

/**
 * Injects dynamic SEO metadata, canonical tags, and Open Graph data into index.html
 */
export function injectSeoMetadata(htmlTemplate: string, requestPath: string): string {
  const meta = SEO_ROUTES[requestPath] || SEO_ROUTES['/'];

  let rendered = htmlTemplate;

  // Replace Title
  rendered = rendered.replace(
    /<title>.*?<\/title>/i,
    `<title>${meta.title}</title>`
  );

  // Replace or update Meta Description
  if (rendered.includes('name="description"')) {
    rendered = rendered.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${meta.description}" />`
    );
  }

  // Replace Canonical Link
  if (rendered.includes('rel="canonical"')) {
    rendered = rendered.replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${meta.canonical}" />`
    );
  }

  // Replace Open Graph Tags
  rendered = rendered.replace(
    /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:title" content="${meta.title}" />`
  );
  rendered = rendered.replace(
    /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:description" content="${meta.description}" />`
  );
  rendered = rendered.replace(
    /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:url" content="${meta.canonical}" />`
  );
  rendered = rendered.replace(
    /<meta\s+property="og:type"\s+content=".*?"\s*\/?>/i,
    `<meta property="og:type" content="${meta.ogType || 'website'}" />`
  );

  // Replace Twitter Card Tags
  rendered = rendered.replace(
    /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:title" content="${meta.title}" />`
  );
  rendered = rendered.replace(
    /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
    `<meta name="twitter:description" content="${meta.description}" />`
  );

  // Dynamic Google Search Console verification token from environment variable
  if (process.env.GOOGLE_SITE_VERIFICATION) {
    rendered = rendered.replace(
      /<meta\s+name="google-site-verification"\s+content=".*?"\s*\/?>/i,
      `<meta name="google-site-verification" content="${process.env.GOOGLE_SITE_VERIFICATION}" />`
    );
  }

  // Inject Breadcrumbs Schema JSON-LD if applicable
  if (meta.breadcrumb && meta.breadcrumb.length > 0) {
    const breadcrumbJson = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: meta.breadcrumb.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: b.url,
      })),
    };

    const breadcrumbTag = `<script type="application/ld+json">${JSON.stringify(breadcrumbJson)}</script>\n  </head>`;
    rendered = rendered.replace('</head>', breadcrumbTag);
  }

  // Semantic Server-Side Fallback Prerender inside <div id="root">
  const ssrFallback = `<div id="root"><header class="sr-only"><h1>${meta.h1}</h1><p>${meta.description}</p></header></div>`;
  rendered = rendered.replace('<div id="root"></div>', ssrFallback);

  return rendered;
}
