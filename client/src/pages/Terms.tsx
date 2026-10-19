import React from 'react';
import { FileText } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-vjs-subtle pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <FileText className="w-3.5 h-3.5" />
          <span>Operational Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-vjs-primary">
          Terms of Service & Engagement
        </h1>
        <p className="text-xs font-mono text-vjs-muted">
          Last Updated: October 2026 • Operating Jurisdiction: India
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-vjs-secondary leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            1. Scope of Services & Engagements
          </h2>
          <p>
            VJS TECH provides freelance software solutions, including website development, full-stack application development, database design, API integrations, and UI/UX engineering.
          </p>
          <p>
            Each client engagement is governed by a written proposal, scope specification, and milestone delivery agreement. Any additions or revisions requested outside the mutually agreed scope shall be subject to a formal change request and separate quotation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            2. Intellectual Property & Source Code Ownership
          </h2>
          <p>
            Upon full financial settlement of the contracted milestones, the client receives full ownership of the bespoke source code, database scripts, and customized design assets created specifically for that project.
          </p>
          <p>
            Pre-existing open-source libraries, frameworks (such as React, Node.js), and general architectural design patterns remain subject to their respective open-source licenses (MIT, Apache 2.0).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            3. Client Responsibilities & Timely Reviews
          </h2>
          <p>
            Clients agree to provide necessary project assets (branding guidelines, API keys, content copy) and review milestone deliverables within agreed timeframes to maintain engineering momentum. Delays in client feedback may lead to adjusted delivery timelines.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            4. Payment Terms & Milestone Approvals
          </h2>
          <p>
            Projects proceed in structured stages. Milestone sign-offs indicate that the deliverables have been inspected and approved according to the agreed specification. Payments are processed in INR or equivalent foreign currency through verified channels.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            5. Limitation of Liability & Warranties
          </h2>
          <p>
            We build software following modern secure development practices, defensive parameterization, and automated testing. However, no software can guarantee 100% immunity against third-party upstream outages (such as cloud host failures, third-party API breaking changes, or zero-day exploits). To the extent permitted under applicable law, VJS TECH's liability is limited to the fees paid for the specific affected milestone.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            6. Governing Law & Dispute Resolution
          </h2>
          <p>
            These terms and all project contracts are governed by and construed in accordance with the laws of India. Any disputes arising shall be resolved through good-faith technical discussions, or through arbitration under the Arbitration and Conciliation Act, 1996.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            7. Domain Names & Third-Party Infrastructure Costs
          </h2>
          <p>
            Domain name registrations, registrar renewals, and third-party hosting subscription charges are strictly separate costs. Engineering quotes cover software development, architecture, testing, and deployment setup. Clients may bring their own domain or request VJS TECH assistance in registering one at actual registrar cost.
          </p>
        </section>
      </div>
    </div>
  );
};
