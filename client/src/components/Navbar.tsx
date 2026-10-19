import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
  User as UserIcon,
  Home as HomeIcon,
  Layers,
  Briefcase,
  Info,
  Users,
  Workflow,
  Mail,
  FileText,
  Shield,
  CreditCard,
  Lock,
} from 'lucide-react';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling when mobile menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { to: '/services', label: t.nav.services },
    { to: '/work', label: t.nav.work },
    { to: '/about', label: t.nav.about },
    { to: '/team', label: t.nav.team },
    { to: '/process', label: t.nav.process },
    { to: '/contact', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-vjs-subtle bg-vjs-main/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo showTagline={false} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${
                    isActive
                      ? 'text-[#00E5FF] bg-vjs-surface font-semibold'
                      : 'text-vjs-secondary hover:text-vjs-primary hover:bg-vjs-surface-hover'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right Utilities (Theme, Lang, Portal, CTA) */}
          <div className="hidden lg:flex items-center gap-2.5">
            <LanguageSelector />
            <ThemeToggle />

            {/* Client Portal / Login */}
            {isAuthenticated ? (
              <Link
                to={user?.role === 'admin' ? '/admin' : '/portal'}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-vjs-subtle bg-vjs-surface hover:bg-vjs-surface-hover text-vjs-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              >
                {user?.role === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00E5FF]" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-[#00E5FF]" />
                )}
                <span>{user?.role === 'admin' ? 'Admin' : t.nav.clientPortal}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-medium rounded-lg text-vjs-secondary hover:text-vjs-primary hover:bg-vjs-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              >
                {t.nav.clientLogin}
              </Link>
            )}

            {/* Primary Action Button */}
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#00E5FF] hover:bg-[#33EBFF] text-[#050505] shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:ring-offset-2"
            >
              <span>{t.nav.getQuote}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-vjs-subtle text-vjs-primary bg-vjs-surface hover:bg-vjs-surface-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-x-0 top-16 bottom-0 z-50 bg-vjs-main border-t border-vjs-subtle p-5 overflow-y-auto lg:hidden flex flex-col justify-between"
          style={{ height: 'calc(100vh - 4rem)' }}
        >
          <div className="space-y-6 pb-6">
            {/* Top Bar inside Drawer: Controls & Language */}
            <div className="flex items-center justify-between pb-3 border-b border-vjs-subtle">
              <span className="text-xs font-mono text-vjs-muted uppercase tracking-wider">
                Menu & Settings
              </span>
              <div className="flex items-center gap-2">
                <LanguageSelector />
              </div>
            </div>

            {/* Main Navigation Section */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF] px-3 pb-1">
                Pages & Solutions
              </div>
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    isActive ? 'text-[#00E5FF] bg-vjs-surface font-semibold' : 'text-vjs-primary hover:bg-vjs-surface-hover'
                  }`
                }
              >
                <HomeIcon className="w-4 h-4 text-[#00E5FF]" />
                <span>Home</span>
              </NavLink>

              <NavLink
                to="/services"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    isActive ? 'text-[#00E5FF] bg-vjs-surface font-semibold' : 'text-vjs-primary hover:bg-vjs-surface-hover'
                  }`
                }
              >
                <Layers className="w-4 h-4 text-[#00E5FF]" />
                <span>Services ({t.nav.services})</span>
              </NavLink>

              <NavLink
                to="/work"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    isActive ? 'text-[#00E5FF] bg-vjs-surface font-semibold' : 'text-vjs-primary hover:bg-vjs-surface-hover'
                  }`
                }
              >
                <Briefcase className="w-4 h-4 text-[#00E5FF]" />
                <span>Portfolio & Work ({t.nav.work})</span>
              </NavLink>

              <NavLink
                to="/team"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    isActive ? 'text-[#00E5FF] bg-vjs-surface font-semibold' : 'text-vjs-primary hover:bg-vjs-surface-hover'
                  }`
                }
              >
                <Users className="w-4 h-4 text-[#00E5FF]" />
                <span>Engineering Team ({t.nav.team})</span>
              </NavLink>

              <NavLink
                to="/process"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    isActive ? 'text-[#00E5FF] bg-vjs-surface font-semibold' : 'text-vjs-primary hover:bg-vjs-surface-hover'
                  }`
                }
              >
                <Workflow className="w-4 h-4 text-[#00E5FF]" />
                <span>Delivery Process ({t.nav.process})</span>
              </NavLink>

              <NavLink
                to="/about"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    isActive ? 'text-[#00E5FF] bg-vjs-surface font-semibold' : 'text-vjs-primary hover:bg-vjs-surface-hover'
                  }`
                }
              >
                <Info className="w-4 h-4 text-[#00E5FF]" />
                <span>About VJS TECH ({t.nav.about})</span>
              </NavLink>

              <NavLink
                to="/contact"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors ${
                    isActive ? 'text-[#00E5FF] bg-vjs-surface font-semibold' : 'text-vjs-primary hover:bg-vjs-surface-hover'
                  }`
                }
              >
                <Mail className="w-4 h-4 text-[#00E5FF]" />
                <span>Contact & Enquiries</span>
              </NavLink>
            </div>

            {/* Legal & Compliance Section */}
            <div className="space-y-1 pt-2 border-t border-vjs-subtle">
              <div className="text-[10px] font-mono uppercase tracking-wider text-vjs-muted px-3 pb-1">
                Legal & Compliance
              </div>
              <NavLink
                to="/terms"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? 'text-[#00E5FF] bg-vjs-surface' : 'text-vjs-secondary hover:text-vjs-primary hover:bg-vjs-surface-hover'
                  }`
                }
              >
                <FileText className="w-3.5 h-3.5 text-vjs-muted" />
                <span>Terms & Conditions</span>
              </NavLink>

              <NavLink
                to="/privacy"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? 'text-[#00E5FF] bg-vjs-surface' : 'text-vjs-secondary hover:text-vjs-primary hover:bg-vjs-surface-hover'
                  }`
                }
              >
                <Shield className="w-3.5 h-3.5 text-vjs-muted" />
                <span>Privacy Policy</span>
              </NavLink>

              <NavLink
                to="/refunds"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                    isActive ? 'text-[#00E5FF] bg-vjs-surface' : 'text-vjs-secondary hover:text-vjs-primary hover:bg-vjs-surface-hover'
                  }`
                }
              >
                <CreditCard className="w-3.5 h-3.5 text-vjs-muted" />
                <span>Refund Policy</span>
              </NavLink>
            </div>
          </div>

          {/* Bottom Actions: Login / Portal + Get Quote */}
          <div className="pt-4 border-t border-vjs-subtle space-y-2.5 pb-4">
            {isAuthenticated ? (
              <Link
                to={user?.role === 'admin' ? '/admin' : '/portal'}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-vjs-strong bg-vjs-surface text-vjs-primary font-medium text-xs text-center"
              >
                {user?.role === 'admin' ? (
                  <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
                ) : (
                  <UserIcon className="w-4 h-4 text-[#00E5FF]" />
                )}
                <span>{user?.role === 'admin' ? 'Administration Portal' : 'Client Project Portal'}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-vjs-subtle bg-vjs-surface text-vjs-primary font-medium text-xs text-center"
              >
                <Lock className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>{t.nav.clientLogin}</span>
              </Link>
            )}

            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs tracking-wide text-center shadow hover:bg-[#33EBFF] transition-colors"
            >
              <span>{t.nav.getQuote}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
