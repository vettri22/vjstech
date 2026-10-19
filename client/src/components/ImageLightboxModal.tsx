import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  projectTitle?: string;
  onClose: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  projectTitle,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync initialIndex when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, images.length - 1)));
    }
  }, [isOpen, initialIndex, images.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard controls (Esc to close, ArrowLeft / ArrowRight to navigate)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Fullscreen API toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none animate-in fade-in duration-200"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4 border-b border-vjs-subtle pb-3">
        <div className="flex items-center gap-3 min-w-0">
          {projectTitle && (
            <h3 className="text-sm sm:text-base font-bold text-vjs-primary truncate">
              {projectTitle}
            </h3>
          )}
          <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-vjs-surface-elevated text-[#00E5FF] border border-[#00E5FF]/30 shrink-0">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl border border-vjs-subtle bg-vjs-surface hover:bg-vjs-surface-elevated text-vjs-secondary hover:text-vjs-primary transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-[#00E5FF]" />
            ) : (
              <Maximize2 className="w-4 h-4 text-[#00E5FF]" />
            )}
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl border border-vjs-subtle bg-vjs-surface hover:bg-red-500/10 text-vjs-secondary hover:text-red-400 hover:border-red-500/30 transition-colors"
            title="Close Preview (Esc)"
            aria-label="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        className="flex-1 flex items-center justify-between gap-2 sm:gap-4 my-auto relative py-2 overflow-hidden"
        onClick={e => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              handlePrev();
            }}
            className="p-2.5 sm:p-3 rounded-xl border border-vjs-subtle bg-[#050505]/80 hover:bg-vjs-surface-elevated text-vjs-primary hover:border-[#00E5FF]/50 transition-all z-10 shrink-0 shadow-lg"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="w-5 h-5 text-[#00E5FF]" />
          </button>
        )}

        {/* High Resolution Image View */}
        <div
          className="flex-1 flex items-center justify-center h-full max-h-[75vh] sm:max-h-[80vh] px-1 sm:px-4"
          onClick={e => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <img
            src={currentImage}
            alt={projectTitle ? `${projectTitle} preview ${currentIndex + 1}` : 'Project screenshot'}
            className="max-h-[75vh] sm:max-h-[80vh] max-w-full object-contain rounded-xl shadow-2xl border border-vjs-subtle bg-vjs-surface-elevated transition-transform duration-200"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              handleNext();
            }}
            className="p-2.5 sm:p-3 rounded-xl border border-vjs-subtle bg-[#050505]/80 hover:bg-vjs-surface-elevated text-vjs-primary hover:border-[#00E5FF]/50 transition-all z-10 shrink-0 shadow-lg"
            aria-label="Next screenshot"
          >
            <ChevronRight className="w-5 h-5 text-[#00E5FF]" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="pt-3 border-t border-vjs-subtle flex items-center justify-center gap-2 overflow-x-auto max-w-4xl mx-auto py-1">
          {images.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-16 h-10 sm:w-20 sm:h-12 rounded-lg overflow-hidden border transition-all shrink-0 ${
                idx === currentIndex
                  ? 'border-[#00E5FF] ring-2 ring-[#00E5FF]/50 scale-105'
                  : 'border-vjs-subtle opacity-60 hover:opacity-100 hover:border-vjs-strong'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
