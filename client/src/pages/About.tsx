import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Compass } from 'lucide-react';

export const About: React.FC = () => {
  const principles = [
    {
      title: 'Understand the Actual Problem',
      desc: 'We do not begin coding until we have deeply mapped the user workflows, operational bottlenecks, and business constraints that the software must solve.',
    },
    {
      title: 'Choose the Right Technical Solution',
      desc: 'We select frameworks, database engines, and architectures based on what your application genuinely requires — never to chase fleeting technology trends.',
    },
    {
      title: 'Design Around the People Who Use It',
      desc: 'Usability is not an afterthought. We build interfaces with clear visual hierarchy, accessible contrast, and zero cognitive clutter.',
    },
    {
      title: 'Build With Maintainability in Mind',
      desc: 'Clean code, strict type systems, parameterized queries, and modular components ensure that your software remains maintainable as your team grows.',
    },
    {
      title: 'Test Thoroughly Before Release',
      desc: 'Every endpoint, form input, database migration, and responsive breakpoint is verified across devices before handover.',
    },
    {
      title: 'Communicate Clearly Throughout',
      desc: 'No vague progress reports. We provide clear milestone updates, documented contracts, and direct engineer access.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <Compass className="w-3.5 h-3.5" />
          <span>About VJS TECH</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-vjs-primary">
          Ideas to Intelligent Software.
        </h1>
        <p className="text-base sm:text-lg text-vjs-secondary leading-relaxed">
          VJS TECH is a freelance software solutions initiative based in India, focused on engineering purposeful, well-designed digital products for individuals, startups, institutions, and growing businesses.
        </p>
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-vjs-secondary leading-relaxed">
          <p>
            We operate as a delivery-focused software agency. Rather than selling generic pre-packaged website templates or marketing superficial visual gimmicks, our focus is on foundational engineering quality.
          </p>
          <p>
            Whether constructing a high-performance business website, an internal operations dashboard, a complex full-stack web application, or an intelligent computer vision tool, our approach balances user experience with rigorous application security.
          </p>
          <div className="pt-2">
            <Link
              to="/team"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#00E5FF] hover:underline"
            >
              <span>Meet the 5 Core Engineers Behind VJS TECH</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Fact Card */}
        <div className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
            Identity & Standards
          </div>
          <h2 className="text-xl font-bold text-vjs-primary">How We Operate</h2>
          <div className="space-y-2.5 text-xs text-vjs-secondary">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0" />
              <span>Independent technical initiative based in India</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0" />
              <span>Full source-code and IP handover on milestone settlement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0" />
              <span>Transparent milestone progress through client portal</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0" />
              <span>Strict compliance with Indian data privacy (DPDP Act 2023)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Engineering Principles */}
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
            Foundations
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-vjs-primary">
            Our Engineering Principles
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-2.5"
            >
              <div className="w-7 h-7 rounded-lg bg-[#3B0A6B]/20 border border-[#3B0A6B]/40 flex items-center justify-center text-[#00E5FF] text-xs font-mono font-bold">
                0{idx + 1}
              </div>
              <h3 className="text-base font-bold text-vjs-primary">{p.title}</h3>
              <p className="text-xs text-vjs-secondary leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA to Team and Contact */}
      <div className="p-8 sm:p-10 rounded-2xl border border-vjs-subtle bg-gradient-to-r from-vjs-surface to-vjs-surface-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-vjs-primary">
            Explore our team and process
          </h2>
          <p className="text-xs sm:text-sm text-vjs-secondary max-w-xl">
            See the exact five-member team responsible for engineering your product, or read our step-by-step milestone delivery process.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/team"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs shadow hover:bg-[#33EBFF] transition-colors"
          >
            <span>View Team</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/process"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-vjs-strong bg-vjs-surface text-vjs-primary font-medium text-xs hover:bg-vjs-surface-hover transition-colors"
          >
            <span>Our Process</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
