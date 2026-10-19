import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a selection
    const consent = localStorage.getItem('vjs_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('vjs_cookie_consent', 'accepted');
    setIsVisible(false);
    // Dynamically inject GA4 if configured
    if (!document.querySelector('script[src*="googletagmanager"]')) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-VJSTECH001';
      document.head.appendChild(gaScript);
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('config', 'G-VJSTECH001', { anonymize_ip: true });
      }
    }
  };

  const handleEssential = () => {
    localStorage.setItem('vjs_cookie_consent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      role="region"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 p-5 rounded-lg border border-[#27273A] bg-[#0A0A0E] text-vjs-primary shadow-2xl transition-all duration-300"
    >
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 p-2 rounded-md bg-[#3B0A6B]/30 border border-[#3B0A6B]/60 text-[#00E5FF] shrink-0">
          <Cookie className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-1.5 text-sm font-semibold tracking-tight text-white">
            <span>Cookie &amp; Privacy Preferences</span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            We use strictly essential cookies for secure portal authentication, and optional analytics to evaluate site performance. No third-party ad trackers.
          </p>
          <div className="text-[11px] text-[#64748B] pt-0.5">
            Learn more in our{' '}
            <Link
              to="/cookies"
              className="text-[#00E5FF] hover:underline underline-offset-2"
            >
              Cookie Policy
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              className="text-[#00E5FF] hover:underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#1C1C28] flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={handleEssential}
          className="px-3.5 py-1.5 text-xs font-medium text-[#CBD5E1] bg-[#12121A] hover:bg-[#1A1A24] border border-[#2A2A3C] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={handleAccept}
          className="px-4 py-1.5 text-xs font-semibold text-[#050505] bg-[#00E5FF] hover:bg-[#33EAFF] rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
        >
          Accept All
        </button>
      </div>
    </aside>
  );
};
