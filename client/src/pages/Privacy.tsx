import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-vjs-subtle pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>DPDP Act 2023 Aligned Notice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-vjs-primary">
          Privacy Policy & Data Notice
        </h1>
        <p className="text-xs font-mono text-vjs-muted">
          Effective Date: October 17, 2026 • Last Reviewed: October 2026
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-vjs-secondary leading-relaxed">
        {/* 1. Entity */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            1. Responsible Entity & Scope
          </h2>
          <p>
            This Privacy Policy applies to the website and client platforms operated by <strong>VJS TECH</strong>, an independent freelance software solutions agency based in India.
          </p>
          <p>
            We respect your privacy by design and by default. This notice explains what information we collect, why we collect it, how it is secured, and your rights under applicable Indian laws, including the <em>Digital Personal Data Protection Act, 2023 (DPDP Act)</em> and relevant CERT-In cybersecurity directives.
          </p>
        </section>

        {/* 2. Data Categories */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            2. Categories of Personal Data Collected
          </h2>
          <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface space-y-2">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>
                  <strong>Project Enquiries:</strong> Full name, business email address, optional contact/WhatsApp number, organization name, project title, and requirement descriptions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>
                  <strong>Client Portal Accounts:</strong> Full name, email address, cryptographically hashed passwords (via bcrypt), assigned project identifiers, and milestone notes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>
                  <strong>System Security Logs:</strong> Timestamped security events (authentication success/failure, IP address, audit logs) retained strictly to prevent brute-force attacks and abuse.
                </span>
              </li>
            </ul>
          </div>
          <p className="text-xs text-vjs-muted">
            We do NOT collect government identity documents (Aadhaar, PAN), biometric data, or financial banking credentials directly on our servers.
          </p>
        </section>

        {/* 3. Purpose of Processing */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            3. Purpose and Legal Basis of Processing
          </h2>
          <p>We process personal data solely for:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Evaluating software project specifications and providing transparent quotations.</li>
            <li>Coordinating sprint milestones and delivering contracted software engineering services.</li>
            <li>Authenticating clients to their protected project dashboard.</li>
            <li>Complying with statutory cybersecurity logging obligations under CERT-In directions.</li>
          </ul>
        </section>

        {/* 4. No Third-Party Tracking or Ads */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            4. Third-Party Sharing & Tracking Audit
          </h2>
          <p>
            VJS TECH maintains a strict zero-surveillance policy. We do NOT run third-party advertising pixels, session-replay surveillance scripts, or behavioral data brokers. Client project specifications and personal information are NEVER sold, rented, or utilized for training public generative AI models without explicit written permission.
          </p>
        </section>

        {/* 5. Security Safeguards */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            5. Security Safeguards
          </h2>
          <p>
            All network communication is encrypted in transit via modern TLS/HTTPS. Passwords are never stored in plaintext and are hashed using bcrypt with salted rounds. Every protected API route enforces server-side ownership checks to prevent unauthorized access across accounts (IDOR defense).
          </p>
        </section>

        {/* 6. Retention and Your Rights */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            6. Retention & Your Rights
          </h2>
          <p>
            Enquiry data is retained for the duration of the project scoping and engagement. You have the right to request access to your personal data, request correction of inaccurate records, withdraw consent, or request permanent deletion of your account by contacting our team.
          </p>
        </section>

        {/* 7. Grievance Contact */}
        <section className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            7. Grievance Redressal & Official Contact
          </h2>
          <p className="text-xs">
            For questions regarding this policy, data access requests, or privacy concerns, please contact our designated team directly:
          </p>
          <div className="text-xs font-mono space-y-1 text-vjs-secondary">
            <div>Agency: VJS TECH</div>
            <div>Primary Email: vjstechofficial@gmail.com</div>
            <div>WhatsApp / Telephone: +91 9360761552</div>
            <div>Jurisdiction: India</div>
          </div>
        </section>
      </div>
    </div>
  );
};
