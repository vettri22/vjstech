import React from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';

export const Cookies: React.FC = () => {
  const actualStorageUsed = [
    {
      key: 'vjs_theme',
      type: 'Local Storage (Essential)',
      purpose: 'Remembers your preferred color theme (Dark Mode or Light Mode) to prevent visual flashing across pages.',
      duration: 'Persistent until cleared by browser',
    },
    {
      key: 'vjs_lang',
      type: 'Local Storage (Essential)',
      purpose: 'Stores your selected language preference (English, Tamil, Hindi) for consistent internationalized navigation.',
      duration: 'Persistent until cleared by browser',
    },
    {
      key: 'vjs_auth_token',
      type: 'Local Storage (Essential)',
      purpose: 'Maintains authenticated session state for registered clients and administrators accessing the protected portal.',
      duration: '7 Days for clients / 24 Hours for administrators',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-vjs-subtle pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <Cookie className="w-3.5 h-3.5" />
          <span>Storage & Cookies Disclosure</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-vjs-primary">
          Cookie Policy & Audit
        </h1>
        <p className="text-xs font-mono text-vjs-muted">
          Last Audited: October 2026 • Status: Zero Non-Essential Trackers
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-vjs-secondary leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            1. Why We Do Not Display Intrusive Cookie Popups
          </h2>
          <p>
            Many websites display intrusive cookie consent banners because they deploy optional third-party marketing pixels, advertising networks, or behavioral trackers.
          </p>
          <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
            <p className="text-xs">
              <strong>VJS TECH does not deploy any optional analytics or advertising trackers.</strong> Under privacy standards and India's DPDP framework, purely functional, essential preferences (like theme and language) do not require artificial consent banners.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            2. Complete Audit of Technologies Actually Deployed
          </h2>
          <div className="rounded-xl border border-vjs-subtle bg-vjs-surface overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-vjs-subtle text-vjs-primary bg-vjs-surface-elevated font-mono">
                  <th className="p-3">Key Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Functional Purpose</th>
                  <th className="p-3">Retention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vjs-subtle text-vjs-secondary font-mono">
                {actualStorageUsed.map((item, idx) => (
                  <tr key={idx} className="hover:bg-vjs-surface-hover">
                    <td className="p-3 font-bold text-[#00E5FF]">{item.key}</td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3 font-sans text-xs text-vjs-secondary">{item.purpose}</td>
                    <td className="p-3 text-vjs-muted">{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            3. How to Manage or Clear Your Storage
          </h2>
          <p>
            You can clear cookies and localStorage at any time using your browser's privacy settings. Note that clearing your storage will reset your color theme to dark mode and sign you out of any active Client Portal session.
          </p>
        </section>
      </div>
    </div>
  );
};
