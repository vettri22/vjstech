import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, ShieldCheck, ExternalLink, Maximize2, Images } from 'lucide-react';
import { portfolioData } from '../data/portfolioData';
import { ImageLightboxModal } from '../components/ImageLightboxModal';

export const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [projectsList, setProjectsList] = useState<any[]>(portfolioData);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState('');

  const openLightbox = (images: string[], index = 0, title = '') => {
    if (!images || images.length === 0) return;
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxTitle(title);
    setLightboxOpen(true);
  };

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && data.projects && data.projects.length > 0) {
          // Merge dynamic database portfolio with fallback case studies
          const merged = portfolioData.map(staticP => {
            const dynamicMatch = data.projects.find(
              (dp: any) => dp.slug === staticP.slug || dp.title?.toLowerCase() === staticP.name?.toLowerCase()
            );
            if (dynamicMatch) {
              return {
                ...staticP,
                ...dynamicMatch,
                role: dynamicMatch.role || staticP.role || 'Full Stack Developer',
                shortDesc: dynamicMatch.short_desc || staticP.shortDesc,
                fullDesc: dynamicMatch.full_desc || staticP.fullDesc,
                challenge: dynamicMatch.challenge || staticP.challenge,
                solution: dynamicMatch.solution || staticP.solution,
                results: dynamicMatch.results || staticP.results,
                completionDate: dynamicMatch.completion_date || dynamicMatch.completionDate || staticP.completionDate || 'Delivered',
                architectureHighlights: dynamicMatch.architecture_highlights || dynamicMatch.architectureHighlights || staticP.architectureHighlights || [],
                previewUrl: dynamicMatch.project_url || dynamicMatch.projectUrl || staticP.previewUrl,
                previewImage: dynamicMatch.cover_image || dynamicMatch.coverImage || staticP.previewImage,
                gallery_images: dynamicMatch.gallery_images || staticP.gallery_images || [],
              };
            }
            return staticP;
          });

          // Also include any newly created portfolio items from database
          data.projects.forEach((dp: any) => {
            if (!merged.find(m => m.slug === dp.slug)) {
              merged.push({
                id: dp.id,
                slug: dp.slug,
                name: dp.title,
                title: dp.title,
                role: dp.role || 'Full Stack Developer',
                category: dp.category,
                shortDesc: dp.short_desc,
                fullDesc: dp.full_desc,
                challenge: dp.challenge,
                solution: dp.solution,
                results: dp.results || '',
                technologies: dp.technologies || [],
                githubUrl: dp.repo_url || '',
                previewUrl: dp.project_url || '',
                previewImage: dp.cover_image || '',
                gallery_images: dp.gallery_images || [],
                coverGradient: 'from-purple-950 via-slate-900 to-cyan-950',
                architectureHighlights: dp.architecture_highlights || dp.architectureHighlights || [],
                completionDate: dp.completion_date || dp.completionDate || 'Delivered',
              });
            }
          });

          setProjectsList(merged);
        }
      })
      .catch(err => {
        console.warn('Portfolio live sync fallback to static:', err);
      });
  }, []);

  const categories = [
    'All',
    'Full-Stack Web Applications',
    'AI & Data Analytics',
    'Cybersecurity & Machine Learning',
  ];

  const filteredProjects = projectsList.filter(project => {
    if (selectedCategory === 'All') return true;
    return project.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <Code className="w-3.5 h-3.5" />
          <span>Case Studies & Systems</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-vjs-primary">
          Selected Software Engineering Work
        </h1>
        <p className="text-base sm:text-lg text-vjs-secondary leading-relaxed">
          Explore genuine software systems engineered with modern frameworks, strict security considerations, and documented technical architectures.
        </p>
      </div>

      {/* Authenticity Notice */}
      <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface text-xs text-vjs-muted flex items-center gap-2 max-w-3xl">
        <ShieldCheck className="w-4 h-4 text-[#00E5FF] shrink-0" />
        <span>
          Every project featured here represents genuine architectural design and implementation. We never display fake corporate logos or fabricated testimonial metrics.
        </span>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-vjs-subtle">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${
              selectedCategory === cat
                ? 'bg-[#00E5FF] text-[#050505] font-bold shadow-sm'
                : 'border border-vjs-subtle bg-vjs-surface hover:bg-vjs-surface-hover text-vjs-secondary hover:text-vjs-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Grid / Empty State */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-vjs-subtle text-center space-y-3">
          <p className="text-sm text-vjs-muted font-mono">
            No projects found in category "{selectedCategory}".
          </p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="text-xs text-[#00E5FF] underline font-semibold"
          >
            Reset filter to All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <article
              key={project.id}
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
                            <span>{projectImages.length} Screenshots</span>
                          </div>
                        )}
                      </div>

                      {/* If multiple images, show mini thumbnail selector */}
                      {projectImages.length > 1 && (
                        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                          {projectImages.slice(0, 4).map((thumb, idx) => (
                            <button
                              key={`${thumb}-${idx}`}
                              type="button"
                              onClick={() => openLightbox(projectImages, idx, project.title || project.name)}
                              className="relative w-12 h-8 rounded-md overflow-hidden border border-vjs-subtle hover:border-[#00E5FF] transition-all shrink-0 group/t"
                              title={`View screenshot ${idx + 1} in full screen`}
                            >
                              <img src={thumb} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/20 group-hover/t:bg-transparent transition-colors" />
                            </button>
                          ))}
                          {projectImages.length > 4 && (
                            <button
                              type="button"
                              onClick={() => openLightbox(projectImages, 4, project.title || project.name)}
                              className="w-12 h-8 rounded-md border border-vjs-subtle bg-vjs-surface-elevated hover:border-[#00E5FF] text-[10px] font-mono text-[#00E5FF] flex items-center justify-center shrink-0"
                            >
                              +{projectImages.length - 4}
                            </button>
                          )}
                        </div>
                      )}
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
                  <h2 className="text-xl font-bold text-vjs-primary">
                    <Link to={`/work/${project.slug}`} className="hover:text-[#00E5FF] transition-colors">
                      {project.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-xs text-vjs-secondary line-clamp-3 leading-relaxed">
                    {project.shortDesc}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-vjs-surface-elevated border border-vjs-subtle text-xs space-y-1.5">
                  <div className="font-semibold text-vjs-primary">The Challenge:</div>
                  <div className="text-vjs-secondary line-clamp-2">{project.challenge}</div>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.technologies.slice(0, 5).map(tech => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-vjs-surface-elevated text-vjs-muted border border-vjs-subtle"
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
                  <span>View Case Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-vjs-secondary hover:text-[#00E5FF] font-mono transition-colors"
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
      )}

      {/* Project Enquiry Prompt */}
      <div className="p-8 sm:p-10 rounded-2xl border border-vjs-subtle bg-gradient-to-r from-vjs-surface to-vjs-surface-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-vjs-primary">
            Need a similar system designed for your organization?
          </h2>
          <p className="text-xs sm:text-sm text-vjs-secondary max-w-xl">
            We can architect a tailored web application, automation tool, or AI workflow based on your specific requirements.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs tracking-wide shadow transition-colors hover:bg-[#33EBFF]"
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
        projectTitle={lightboxTitle}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
