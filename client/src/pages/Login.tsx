import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isRequestingUnlock, setIsRequestingUnlock] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/portal';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 429 || data.rateLimitReached || (data.error && data.error.includes('Rate Limit'))) {
        setIsRateLimited(true);
        setError(data.error || 'Security Rate Limit: Too many failed login attempts.');
        return;
      }

      if (res.ok && data.token) {
        setIsRateLimited(false);
        login(data.token, data.user);
        if (data.user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(data.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setError('Network communication failure. Please verify backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskHelpWithAdmin = async () => {
    if (!email || !email.includes('@')) {
      alert('Please enter your registered email address first.');
      return;
    }

    setIsRequestingUnlock(true);
    try {
      const res = await fetch('/api/auth/request-unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason: 'Client hit login rate limit' }),
      });
      const data = await res.json();
      if (res.ok) {
        setUnlockMessage(data.message || 'Help request sent to VJS TECH administration.');
      } else {
        alert(data.error || 'Failed to submit unlock request.');
      }
    } catch (err) {
      alert('Network error submitting help request.');
    } finally {
      setIsRequestingUnlock(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secure Client Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-vjs-primary">
          Log In to Client Portal
        </h1>
        <p className="text-xs text-vjs-secondary">
          Track active milestone deliverables, review project updates, and collaborate with VJS TECH engineers.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface shadow-xl">
        {error && (
          <div className="mb-4 p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isRateLimited && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs space-y-3">
            <div className="flex items-start gap-2 text-amber-300 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Login Rate Limit Protection Triggered</span>
            </div>
            <p className="text-vjs-secondary text-[11px] leading-relaxed">
              Multiple sign-in attempts were recorded. You can request VJS TECH administration to immediately unblock and reset your access so you can sign in right away.
            </p>
            {unlockMessage ? (
              <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{unlockMessage}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAskHelpWithAdmin}
                disabled={isRequestingUnlock || !email}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{isRequestingUnlock ? 'Contacting Administration...' : 'Ask Help with Admin (Approve Reset)'}</span>
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-vjs-primary mb-1">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-vjs-muted absolute left-3 top-2.5" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-xs font-medium text-vjs-primary">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-vjs-muted absolute left-3 top-2.5" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#00E5FF] hover:bg-[#33EBFF] disabled:opacity-50 text-[#050505] font-bold text-xs tracking-wide shadow transition-colors flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t border-vjs-subtle text-center text-xs text-vjs-muted space-y-1.5">
          <div className="text-vjs-primary font-medium">Client Portal Provisioning</div>
          <p className="text-[11px] text-vjs-secondary max-w-xs mx-auto leading-relaxed">
            Client accounts are provisioned exclusively by VJS TECH Administration for verified project engagements. If you require access, please reach out via{' '}
            <Link to="/contact" className="text-[#00E5FF] font-semibold hover:underline">
              Project Enquiries
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
};
