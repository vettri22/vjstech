import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Code2,
  Cpu,
  Database,
  Globe,
  Layers,
  Lock,
  Smartphone,
  Workflow,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Maximize2,
  Images,
} from 'lucide-react';
import { TechnicalIllustration } from '../components/TechnicalIllustration';
import { servicesData } from '../data/servicesData';
import { portfolioData } from '../data/portfolioData';
import { useLanguage } from '../context/LanguageContext';
import { ImageLightboxModal } from '../components/ImageLightboxModal';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const [projectsList, setProjectsList] = React.useState<any[]>(portfolioData);
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxImages, setLightboxImages] = React.useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = React.useState(0);
  const [lightboxTitle, setLightboxTitle] = React.useState('');

  const openLightbox = (images: string[], index = 0, title = '') => {
    if (!images || images.length === 0) return;
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  React.useEffect(() => {
    fetch('/api/portfolio')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && data.projects && data.projects.length > 0) {
          const merged = portfolioData.map(staticP => {
            const dynamicMatch = data.projects.find(
              (dp: any) => dp.slug === staticP.slug || dp.title?.toLowerCase() === staticP.name?.toLowerCase()
            );
            if (dynamicMatch) {
              return {
                ...staticP,
                ...dynamicMatch,
                role: dynamicMatch.role || staticP.role || 'Full Stack Developer',
                results: dynamicMatch.results || staticP.results,
                shortDesc: dynamicMatch.short_desc || staticP.shortDesc,
                completionDate: dynamicMatch.completion_date || dynamicMatch.completionDate || staticP.completionDate || 'Delivered',
                previewUrl: dynamicMatch.project_url || dynamicMatch.projectUrl || staticP.previewUrl,
                previewImage: dynamicMatch.cover_image || dynamicMatch.coverImage || staticP.previewImage,
                gallery_images: dynamicMatch.gallery_images || staticP.gallery_images || [],
              };
            }
            return staticP;
          });
          setProjectsList(merged);
        }
      })
      .catch(err => {
        console.warn('Home live portfolio fallback:', err);
      });
  }, []);

  // Icons map for service categories
  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'web-dev':
        return <Globe className="w-5 h-5 text-[#00E5FF]" />;
      case 'full-stack':
        return <Code2 className="w-5 h-5 text-[#00E5FF]" />;
      case 'ui-ux':
        return <Layers className="w-5 h-5 text-[#00E5FF]" />;
      case 'ai-solutions':
        return <Cpu className="w-5 h-5 text-[#00E5FF]" />;
      case 'database-dev':
        return <Database className="w-5 h-5 text-[#00E5FF]" />;
      case 'automation-tools':
        return <Workflow className="w-5 h-5 text-[#00E5FF]" />;
      case 'cybersecurity':
        return <Lock className="w-5 h-5 text-[#00E5FF]" />;
      case 'mobile-apps':
        return <Smartphone className="w-5 h-5 text-[#00E5FF]" />;
      default:
        return <Code2 className="w-5 h-5 text-[#00E5FF]" />;
    }
  };

  const processSteps = [
    { num: '01', title: t.process.step1, desc: t.process.step1Desc },
    { num: '02', title: t.process.step2, desc: t.process.step2Desc },
    { num: '03', title: t.process.step3, desc: t.process.step3Desc },
    { num: '04', title: t.process.step4, desc: t.process.step4Desc },
    { num: '05', title: t.process.step5, desc: t.process.step5Desc },
    { num: '06', title: t.process.step6, desc: t.process.step6Desc },
  ];

  const whyChooseUs = [
    {
      title: 'Solutions Tailored to the Problem',
      desc: 'We do not sell cookie-cutter templates. Every architecture is chosen specifically around your project scale, data model, and user constraints.',
    },
    {
      title: 'Clear, Direct Communication',
      desc: 'Work directly with the technical engineers building your software. Clear milestone tracking, documented contracts, and zero jargon.',
    },
    {
      title: 'Thoughtful UI/UX Engineering',
      desc: 'Intuitive user flows, editorial typography, accessible color contrast (WCAG 2.2 AA target), and interfaces that look refined in both dark and light themes.',
    },
    {
      title: 'Maintainable, Clean Codebases',
      desc: 'Type-safe TypeScript, modular component hierarchies, parameterized queries, and documentation so your in-house team can maintain the code effortlessly.',
    },
    {
      title: 'Security-Conscious Implementation',
      desc: 'Zero-trust architecture, parameterized database calls against SQLi, rate limiting, and server-side authorization guards against IDOR attacks.',
    },
    {
      title: 'Transparent Scope & Quotations',
      desc: 'Detailed milestone specifications, fixed upfront deliverables, and unambiguous refund and cancellation policies.',
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 py-10 sm:py-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            {/* Agency Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-vjs-secondary">
              <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-vjs-primary leading-[1.12]">
              {t.hero.headline}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-vjs-secondary max-w-2xl leading-relaxed">
              {t.hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00E5FF] hover:bg-[#33EBFF] text-[#050505] font-bold text-sm tracking-wide shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              >
                <span>{t.hero.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/work"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-vjs-strong bg-vjs-surface hover:bg-vjs-surface-hover text-vjs-primary font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              >
                <span>{t.hero.ctaSecondary}</span>
              </Link>
            </div>

            {/* Trust Points */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-vjs-subtle text-xs text-vjs-muted font-mono">
              <div>
                <span className="text-vjs-primary font-bold block">100% Bespoke</span>
                <span>Zero bloated templates</span>
              </div>
              <div>
                <span className="text-vjs-primary font-bold block">Direct Engineers</span>
                <span>Direct client collaboration</span>
              </div>
              <div>
                <span className="text-vjs-primary font-bold block">Full Ownership</span>
                <span>Complete code handover</span>
              </div>
            </div>
          </div>

          {/* Technical Illustration */}
          <div className="lg:col-span-5">
            <TechnicalIllustration />
          </div>
        </div>
      </section>

      {/* 2. SERVICES OVERVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-vjs-subtle">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
              <span>Core Disciplines</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-vjs-primary">
              {t.services.sectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-vjs-secondary">
              {t.services.sectionSubtitle}
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00E5FF] hover:underline"
          >
            <span>{t.services.viewAll}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Editorial Layout for Services */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicesData.slice(0, 6).map(service => (
            <div
              key={service.id}
              className="group p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface hover:border-[#00E5FF]/50 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-vjs-surface-elevated border border-vjs-subtle flex items-center justify-center">
                  {getServiceIcon(service.id)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-vjs-primary group-hover:text-[#00E5FF] transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-xs text-vjs-secondary line-clamp-3 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Key Deliverables Bullet Preview */}
                <div className="pt-2 border-t border-vjs-subtle space-y-1.5">
                  <span className="text-[11px] font-mono text-vjs-muted uppercase tracking-wider">
                    Highlights:
                  </span>
                  {service.deliverables.slice(0, 2).map((del, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-vjs-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-vjs-subtle flex items-center justify-between">
                <Link
                  to={`/services/${service.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-vjs-primary group-hover:text-[#00E5FF] transition-colors"
                >
                  <span>{t.services.exploreService}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/contact"
                  className="text-xs text-vjs-muted hover:text-vjs-primary font-mono transition-colors"
                >
                  Enquire →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SELECTED WORK SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-vjs-subtle">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
              <span>Verified Case Studies</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-vjs-primary">
              Engineering in Practice
            </h2>
            <p className="text-sm sm:text-base text-vjs-secondary">
              Real projects built with modern architectures, transparent challenges, and verified technical outcomes.
            </p>
          </div>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00E5FF] hover:underline"
          >
            <span>Explore All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {projectsList.slice(0, 3).map(project => (
            <article
              key={project.id || project.slug}
              className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface hover:border-[#00E5FF]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Project Screenshot & Gallery Preview (renders if images exist) */}
                {(() => {
                  const projectImages: string[] = Array.isArray(project.gallery_images) && project.gallery_images.length > 0
                    ? project.gallery_images
                    : (() => {
                        const single = (project.cover_image || project.coverImage || project.previewImage || '').trim();
                        return single ? [single] : [];
                      })();
                  const mainImg = projectImages[0];
                  if (!mainImg) return null;

                  return (
                    <div className="space-y-2">
                      <div
                        onClick={() => openLightbox(projectImages, 0, project.title || project.name)}
                        className="group relative aspect-video w-full rounded-xl overflow-hidden border border-vjs-subtle bg-vjs-surface-elevated cursor-pointer"
                        title="Click to preview in full screen"
                        role="button"
                        tabIndex={0}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            openLightbox(projectImages, 0, project.title || project.name);
                          }
                        }}
                      >
                        <img
                          src={mainImg}
                          alt={`${project.name || project.title} interface preview`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#050505]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs">
                          <Maximize2 className="w-4 h-4 text-[#00E5FF]" />
                          <span className="font-semibold text-[#00E5FF]">Click to Expand</span>
                        </div>
                        {/* Multiple Images Indicator Badge */}
                        {projectImages.length > 1 && (
                          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-[#050505]/85 backdrop-blur-sm border border-vjs-subtle text-[11px] font-mono text-vjs-primary flex items-center gap-1.5 shadow-md">
                            <Images className="w-3.5 h-3.5 text-[#00E5FF]" />
                            <span>{projectImages.length} Photos</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[#3B0A6B]/20 text-purple-300 border border-[#3B0A6B]/50">
                    {project.category}
                  </span>
                  <span className="text-[11px] font-mono text-vjs-muted">
                    {project.completionDate}
                  </span>
                </div>

                <div>
                  <div className="text-[11px] font-mono text-vjs-muted mb-1">
                    Role: <span className="text-[#00E5FF] font-medium">{project.role}</span>
                  </div>
                  <h3 className="text-lg font-bold text-vjs-primary">
                    <Link to={`/work/${project.slug}`} className="hover:text-[#00E5FF] transition-colors">
                      {project.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-xs text-vjs-secondary line-clamp-3 leading-relaxed">
                    {project.shortDesc}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-vjs-surface-elevated border border-vjs-subtle text-xs space-y-1">
                  <div className="font-semibold text-vjs-primary">Technical Outcome:</div>
                  <div className="text-vjs-secondary line-clamp-2">{project.results}</div>
                </div>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.technologies.slice(0, 4).map((tech: string) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-vjs-surface-elevated text-vjs-secondary border border-vjs-subtle"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-vjs-subtle flex flex-wrap items-center justify-between gap-3">
                <Link
                  to={`/work/${project.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00E5FF] hover:underline"
                >
                  <span>Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-vjs-secondary hover:text-[#00E5FF] font-mono transition-colors"
                    title="View GitHub Repository"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <span>GitHub</span>
                  </a>

                  {(() => {
                    const preview = (project.project_url || project.projectUrl || project.previewUrl || '').trim();
                    const hasPreview = preview.length > 0 && preview !== '#';
                    return hasPreview ? (
                      <a
                        href={preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#00E5FF] hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Preview</span>
                      </a>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 text-xs text-vjs-muted cursor-not-allowed opacity-60"
                        title="Website preview link will be added soon"
                        aria-disabled="true"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Preview Pending</span>
                      </span>
                    );
                  })()}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. HOW WE WORK (DELIVERY PROCESS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3 pb-12 border-b border-vjs-subtle">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
            <span>{t.process.badge}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-vjs-primary">
            {t.process.title}
          </h2>
          <p className="text-sm sm:text-base text-vjs-secondary">
            {t.process.subtitle}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-3 relative overflow-hidden"
            >
              <div className="text-2xl font-mono font-bold text-[#3B0A6B]/80 dark:text-[#00E5FF]/60">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-vjs-primary">
                {step.title}
              </h3>
              <p className="text-xs text-vjs-secondary leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY WORK WITH VJS TECH? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3 pb-12 border-b border-vjs-subtle">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
            <span>Engineering Principles</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-vjs-primary">
            Why Work With VJS TECH?
          </h2>
          <p className="text-sm sm:text-base text-vjs-secondary">
            Transparent processes, direct engineering collaboration, and software engineered for longevity.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-[#3B0A6B]/20 border border-[#3B0A6B]/40 flex items-center justify-center text-[#00E5FF]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-vjs-primary">
                {item.title}
              </h3>
              <p className="text-xs text-vjs-secondary leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FINAL CONVERSION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-vjs-subtle bg-gradient-to-br from-vjs-surface via-vjs-surface-elevated to-[#3B0A6B]/20 p-8 sm:p-14 overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
              <span>Next Steps</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-vjs-primary">
              Have a project in mind?
            </h2>
            <p className="text-sm sm:text-base text-vjs-secondary leading-relaxed">
              Tell us what you want to build. We will review your technical requirements and discuss the architecture, milestone scope, and quotation.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00E5FF] hover:bg-[#33EBFF] text-[#050505] font-bold text-sm tracking-wide shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/team"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-vjs-strong bg-vjs-surface hover:bg-vjs-surface-hover text-vjs-primary font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              >
                <span>Meet the Team</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Interactive Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        images={lightboxImages}
        initialIndex={lightboxIndex}
        projectTitle={lightboxTitle}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
