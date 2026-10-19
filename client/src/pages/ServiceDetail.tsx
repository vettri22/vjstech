import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { servicesData } from '../data/servicesData';
import { portfolioData } from '../data/portfolioData';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const ServiceDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = servicesData.find(s => s.slug === slug);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!service) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-vjs-primary">Service Not Found</h1>
        <p className="text-sm text-vjs-secondary">
          The requested service specification could not be located.
        </p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E5FF] text-[#050505] font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </Link>
      </div>
    );
  }

  // Find any related portfolio projects
  const relatedProjects = portfolioData.filter(p =>
    p.technologies.some(t => service.techStack.includes(t)) ||
    p.category.toLowerCase().includes(service.title.toLowerCase().slice(0, 4))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Breadcrumb & Navigation */}
      <div>
        <Breadcrumbs items={[{ label: 'Services', to: '/services' }, { label: service.title }]} />
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs text-vjs-muted hover:text-vjs-primary font-mono transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Services</span>
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <span>Service Specification</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-vjs-primary">
          {service.title}
        </h1>
        <p className="text-lg text-purple-400 font-mono">
          {service.tagline}
        </p>
        <p className="text-base text-vjs-secondary leading-relaxed">
          {service.fullDescription}
        </p>
      </div>

      {/* Grid: Suitable For & Key Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Suitable For */}
        <div className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4">
          <h2 className="text-lg font-bold text-vjs-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
            <span>Who This Service is Suitable For</span>
          </h2>
          <ul className="space-y-3">
            {service.targetAudience.map((audience, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-vjs-secondary">
                <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <span>{audience}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deliverables */}
        <div className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4">
          <h2 className="text-lg font-bold text-vjs-primary flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Typical Deliverables</span>
          </h2>
          <ul className="space-y-3">
            {service.deliverables.map((del, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-vjs-secondary">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>{del}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Engineering Process Steps */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
            Milestone Progression
          </div>
          <h2 className="text-2xl font-bold text-vjs-primary">
            The Development & Delivery Process
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.processSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-vjs-subtle bg-vjs-surface space-y-2"
            >
              <div className="text-xl font-mono font-bold text-[#3B0A6B] dark:text-[#00E5FF]">
                0{idx + 1}
              </div>
              <h3 className="text-sm font-bold text-vjs-primary">{step.title}</h3>
              <p className="text-xs text-vjs-secondary leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack */}
      <div className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-3">
        <h3 className="text-sm font-bold text-vjs-primary font-mono uppercase tracking-wider">
          Technologies & Standards Utilized
        </h3>
        <div className="flex flex-wrap gap-2">
          {service.techStack.map(tech => (
            <span
              key={tech}
              className="text-xs font-mono px-3 py-1 rounded-lg bg-vjs-surface-elevated text-vjs-secondary border border-vjs-subtle"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Related Real Projects (if available) */}
      {relatedProjects.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-vjs-primary">
            Relevant Case Studies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedProjects.map(proj => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3B0A6B]/20 text-purple-300 border border-[#3B0A6B]/50">
                    {proj.category}
                  </span>
                  <h3 className="text-lg font-bold text-vjs-primary">{proj.title}</h3>
                  <p className="text-xs text-vjs-secondary line-clamp-2">{proj.shortDesc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-vjs-subtle">
                  <Link
                    to={`/work/${proj.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E5FF] hover:underline"
                  >
                    <span>Read Technical Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Frequently Asked Questions */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
            Direct Clarifications
          </div>
          <h2 className="text-2xl font-bold text-vjs-primary">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 max-w-3xl">
          {service.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-vjs-subtle bg-vjs-surface overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                >
                  <span className="text-sm font-semibold text-vjs-primary">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#00E5FF] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-vjs-muted shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-vjs-secondary leading-relaxed border-t border-vjs-subtle/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Banner */}
      <div className="p-8 sm:p-10 rounded-2xl border border-vjs-subtle bg-gradient-to-r from-vjs-surface via-vjs-surface-elevated to-[#3B0A6B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-vjs-primary">
            Ready to build with {service.title}?
          </h2>
          <p className="text-xs sm:text-sm text-vjs-secondary max-w-xl">
            Submit your project requirements and receive a structured scope breakdown and transparent proposal.
          </p>
        </div>
        <Link
          to={`/contact?service=${encodeURIComponent(service.title)}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs tracking-wide shadow transition-colors hover:bg-[#33EBFF]"
        >
          <span>Request a Quote for this Service</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
