export interface ServiceDetail {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  targetAudience: string[];
  deliverables: string[];
  processSteps: { title: string; desc: string }[];
  techStack: string[];
  faqs: { q: string; a: string }[];
}

export const servicesData: ServiceDetail[] = [
  {
    id: 'web-dev',
    slug: 'web-development',
    title: 'Website Development',
    tagline: 'High-performance, accessible, and search-optimized business websites.',
    shortDescription:
      'We craft fast, responsive websites, landing pages, and redesigns built on clean semantic code with strong SEO and accessibility foundations.',
    fullDescription:
      'Our website development offering delivers tailored web presences designed to communicate credibility, load quickly across Indian and global networks, and convert visitors into qualified leads. Every build incorporates semantic HTML5, responsive CSS grids, Core Web Vitals optimization, and structured metadata.',
    targetAudience: [
      'Early-stage founders needing a professional market presence',
      'Small and medium enterprises upgrading legacy web pages',
      'Institutions requiring compliant, accessible information portals',
      'Businesses launching dedicated landing pages for marketing campaigns',
    ],
    deliverables: [
      'Custom responsive design adapted for 320px mobile to 4K displays',
      'Lighthouse 90+ performance and Core Web Vitals compliance',
      'SEO metadata architecture, OpenGraph tags, and sitemap generation',
      'Accessible semantic structure (WCAG 2.2 AA target)',
      'Self-hostable static output or modern Jamstack architecture',
    ],
    processSteps: [
      { title: 'Information Architecture', desc: 'Wireframing key pages, navigation hierarchy, and call-to-action pathways.' },
      { title: 'Design & Tokenization', desc: 'Visual direction, typography scales, responsive layouts, and contrast verification.' },
      { title: 'Component Engineering', desc: 'Semantic implementation using React, TypeScript, and modern CSS.' },
      { title: 'Performance & QA', desc: 'Cross-browser testing, network throttling simulation, and accessibility review.' },
    ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'HTML5/CSS3', 'Lighthouse'],
    faqs: [
      {
        q: 'Will the website work seamlessly on slow mobile networks?',
        a: 'Yes. We optimize asset payloads, bundle sizes, and image formats to ensure fast interactive loads even on constrained 3G/4G connections.',
      },
      {
        q: 'Can we manage or edit text content after delivery?',
        a: 'Yes. We structure all copy into modular content configurations or headless CMS integrations as required by your team.',
      },
    ],
  },
  {
    id: 'full-stack',
    slug: 'full-stack-apps',
    title: 'Full-Stack Web Applications',
    tagline: 'Robust web applications with scalable backends and fluid interfaces.',
    shortDescription:
      'End-to-end full-stack engineering combining reactive frontend architectures with secure APIs, parameterized databases, and role-based admin panels.',
    fullDescription:
      'We build full-stack web applications engineered for business reliability. From multi-role user dashboards to complex internal workflows, we implement resilient architectures with strict authorization boundaries, audit trails, and maintainable data models.',
    targetAudience: [
      'Startups building minimum viable products (MVPs) or core SaaS platforms',
      'Companies digitizing paper-based or spreadsheet-dependent workflows',
      'Agencies requiring custom multi-tenant portals for client collaboration',
    ],
    deliverables: [
      'Modular frontend built with React, TypeScript, and state management',
      'Documented RESTful API backend with input validation schemas',
      'Relational database architecture with foreign keys and migrations',
      'Role-based access control (RBAC) and JWT/session authentication',
      'Operational administrative dashboard with filtering and export',
    ],
    processSteps: [
      { title: 'Domain Modelling', desc: 'Entity-relationship diagrams, access control matrices, and API contracts.' },
      { title: 'Backend Foundation', desc: 'Database migration scripts, authentication middleware, and input sanitization.' },
      { title: 'Frontend Integration', desc: 'Type-safe client bindings, optimistic UI updates, and error handling.' },
      { title: 'End-to-End Verification', desc: 'Automated integration testing and staging review before release.' },
    ],
    techStack: ['TypeScript', 'React', 'Node.js', 'Express', 'PostgreSQL', 'SQLite', 'Zod', 'JWT'],
    faqs: [
      {
        q: 'How is client data protected between accounts?',
        a: 'We enforce server-side ownership checks on every route and database query to strictly prevent Insecure Direct Object References (IDOR).',
      },
      {
        q: 'Can the application scale as user numbers increase?',
        a: 'Yes. Our architectures use stateless authentication, indexed queries, connection pooling, and CDN caching for static assets.',
      },
    ],
  },
  {
    id: 'ui-ux',
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    tagline: 'Purpose-driven digital product design grounded in human usability.',
    shortDescription:
      'User journeys, wireframes, high-fidelity prototypes, and design systems focused on clarity, visual hierarchy, and accessible interaction.',
    fullDescription:
      'Great software begins with intentional product design. We eliminate cognitive clutter and guide users naturally toward their goals. We create consistent design tokens, editorial typography, and high-contrast interfaces that look refined in both dark and light modes.',
    targetAudience: [
      'Product teams with complex technical features requiring intuitive interfaces',
      'Founders seeking a distinctive, non-generic brand and product identity',
      'Organizations redesigning legacy software for improved employee productivity',
    ],
    deliverables: [
      'User journey maps and task flow diagrams',
      'Low-fidelity wireframes and structural page layouts',
      'High-fidelity interactive component designs and responsive mockups',
      'Comprehensive design tokens (colors, typography, spacing, surface elevations)',
      'WCAG 2.2 AA contrast and keyboard accessibility audits',
    ],
    processSteps: [
      { title: 'Problem Discovery', desc: 'Mapping user personas, primary jobs-to-be-done, and pain points.' },
      { title: 'Wireframing', desc: 'Iterative low-fidelity sketches focused purely on information architecture.' },
      { title: 'Visual Art Direction', desc: 'Establishing typography, color palettes, micro-interactions, and dark/light palettes.' },
      { title: 'Component Systematization', desc: 'Creating reusable design tokens and documentation for engineering handover.' },
    ],
    techStack: ['Figma', 'Design Systems', 'CSS Variables', 'Tailwind CSS', 'WCAG 2.2 AA Guidelines'],
    faqs: [
      {
        q: 'Do you design for both dark and light modes?',
        a: 'Yes. Every interface is designed with dedicated semantic tokens for both themes, ensuring readable contrast in all lighting environments.',
      },
    ],
  },
  {
    id: 'ai-solutions',
    slug: 'ai-solutions',
    title: 'AI-Powered Solutions',
    tagline: 'Pragmatic artificial intelligence integration for automation and intelligence.',
    shortDescription:
      'Computer vision, intelligent search, API integrations, and workflow automation designed with clear limitations, data privacy, and reliability in mind.',
    fullDescription:
      'We bring practical AI capabilities to your digital tools without the hype. Whether you need real-time computer vision inference (such as gesture tracking), retrieval-augmented intelligent search, or API integrations with LLMs, we engineer defensive, privacy-first solutions.',
    targetAudience: [
      'Businesses looking to automate repetitive data processing and classification',
      'Companies wanting intelligent document search and customer assistance',
      'Innovators creating computer vision and interactive assistive technology',
    ],
    deliverables: [
      'Model integration via secure backend proxies (keeping API keys private)',
      'Computer vision pipelines using OpenCV and MediaPipe for real-time tracking',
      'Retrieval-Augmented Generation (RAG) pipelines for internal documents',
      'Strict fallback logic and data sanitization to prevent hallucinations',
      'Transparent data handling compliant with Indian privacy standards',
    ],
    processSteps: [
      { title: 'Feasibility Review', desc: 'Defining clear technical boundaries, error tolerances, and latency constraints.' },
      { title: 'Pipeline Architecture', desc: 'Data ingestion, vector embeddings, or real-time frame processing pipelines.' },
      { title: 'Model & API Integration', desc: 'Connecting models through resilient, rate-limited backend microservices.' },
      { title: 'Evaluation & Guardrails', desc: 'Benchmarking latency, response accuracy, and safety constraints.' },
    ],
    techStack: ['Python', 'FastAPI', 'OpenCV', 'MediaPipe', 'PyTorch', 'REST APIs', 'WebSockets'],
    faqs: [
      {
        q: 'Is client proprietary data shared with public AI models?',
        a: 'No. We configure private endpoints and ensure that client documents and personal data are never used for public model training.',
      },
    ],
  },
  {
    id: 'database-dev',
    slug: 'database-development',
    title: 'Database Development',
    tagline: 'Reliable data modelling, relational schema design, and query optimization.',
    shortDescription:
      'Data architecture designed for referential integrity, performant indexing, automated migrations, and disaster recovery planning.',
    fullDescription:
      'Your application is only as resilient as its data tier. We design normalized schemas, write parameterized queries, establish foreign key constraints, and implement automated migration pipelines. From SQLite embedded databases to high-concurrency PostgreSQL clusters, we ensure your data remains consistent and secure.',
    targetAudience: [
      'Companies facing database slow-downs and unindexed query bottlenecks',
      'Startups architecting data models for new multi-tenant applications',
      'Organizations migrating legacy unstructured data into relational systems',
    ],
    deliverables: [
      'Third-normal-form relational data models and schema definitions',
      'Strategic indexing strategies targeting high-frequency read/write queries',
      'Version-controlled migration scripts for reproducible deployments',
      'Automated backup routines, point-in-time recovery, and integrity validation',
      'Connection pooling and concurrency configuration',
    ],
    processSteps: [
      { title: 'Entity Relationship Design', desc: 'Normalizing tables, primary/foreign keys, and constraint rules.' },
      { title: 'Migration Scripting', desc: 'Writing reversible schema migration files and seed scripts.' },
      { title: 'Query Profiling', desc: 'Analyzing EXPLAIN query plans and optimizing high-latency join operations.' },
      { title: 'Resilience Strategy', desc: 'Configuring WAL mode, read replicas, and scheduled database snapshots.' },
    ],
    techStack: ['PostgreSQL', 'SQLite', 'SQL', 'Knex / Prisma', 'pg_dump', 'Docker'],
    faqs: [
      {
        q: 'Do you support automated database backups?',
        a: 'Yes. We provide documented scripts and cron automation for regular scheduled snapshots with off-site replication.',
      },
    ],
  },
  {
    id: 'api-dev',
    slug: 'api-integrations',
    title: 'API Development and Integration',
    tagline: 'Secure, documented RESTful services and third-party system connections.',
    shortDescription:
      'High-throughput APIs built with strict input validation, rate limiting, OpenAPI documentation, and resilient third-party integrations.',
    fullDescription:
      'We engineer dependable APIs that serve as the backbone of modern web, mobile, and third-party partner ecosystems. We emphasize defensive parameter validation, structured error responses, cryptographic signature verification (such as payment webhooks), and detailed API documentation.',
    targetAudience: [
      'Businesses connecting frontend clients to backend infrastructure',
      'Companies integrating payment gateways, CRM tools, or SMS/Email providers',
      'Organizations exposing partner integration endpoints to external vendors',
    ],
    deliverables: [
      'RESTful endpoints adhering to consistent HTTP status conventions',
      'Strict schema validation using Zod or Pydantic on all request payloads',
      'Token-based authentication (JWT / API Key) and rate limiting',
      'Interactive OpenAPI / Swagger documentation',
      'Idempotent webhook receivers with cryptographic signature verification',
    ],
    processSteps: [
      { title: 'Contract Definition', desc: 'Drafting request/response payloads, endpoint paths, and error codes.' },
      { title: 'Endpoint Construction', desc: 'Developing business logic, database queries, and middleware guards.' },
      { title: 'Third-Party Webhooks', desc: 'Implementing idempotent receivers and HMAC signature verification.' },
      { title: 'Load & Security Testing', desc: 'Simulating concurrent traffic, testing rate limits, and checking input validation.' },
    ],
    techStack: ['Node.js', 'Express', 'FastAPI', 'TypeScript', 'Zod', 'OpenAPI', 'Postman'],
    faqs: [
      {
        q: 'How do you prevent malicious API payloads and injection?',
        a: 'We use strict schema validation that strips unrecognized fields, together with parameterized queries that prevent SQL injection completely.',
      },
    ],
  },
  {
    id: 'automation-tools',
    slug: 'automation-tools',
    title: 'Automation & Business Tools',
    tagline: 'Custom operational tools that eliminate repetitive administrative work.',
    shortDescription:
      'Internal dashboards, automated report generation, data scrapers, and operational workflows that save hours of manual overhead.',
    fullDescription:
      'Repetitive administrative tasks drain team momentum. We build bespoke operational software, scheduled report pipelines, data sync services, and internal management tools that streamline day-to-day operations and free your team to focus on core growth.',
    targetAudience: [
      'Operations managers spending hours weekly on manual spreadsheet updates',
      'Customer support teams needing centralized ticket and task dispatching',
      'Finance teams automating invoice generation and payment tracking',
    ],
    deliverables: [
      'Custom internal operational dashboards and admin interfaces',
      'Scheduled background cron jobs for periodic reports and data sync',
      'Automated email/WhatsApp transactional dispatch triggers',
      'Data import/export pipelines with validation and error reporting',
      'Audit log tracking for every administrative modification',
    ],
    processSteps: [
      { title: 'Workflow Audit', desc: 'Pinpointing the exact manual bottlenecks and data handoffs.' },
      { title: 'Pipeline Architecture', desc: 'Designing queues, worker scripts, and trigger conditions.' },
      { title: 'Tool Development', desc: 'Building responsive controls, dashboards, and automated scripts.' },
      { title: 'Operational Handover', desc: 'Testing real edge-case data and training staff on operation.' },
    ],
    techStack: ['Node.js', 'Python', 'Cron', 'React', 'Tailwind CSS', 'CSV / Excel Pipelines'],
    faqs: [
      {
        q: 'Can automated tools run continuously without manual supervision?',
        a: 'Yes. We deploy background daemon processes with automated restart capabilities, health logging, and failure alerting.',
      },
    ],
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce-development',
    title: 'E-commerce Development',
    tagline: 'Clean, reliable product catalogues, shopping carts, and order workflows.',
    shortDescription:
      'Bespoke e-commerce solutions with clear product administration, server-verified pricing, and secure payment gateway integrations.',
    fullDescription:
      'We build transparent e-commerce platforms designed for trust and reliability. We avoid bloated monolithic templates in favor of lightweight, fast-loading shopping experiences with server-side price validation, inventory tracking, and payment verification.',
    targetAudience: [
      'Direct-to-consumer brands looking for high-performance bespoke stores',
      'B2B suppliers requiring wholesale order management portals',
      'Service businesses selling digital goods, bookings, or subscriptions',
    ],
    deliverables: [
      'Fast-loading responsive product catalogue with category filtering',
      'Client-side cart with persistent storage and stock availability checks',
      'Server-side order creation with strict price and tax calculation',
      'Integrated payment checkout via Razorpay or equivalent gateway',
      'Order fulfillment status management and email receipts',
    ],
    processSteps: [
      { title: 'Catalogue Modelling', desc: 'Structuring products, variants, pricing tiers, and tax rules.' },
      { title: 'Cart & Checkout Flow', desc: 'Optimizing checkout friction, address capture, and validation.' },
      { title: 'Payment Gateway Wiring', desc: 'Configuring server-side orders, hosted checkouts, and webhooks.' },
      { title: 'Order Management', desc: 'Developing the fulfillment admin panel and customer notifications.' },
    ],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Razorpay SDK', 'Tailwind CSS'],
    faqs: [
      {
        q: 'Can product prices be manipulated by malicious browser tampering?',
        a: 'Never. All prices, discounts, and order totals are calculated and verified authoritatively on the server before payment creation.',
      },
    ],
  },
  {
    id: 'cybersecurity',
    slug: 'cybersecurity-solutions',
    title: 'Cybersecurity Solutions',
    tagline: 'Security-conscious application architecture and defensive hardening.',
    shortDescription:
      'Defensive code reviews, authentication hardening, OWASP Top 10 mitigation, and secure development practices within agreed project scope.',
    fullDescription:
      'Security is an engineering prerequisite, not an afterthought. We implement security-by-design across your applications: strict parameterization, CSRF protection, secure cookie flags, least-privilege database roles, Content Security Policies, and rate limiting against brute-force attacks.',
    targetAudience: [
      'Organizations preparing web applications for production deployment',
      'Founders seeking a defensive security review of their authentication architecture',
      'Companies needing compliance alignment with Indian CERT-In guidelines',
    ],
    deliverables: [
      'Application security review against OWASP Top 10 vulnerabilities',
      'Authentication hardening (bcrypt/argon2, rate limiting, session expiry)',
      'Cross-Site Scripting (XSS) and SQL Injection remediation',
      'HTTP security headers configuration (HSTS, CSP, X-Frame-Options)',
      'Documented security practices and incident response guidance',
    ],
    processSteps: [
      { title: 'Architecture Review', desc: 'Inspecting data flow diagrams, trust boundaries, and credential handling.' },
      { title: 'Static Code Analysis', desc: 'Reviewing database access patterns, input validation, and dependencies.' },
      { title: 'Remediation Implementation', desc: 'Hardening headers, parameterized queries, and auth cookies.' },
      { title: 'Security Documentation', desc: 'Providing clear audit findings and operational security guidelines.' },
    ],
    techStack: ['OWASP Guidelines', 'Helmet', 'Bcrypt', 'Zod', 'CERT-In Principles', 'Dependency Auditing'],
    faqs: [
      {
        q: 'Do you conduct unauthorized penetration testing?',
        a: 'No. All security reviews are conducted strictly on agreed scopes with formal authorization, focusing on defensive code hardening.',
      },
    ],
  },
  {
    id: 'custom-software',
    slug: 'custom-software',
    title: 'Custom Software Development',
    tagline: 'Tailored software systems engineered for your exact operational requirements.',
    shortDescription:
      'Bespoke digital tools, management platforms, and system integrations built around your specific business logic rather than generic off-the-shelf software.',
    fullDescription:
      'When commercial off-the-shelf software cannot accommodate your business model, we engineer requirement-specific software. We listen closely to your operational workflows and build clean, maintainable systems that scale with your organization.',
    targetAudience: [
      'Businesses with unique workflows unserved by off-the-shelf SaaS products',
      'Institutions requiring custom administrative, evaluation, or tracking systems',
      'Enterprises needing custom middleware bridging disparate software tools',
    ],
    deliverables: [
      'Full requirement discovery document and software specification',
      'Custom database models and business logic microservices',
      'Modular user interfaces built for daily operational speed',
      'Role-based permission hierarchy for varied team levels',
      'Full source code ownership and technical deployment documentation',
    ],
    processSteps: [
      { title: 'Requirements Engineering', desc: 'In-depth interviews to translate business logic into software specs.' },
      { title: 'System Architecture', desc: 'Choosing appropriate database engines, protocols, and interface paradigms.' },
      { title: 'Iterative Sprints', desc: 'Delivering functional increments with continuous client review.' },
      { title: 'Deployment & Training', desc: 'Staging deployment, staff walkthroughs, and production handover.' },
    ],
    techStack: ['TypeScript', 'React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'Git'],
    faqs: [
      {
        q: 'Who owns the intellectual property and source code?',
        a: 'You do. Upon completion and milestone settlement, all custom source code and technical assets belong entirely to your company.',
      },
    ],
  },
  {
    id: 'mobile-apps',
    slug: 'mobile-apps',
    title: 'Mobile App Development',
    tagline: 'Responsive mobile experiences and cross-platform application solutions.',
    shortDescription:
      'Cross-platform applications and Progressive Web Apps (PWAs) backed by scalable cloud APIs, built with clean responsive mobile principles.',
    fullDescription:
      'We focus on high-utility cross-platform mobile solutions and Progressive Web Apps (PWAs) connected to secure backends. We clearly state our mobile capabilities: we engineer responsive cross-platform web and mobile frontends backed by robust REST APIs, ensuring your users enjoy fluid mobile experiences on Android and iOS.',
    targetAudience: [
      'Businesses wanting a mobile presence without the massive overhead of separate native teams',
      'Teams requiring mobile field data entry and inventory scanning tools',
      'Startups needing a unified mobile and desktop product experience',
    ],
    deliverables: [
      'Mobile-first responsive interface optimized for touchscreen interaction',
      'Progressive Web App (PWA) offline caching and home-screen installability',
      'Backend API integration with efficient low-bandwidth data payloads',
      'Hardware integration (camera/QR scanning where supported)',
      'Cross-device testing across popular screen ratios and OS versions',
    ],
    processSteps: [
      { title: 'Mobile UX Flows', desc: 'Thumb-friendly touch targets, simplified forms, and gestures.' },
      { title: 'Frontend Construction', desc: 'Responsive components with high-performance CSS and touch handling.' },
      { title: 'Offline & PWA Configuration', desc: 'Service workers, web manifests, and local caching strategies.' },
      { title: 'Device Verification', desc: 'Physical device testing on Android and iOS viewports.' },
    ],
    techStack: ['React', 'TypeScript', 'PWA / Service Workers', 'Tailwind CSS', 'REST APIs'],
    faqs: [
      {
        q: 'Do you claim native Swift (iOS) or Kotlin (Android) expertise?',
        a: 'We are completely transparent: we focus on modern cross-platform web applications and PWAs. If your project specifically demands low-level native OS integrations, we will advise you accordingly.',
      },
    ],
  },
];
