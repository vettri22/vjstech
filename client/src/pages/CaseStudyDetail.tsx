import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, Cpu, ExternalLink, Maximize2, Images } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { ImageLightboxModal } from '../components/ImageLightboxModal';

export const CaseStudyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const staticProject = portfolioData.find(p => p.slug === slug);
  const [project, setProject] = useState<any>(staticProject);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (images: string[], index = 0) => {
    if (!images || images.length === 0) return;
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/portfolio/${slug}`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && data.project) {
          const dp = data.project;
          setProject((prev: any) => ({
            ...prev,
            ...dp,
            name: dp.title || prev?.name,
            title: dp.title || prev?.title,
            role: dp.role || prev?.role || 'Full Stack Developer',
            shortDesc: dp.short_desc || prev?.shortDesc,
            fullDesc: dp.full_desc || prev?.fullDesc,
            challenge: dp.challenge || prev?.challenge,
            solution: dp.solution || prev?.solution,
            results: dp.results || prev?.results,
            architectureHighlights: dp.architecture_highlights || dp.architectureHighlights || prev?.architectureHighlights || [],
            completionDate: dp.completion_date || dp.completionDate || prev?.completionDate || 'Delivered',
            previewUrl: dp.project_url || dp.projectUrl || prev?.previewUrl || '',
            previewImage: dp.cover_image || dp.coverImage || prev?.previewImage || '',
            gallery_images: dp.gallery_images || prev?.gallery_images || [],
            technologies: dp.technologies || prev?.technologies || [],
          }));
        }
      })
      .catch(err => {
        console.warn('Case study live fetch error, using static fallback:', err);
      });
  }, [slug]);

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-vjs-primary">Case Study Not Found</h1>
        <p className="text-sm text-vjs-secondary">
          The requested case study could not be located in our portfolio.
        </p>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E5FF] text-[#050505] font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Back button & Breadcrumbs */}
      <div>
        <Breadcrumbs items={[{ label: 'Selected Work', to: '/work' }, { label: project.title }]} />
        <Link
          to="/work"
          className="inline-flex items-center gap-1.5 text-xs text-vjs-muted hover:text-vjs-primary font-mono transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-6 border-b border-vjs-subtle pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-mono px-3 py-1 rounded-md bg-[#3B0A6B]/20 text-purple-300 border border-[#3B0A6B]/50">
            {project.category}
          </span>
          <span className="text-xs font-mono px-3 py-1 rounded-md bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
            Role: {project.role}
          </span>
          <span className="text-xs font-mono text-vjs-muted">
            Delivered: {project.completionDate}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-vjs-primary">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-vjs-secondary leading-relaxed">
          {project.fullDesc}
        </p>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-vjs-subtle bg-vjs-surface hover:bg-vjs-surface-hover text-xs font-mono text-vjs-primary transition-colors"
          >
            <svg className="w-4 h-4 fill-current text-[#00E5FF]" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub Repository</span>
          </a>

          {(() => {
            const preview = (project.project_url || project.projectUrl || project.previewUrl || '').trim();
            const hasPreview = preview.length > 0 && preview !== '#';
            return hasPreview ? (
              <a
                href={preview}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5FF] text-[#050505] font-semibold text-xs tracking-wide hover:bg-[#33EBFF] transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Website Preview</span>
              </a>
            ) : (
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-vjs-subtle bg-vjs-surface text-xs font-mono text-vjs-muted cursor-not-allowed opacity-60"
                title="Website preview link will be added soon"
                aria-disabled="true"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Preview Pending</span>
              </span>
            );
          })()}
        </div>

        {/* Project Hero Screenshot Container (renders if images exist) */}
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
            <div className="pt-4 space-y-3">
              <div
                onClick={() => openLightbox(projectImages, 0)}
                className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-vjs-subtle bg-vjs-surface-elevated cursor-pointer shadow-xl"
                title="Click to preview screenshot in full screen"
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    openLightbox(projectImages, 0);
                  }
                }}
              >
                <img
                  src={mainImg}
                  alt={`${project.name || project.title} system overview`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                  loading="lazy"
                  decoding="async"
                />
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#050505]/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-sm">
                  <Maximize2 className="w-5 h-5 text-[#00E5FF]" />
                  <span className="font-semibold text-[#00E5FF]">Click to Expand Fullscreen</span>
                </div>
                {/* Multiple Images Badge */}
                {projectImages.length > 1 && (
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#050505]/85 backdrop-blur-sm border border-vjs-subtle text-xs font-mono text-vjs-primary flex items-center gap-2 shadow-lg">
                    <Images className="w-4 h-4 text-[#00E5FF]" />
                    <span>{projectImages.length} Screenshots Available</span>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Challenge & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* The Challenge */}
        <div className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-red-400 font-bold">
            01 • The Problem & Constraints
          </div>
          <h2 className="text-xl font-bold text-vjs-primary">The Technical Challenge</h2>
          <p className="text-xs sm:text-sm text-vjs-secondary leading-relaxed">
            {project.challenge}
          </p>
        </div>

        {/* The Solution */}
        <div className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
            02 • Engineered Solution
          </div>
          <h2 className="text-xl font-bold text-vjs-primary">Architecture & Implementation</h2>
          <p className="text-xs sm:text-sm text-vjs-secondary leading-relaxed">
            {project.solution}
          </p>
        </div>
      </div>

      {/* Architecture Highlights */}
      <div className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#00E5FF]" />
          <h3 className="text-base font-bold text-vjs-primary font-mono uppercase tracking-wider">
            Key Architectural Highlights
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {project.architectureHighlights?.map((highlight: string, idx: number) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-vjs-secondary">
              <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* System Screenshots Gallery (renders when multiple images exist) */}
      {(() => {
        const projectImages: string[] = Array.isArray(project.gallery_images) && project.gallery_images.length > 0
          ? project.gallery_images
          : [];
        if (projectImages.length <= 1) return null;

        return (
          <div className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Images className="w-4 h-4 text-[#00E5FF]" />
                <h3 className="text-base font-bold text-vjs-primary font-mono uppercase tracking-wider">
                  Interface & Architecture Screenshots ({projectImages.length})
                </h3>
              </div>
              <span className="text-xs font-mono text-vjs-muted hidden sm:inline">
                Click any screenshot to view full screen
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              {projectImages.map((img, idx) => (
                <div
                  key={`${img}-${idx}`}
                  onClick={() => openLightbox(projectImages, idx)}
                  className="group relative aspect-video rounded-xl overflow-hidden border border-vjs-subtle bg-vjs-surface-elevated cursor-pointer hover:border-[#00E5FF] transition-all shadow"
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      openLightbox(projectImages, idx);
                    }
                  }}
                  title={`View screenshot ${idx + 1} in full screen`}
                >
                  <img
                    src={img}
                    alt={`Screenshot ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-[#050505]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Maximize2 className="w-4 h-4 text-[#00E5FF]" />
                  </div>
                  <span className="absolute bottom-1 right-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-vjs-secondary">
                    #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Measured Results & Outcomes */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#3B0A6B]/50 bg-gradient-to-br from-vjs-surface to-[#3B0A6B]/15 space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider text-[#00E5FF]">
          Verified Result
        </div>
        <h3 className="text-lg font-bold text-vjs-primary">Measured Technical Outcome</h3>
        <p className="text-xs sm:text-sm text-vjs-secondary leading-relaxed">
          {project.results}
        </p>
      </div>

      {/* Technology Stack */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-vjs-muted font-bold">
          Technology Stack
        </h3>
        <div className="flex flex-wrap gap-2">
          {project.technologies?.map((tech: string) => (
            <span
              key={tech}
              className="text-xs font-mono px-3 py-1 rounded-lg bg-vjs-surface text-vjs-primary border border-vjs-subtle"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Conversion Banner */}
      <div className="p-8 sm:p-10 rounded-2xl border border-vjs-subtle bg-vjs-surface flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-vjs-primary">
            Have a project requiring similar architecture?
          </h2>
          <p className="text-xs sm:text-sm text-vjs-secondary max-w-xl">
            We review project specifications, establish architecture blueprints, and provide transparent milestone estimates.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs tracking-wide shadow hover:bg-[#33EBFF] transition-colors"
        >
          <span>Start a Project Discussion</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        images={lightboxImages}
        initialIndex={lightboxIndex}
        projectTitle={project.title || project.name}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
