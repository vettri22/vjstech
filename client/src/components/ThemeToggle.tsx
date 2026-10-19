import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-lg border border-vjs-subtle bg-vjs-surface hover:bg-vjs-surface-hover text-vjs-secondary hover:text-vjs-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${className}`}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Current: ${theme} mode. Click to toggle.`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-[#00E5FF]" aria-hidden="true" />
      ) : (
        <Moon className="w-4 h-4 text-[#3B0A6B]" aria-hidden="true" />
      )}
    </button>
  );
};
