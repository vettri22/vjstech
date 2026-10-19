import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Code2 } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 sm:py-28 text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
        <Code2 className="w-3.5 h-3.5" />
        <span>HTTP 404 Status</span>
      </div>

      <h1 className="text-4xl sm:text-6xl font-mono font-bold tracking-tight text-vjs-primary">
        Page Not Located
      </h1>

      <p className="text-xs sm:text-sm text-vjs-secondary max-w-md mx-auto leading-relaxed">
        The route you requested does not exist on this server. It may have been relocated, or the URL may contain a typo.
      </p>

      <div className="pt-4 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs tracking-wide shadow hover:bg-[#33EBFF] transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-vjs-subtle bg-vjs-surface hover:bg-vjs-surface-hover text-vjs-primary text-xs font-medium transition-colors"
        >
          <span>Explore Services</span>
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-vjs-subtle bg-vjs-surface hover:bg-vjs-surface-hover text-vjs-primary text-xs font-medium transition-colors"
        >
          <span>Contact Us</span>
        </Link>
      </div>
    </div>
  );
};
