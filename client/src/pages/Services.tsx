import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import { servicesData } from '../data/servicesData';

export const Services: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const tags = ['All', 'Web & Apps', 'Backend & Data', 'AI & Security'];

  const filteredServices = servicesData.filter(s => {
    if (selectedTag === 'All') return true;
    if (selectedTag === 'Web & Apps') {
      return ['web-development', 'full-stack-apps', 'ui-ux-design', 'ecommerce-development', 'mobile-apps'].includes(s.slug);
    }
    if (selectedTag === 'Backend & Data') {
      return ['database-development', 'api-integrations', 'automation-tools'].includes(s.slug);
    }
    if (selectedTag === 'AI & Security') {
      return ['ai-solutions', 'cybersecurity-solutions', 'custom-software'].includes(s.slug);
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <Layers className="w-3.5 h-3.5" />
          <span>Services Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-vjs-primary">
          Software Solutions Engineered for Real Business Needs
        </h1>
        <p className="text-base sm:text-lg text-vjs-secondary leading-relaxed">
          From high-performance business websites and full-stack web applications to AI-assisted workflows and defensive security implementations.
        </p>
      </div>

      {/* Infrastructure & Domain Cost Clarification Notice */}
      <div className="p-4 rounded-xl border border-[#00E5FF]/30 bg-vjs-surface-elevated text-xs text-vjs-secondary flex items-start gap-3 max-w-4xl shadow-sm">
        <div className="w-7 h-7 rounded-lg bg-[#3B0A6B]/40 border border-[#00E5FF]/40 flex items-center justify-center shrink-0 text-[#00E5FF] font-bold font-mono">
          i
        </div>
        <div className="space-y-0.5">
          <div className="font-bold text-vjs-primary text-xs uppercase tracking-wider font-mono">
            Infrastructure Policy: Domain Name is a Separate Cost
          </div>
          <p className="text-[12px] leading-relaxed text-vjs-muted">
            Our engineering quotes cover software design, source code development, and server deployment. <strong className="text-vjs-primary">Domain name registration and recurring annual renewal fees are a separate third-party cost</strong> billed directly at registrar actuals, or you may connect an existing domain you already own.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-vjs-subtle">
        {tags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${
              selectedTag === tag
                ? 'bg-[#00E5FF] text-[#050505] font-bold shadow-sm'
                : 'border border-vjs-subtle bg-vjs-surface hover:bg-vjs-surface-hover text-vjs-secondary hover:text-vjs-primary'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Services Grid (All 11 Services) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map(service => (
          <div
            key={service.id}
            className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface hover:border-[#00E5FF]/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400">
                  {service.tagline}
                </span>
                <h2 className="mt-1 text-xl font-bold text-vjs-primary">
                  {service.title}
                </h2>
                <p className="mt-2 text-xs text-vjs-secondary leading-relaxed line-clamp-3">
                  {service.shortDescription}
                </p>
              </div>

              {/* Key Deliverables */}
              <div className="pt-3 border-t border-vjs-subtle space-y-1.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-vjs-muted font-medium">
                  Deliverables:
                </div>
                {service.deliverables.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-vjs-secondary">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{item}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {service.techStack.slice(0, 4).map(tech => (
                  <span
                    key={tech}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-vjs-surface-elevated text-vjs-muted border border-vjs-subtle"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-vjs-subtle flex items-center justify-between">
              <Link
                to={`/services/${service.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E5FF] hover:underline"
              >
                <span>Read Full Service Specification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={`/contact?service=${encodeURIComponent(service.title)}`}
                className="text-xs text-vjs-muted hover:text-vjs-primary font-mono transition-colors"
              >
                Enquire
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
