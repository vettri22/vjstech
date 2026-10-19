import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', showTagline = false }) => {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] rounded-md ${className}`}
      aria-label="VJS TECH Home"
    >
      {/* Official VJS TECH Logo Emblem */}
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#050505] border border-[#2D2D3F] flex items-center justify-center p-0.5 overflow-hidden group-hover:border-[#00E5FF]/70 transition-all shadow-md">
        <img
          src="/vjs-logo.png"
          alt="VJS TECH Logo"
          className="w-full h-full object-contain"
          loading="eager"
        />
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center tracking-tight font-bold text-lg">
          <span className="text-vjs-primary font-mono tracking-wider">VJS</span>
          <span className="ml-1 text-[#00E5FF] font-mono tracking-widest font-semibold">TECH</span>
        </div>
        {showTagline && (
          <span className="text-[10px] text-vjs-muted tracking-wide mt-0.5 font-medium">
            Ideas to Intelligent Software
          </span>
        )}
      </div>
    </Link>
  );
};
