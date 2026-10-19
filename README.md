# VJS TECH — Freelance Software Solutions Agency Platform

> **"Ideas to Intelligent Software."**  
> Professional, technically capable, transparent, approachable, modern, and delivery-focused.

---

## 1. Executive Summary & Identity

- **Company Name:** VJS TECH
- **Business Type:** Freelance Software Solutions Agency
- **Operating Jurisdiction:** India
- **Primary Official Email:** [vjstechofficial@gmail.com](mailto:vjstechofficial@gmail.com)
- **WhatsApp / Contact Phone:** [+91 9360761552](https://wa.me/919360761552)
- **Primary Palette:**
  - **Obsidian Black:** `#050505`
  - **Deep Royal Purple:** `#3B0A6B`
  - **Electric Cyan:** `#00E5FF`
- **Themes:** Persistent Dark Mode & Light Mode (WCAG 2.2 Level AA contrast compliant)
- **Internationalization (i18n):** English (`en`), Tamil (`ta` — தமிழ்), Hindi (`hi` — हिंदी)
- **Animation Restrictions:** Strict prohibition of mouse-following or cursor-triggered animations. Purposeful, accessible micro-interactions with reduced-motion support.

---

## 2. Official Confirmed Team Structure

The platform features the exact 5 confirmed team members and their assigned operational responsibilities:

1. **Vijay Vasanthan K S** — *Project Lead + Client Communication*  
   Coordinates project planning, client communication, requirement discussions, and delivery alignment.
2. **Jai pirajhith M** — *UI/UX + Frontend*  
   Focuses on interface design, user experience, responsive layouts, and frontend implementation.
3. **Keerthinandhan Y** — *Backend + API*  
   Focuses on backend services, application logic, API development, and system integration.
4. **Vettriselvam U** — *Database + DevOps*  
   Focuses on database design, data management, deployment workflows, and DevOps responsibilities.
5. **Sanjay Kumar E** — *AI/ML + QA + Security*  
   Focuses on AI/ML integration, quality assurance, software testing, and security-focused reviews.

---

## 3. Technical Architecture

A clean, production-grade client-server architecture:

```
vjstech/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Footer, Logo, ThemeToggle, LangSelector, TechnicalIllustration, TeamCard)
│   │   ├── context/            # State Contexts (ThemeContext, LanguageContext, AuthContext)
│   │   ├── data/               # 11 Service Specs & Verified Case Studies
│   │   ├── i18n/               # Multilingual translations (en, ta, hi)
│   │   ├── pages/              # 17 Complete Routes (Home, Services, ServiceDetail, Work, CaseStudy, About, Team, Process, Contact, Login, Register, Portal, Admin, Privacy, Terms, Cookies, Refunds, 404)
│   │   ├── App.tsx             # Route orchestration & Accessible Skip Link
│   │   └── index.css           # Semantic CSS variables for Brand Tokens
│   ├── vite.config.ts          # Vite 6 + Tailwind CSS v4 + API Proxy
│   └── package.json
│
├── server/                     # Backend API & Authentication
│   ├── src/
│   │   ├── db/                 # WebAssembly SQLite (sql.js) + Schema Migrations + Seed + pg Pool support
│   │   ├── middleware/         # JWT Auth, Role Guards, IDOR Project Ownership Guard, Rate Limiters
│   │   ├── routes/             # auth, enquiries, projects, team, portfolio, payments, system
│   │   ├── services/           # Audit logging service
│   │   ├── types/              # Strict TypeScript interfaces
│   │   └── index.ts            # Express 4 server, Helmet, CORS, unified static serving
│   ├── data/                   # Persistent SQLite database (vjstech.db)
│   ├── test/                   # Automated Node.js test suite
│   ├── .env.example            # Environment configuration template
│   └── package.json
└── package.json                # Root orchestration scripts
```

---

## 4. Implemented Services (11 Dedicated Detail Routes)

1. **Website Development** (`/services/web-development`)
2. **Full-Stack Web Applications** (`/services/full-stack-apps`)
3. **UI/UX Design** (`/services/ui-ux-design`)
4. **AI-Powered Solutions** (`/services/ai-solutions`)
5. **Database Development** (`/services/database-development`)
6. **API Development & Integrations** (`/services/api-integrations`)
7. **Automation & Business Tools** (`/services/automation-tools`)
8. **E-commerce Development** (`/services/ecommerce-development`)
9. **Cybersecurity Solutions** (`/services/cybersecurity-solutions`)
10. **Custom Software Development** (`/services/custom-software`)
11. **Mobile App Development** (`/services/mobile-apps`)

---

## 5. Security & Privacy Implementations

- **IDOR Defense:** Project endpoints (`/api/projects/:id`) enforce strict server-side ownership verification. Clients can *never* view or tamper with other clients' project records by changing URL IDs.
- **Defensive Input Validation:** Schema enforcement using Zod.
- **Anti-Spam Controls:** Hidden honeypot field (`website_hp`) silently drops automated bots, coupled with IP rate-limiting (`express-rate-limit`).
- **Duplicate Submission Guard:** Prevents duplicate submissions within 60 seconds.
- **Reference Tracking Codes:** Human-readable unique codes generated on each submission (e.g. `VJS-2026-XXXX`).
- **Zero-Surveillance:** Zero third-party ad pixels, analytics beacons, or session-replay scripts.

---

## 6. Compliance & Legal Framework

Dedicated, transparent legal pages linked from footer:
1. **Privacy Policy (`/privacy`):** Aligned with the *Digital Personal Data Protection Act, 2023 (DPDP Act)*, DPDP Rules 2025, and CERT-In directions. Clear data categories, retention terms, and grievance contact.
2. **Terms of Service (`/terms`):** Detailed terms on project proposals, scope boundaries, milestone approvals, full IP/source-code transfer to client upon settlement, and limitation of liability under Indian law.
3. **Cookie Policy (`/cookies`):** Complete audit of essential storage tokens (`vjs_theme`, `vjs_lang`, `vjs_auth_token`), explaining why no intrusive cookie banners are required for zero-tracker sites.
4. **Refund & Cancellation Policy (`/refunds`):** Milestone-based refund terms for custom software, 100% reversal within 5–7 days for erroneous/duplicate transactions, and formal dispute channels.

---

## 7. Testing & Quality Assurance

Automated backend test suite (`npx tsx --test test/api.test.ts`):
- ✔ System Health API (`GET /api/health`)
- ✔ Confirmed Team Members API (`GET /api/team` - 5 verified members)
- ✔ Public Portfolio API (`GET /api/portfolio`)
- ✔ Authentication: Login with Invalid Credentials (rejection with 401)
- ✔ Authentication: Demo Client Login (200 OK + JWT)
- ✔ Authorization: Client Isolation & IDOR Defense (forbidden 403 on foreign/admin data)
- ✔ Enquiries: Validation & Submission (`POST /api/enquiries` - reference code generation)

Production client build:
- Built in 2.77s with Vite 6 + TypeScript 5 (`npm run build`).

---

## 8. Quick Start & Operational Commands

### Development Mode:
```powershell
# From project root (D:\vjstech)
npm run install:all

# Run backend server
npm run dev:server

# Run frontend client (with hot reloading on port 3000)
npm run dev:client
```

### Production Build & Unified Serving:
```powershell
# Build client bundle
npm run build:client

# Start backend server (serves both API & Frontend on http://localhost:5000)
npm run dev:server
```

### Run Automated Tests:
```powershell
npm run test:server
```

---

## 9. Default Demo Accounts for Testing

- **Administrator Portal:**
  - URL: `http://localhost:5000/admin`
  - Email: `admin@vjstech.local`
  - Password: `VjsTechAdmin@2026`
- **Client Project Portal:**
  - URL: `http://localhost:5000/portal`
  - Email: `client@example.com`
  - Password: `ClientDemo@2026`
