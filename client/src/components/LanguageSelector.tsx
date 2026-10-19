import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../i18n/translations';

export const LanguageSelector: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <label htmlFor="language-select" className="sr-only">
        Select Website Language
      </label>
      <div className="absolute left-2.5 pointer-events-none text-vjs-muted">
        <Globe className="w-3.5 h-3.5" aria-hidden="true" />
      </div>
      <select
        id="language-select"
        value={language}
        onChange={e => setLanguage(e.target.value as Language)}
        className="pl-8 pr-3 py-1.5 text-xs font-medium rounded-lg border border-vjs-subtle bg-vjs-surface hover:bg-vjs-surface-hover text-vjs-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] cursor-pointer appearance-none"
      >
        <option value="en">English (EN)</option>
        <option value="ta">தமிழ் (Tamil)</option>
        <option value="hi">हिंदी (Hindi)</option>
      </select>
    </div>
  );
};
