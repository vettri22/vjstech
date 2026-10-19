import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MessageSquare, ArrowUpRight, Shield } from 'lucide-react';
import { Logo } from './Logo';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const services = [
    { label: 'Website Development', to: '/services/web-development' },
    { label: 'Full-Stack Web Applications', to: '/services/full-stack-apps' },
    { label: 'UI/UX Design', to: '/services/ui-ux-design' },
    { label: 'AI-Powered Solutions', to: '/services/ai-solutions' },
    { label: 'Database Development', to: '/services/database-development' },
    { label: 'API Development & Integrations', to: '/services/api-integrations' },
    { label: 'Automation & Business Tools', to: '/services/automation-tools' },
    { label: 'Cybersecurity Solutions', to: '/services/cybersecurity-solutions' },
  ];

  const companyLinks = [
    { label: 'About VJS TECH', to: '/about' },
    { label: 'Our Team', to: '/team' },
    { label: 'Delivery Process', to: '/process' },
    { label: 'Selected Work', to: '/work' },
    { label: 'Request a Quote', to: '/contact' },
    { label: 'Client Portal', to: '/portal' },
  ];

  const legalLinks = [
    { label: t.footer.privacyPolicy, to: '/privacy' },
    { label: t.footer.termsOfService, to: '/terms' },
    { label: t.footer.cookiePolicy, to: '/cookies' },
    { label: t.footer.refundPolicy, to: '/refunds' },
  ];

  const whatsappUrl =
    'https://wa.me/919360761552?text=Hello%20VJS%20TECH%2C%20I%20would%20like%20to%20discuss%20a%20software%20project.';

  return (
    <footer className="border-t border-vjs-subtle bg-vjs-surface transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Purpose Column */}
          <div className="lg:col-span-5 space-y-4">
            <Logo showTagline={true} />
            <p className="text-sm text-vjs-secondary max-w-sm leading-relaxed">
              {t.footer.companyDesc}
            </p>
            <div className="pt-2 flex flex-col space-y-2 text-xs text-vjs-muted font-mono">
              <div>Agency Model: Freelance Software Solutions</div>
              <div>Operating Jurisdiction: India</div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="pt-3 flex flex-wrap gap-2.5">
              <a
                href="mailto:vjstechofficial@gmail.com"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated hover:border-[#00E5FF]/50 text-vjs-primary text-xs font-medium transition-colors"
                title="Send an email to vjstechofficial@gmail.com"
              >
                <Mail className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>vjstechofficial@gmail.com</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated hover:border-[#00E5FF]/50 text-vjs-primary text-xs font-medium transition-colors"
                title="Connect on WhatsApp (+91 9360761552)"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>+91 9360761552</span>
                <ArrowUpRight className="w-3 h-3 text-vjs-muted" />
              </a>
            </div>
          </div>

          {/* Services Column */}
          <div className="lg:col-span-3 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-vjs-primary font-bold">
              {t.footer.servicesHeading}
            </h2>
            <ul className="space-y-2 text-sm">
              {services.map(s => (
                <li key={s.to}>
                  <Link
                    to={s.to}
                    className="text-vjs-secondary hover:text-[#00E5FF] transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-vjs-primary font-bold">
              {t.footer.companyHeading}
            </h2>
            <ul className="space-y-2 text-sm">
              {companyLinks.map(c => (
                <li key={c.to}>
                  <Link
                    to={c.to}
                    className="text-vjs-secondary hover:text-[#00E5FF] transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Security & Direct Inquiries Column */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-vjs-primary font-bold">
              Assurance
            </h2>
            <div className="p-3.5 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-vjs-primary">
                <Shield className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Privacy & Security</span>
              </div>
              <p className="text-[11px] text-vjs-muted leading-relaxed">
                Zero third-party tracking scripts. Client data isolated with server-side authorization.
              </p>
              <div className="pt-1.5 border-t border-vjs-subtle text-[10px] font-mono text-vjs-muted">
                Infrastructure Note: Domain registration is a separate cost billed at registrar actuals.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="mt-12 pt-8 border-t border-vjs-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-vjs-muted">
          <p>© {currentYear} VJS TECH. {t.footer.allRightsReserved}</p>

          <nav className="flex flex-wrap items-center gap-4 sm:gap-6" aria-label="Legal Navigation">
            {legalLinks.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="hover:text-vjs-primary transition-colors focus-visible:outline-none focus-visible:underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};
