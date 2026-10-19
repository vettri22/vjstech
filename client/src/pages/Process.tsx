import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Workflow, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Process: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      number: '01',
      title: 'Discovery & Requirements Engineering',
      desc: 'We start by understanding what your software needs to accomplish. We conduct structured requirement discussions to capture user personas, workflows, data models, and non-functional requirements such as target latency and concurrent traffic.',
      deliverables: ['Requirement specification document', 'System scope boundary', 'Target user persona breakdown'],
    },
    {
      number: '02',
      title: 'Scope, Architecture & Technical Proposal',
      desc: 'We translate requirements into a transparent proposal. We recommend database architectures, hosting targets, and component libraries. We provide a clear milestone roadmap with deliverables, realistic timelines, and fixed quotations.',
      deliverables: ['Milestone breakdown schedule', 'Architecture blueprint & tech stack selection', 'Formal written quotation and contract terms'],
    },
    {
      number: '03',
      title: 'UI/UX Design & System Architecture',
      desc: 'Before writing frontend code, our design lead structures user journeys, interactive wireframes, and design tokens for both dark and light modes. Concurrently, our backend engineers construct database schemas and OpenAPI contracts.',
      deliverables: ['Responsive interface prototypes', 'WCAG 2.2 AA contrast design system', 'Normalized database schema & API schemas'],
    },
    {
      number: '04',
      title: 'Iterative Full-Stack Development',
      desc: 'Our team engineers the application in transparent sprints. We write type-safe TypeScript, parameterized queries, and defensive input validation. You can track progress milestones directly through your authenticated Client Portal.',
      deliverables: ['Modular component architecture', 'Documented REST API endpoints', 'Weekly milestone updates in Client Portal'],
    },
    {
      number: '05',
      title: 'Testing, Security Review & Client Staging',
      desc: 'Every feature undergoes rigorous verification before launch. We run cross-device browser tests, verify server-side authorization checks against IDOR vulnerabilities, and deploy to a private staging environment for your team to review.',
      deliverables: ['Automated test suite execution', 'Application security & OWASP audit', 'Staging deployment & feedback revisions'],
    },
    {
      number: '06',
      title: 'Production Deployment & Handover',
      desc: 'We manage domain DNS configuration, SSL/TLS certificates, database migrations, and CI/CD pipelines. Upon final settlement, we hand over complete source code repositories, environment documentation, and system credentials.',
      deliverables: ['Live production launch', 'Full source code repository transfer', 'Deployment & operational documentation'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <Workflow className="w-3.5 h-3.5" />
          <span>{t.process.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-vjs-primary">
          Disciplined, Milestone-Driven Engineering
        </h1>
        <p className="text-base sm:text-lg text-vjs-secondary leading-relaxed">
          From first discovery through production handover, our delivery framework emphasizes predictability, client visibility, and rigorous code quality.
        </p>
      </div>

      {/* Scope Disclaimer */}
      <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface text-xs text-vjs-muted flex items-start gap-2.5 max-w-3xl">
        <ShieldCheck className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Every project is unique. The exact milestone stages, review checkpoints, and timeline durations are agreed upon collaboratively in the written project proposal before development begins.
        </p>
      </div>

      {/* Detailed Steps */}
      <div className="space-y-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface grid grid-cols-1 lg:grid-cols-12 gap-6 items-start hover:border-[#00E5FF]/40 transition-colors"
          >
            <div className="lg:col-span-2">
              <span className="text-3xl sm:text-4xl font-mono font-bold text-[#3B0A6B] dark:text-[#00E5FF]">
                {step.number}
              </span>
            </div>

            <div className="lg:col-span-6 space-y-2">
              <h2 className="text-xl font-bold text-vjs-primary">
                {step.title}
              </h2>
              <p className="text-xs sm:text-sm text-vjs-secondary leading-relaxed">
                {step.desc}
              </p>
            </div>

            <div className="lg:col-span-4 p-4 rounded-xl bg-vjs-surface-elevated border border-vjs-subtle space-y-2">
              <div className="text-[11px] font-mono uppercase tracking-wider text-vjs-muted font-bold">
                Stage Deliverables:
              </div>
              <ul className="space-y-1.5 text-xs text-vjs-secondary">
                {step.deliverables.map((del, dIdx) => (
                  <li key={dIdx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Optional Maintenance & Growth */}
      <div className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
          Beyond Release
        </div>
        <h2 className="text-xl font-bold text-vjs-primary">
          Optional Ongoing Maintenance & Support
        </h2>
        <p className="text-xs sm:text-sm text-vjs-secondary leading-relaxed max-w-3xl">
          Following handover, clients may opt for ongoing maintenance packages covering security dependency updates, scheduled database backups, monitoring, performance tuning, and planned feature enhancements.
        </p>
      </div>

      {/* CTA */}
      <div className="p-8 sm:p-10 rounded-2xl border border-vjs-subtle bg-gradient-to-r from-vjs-surface to-vjs-surface-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-vjs-primary">
            Ready to initiate Step 1?
          </h2>
          <p className="text-xs sm:text-sm text-vjs-secondary max-w-xl">
            Submit your requirements to schedule a structured project discovery session.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs tracking-wide shadow hover:bg-[#33EBFF] transition-colors"
        >
          <span>Request a Project Proposal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
