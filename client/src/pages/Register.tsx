import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, Mail } from 'lucide-react';

export const Register: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Restricted Client Provisioning</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-vjs-primary">
          Client Account Provisioning
        </h1>
        <p className="text-xs text-vjs-secondary max-w-sm mx-auto leading-relaxed">
          To maintain strict data confidentiality and isolation, client accounts are created exclusively by VJS TECH Administration.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface shadow-xl space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] mx-auto">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-vjs-primary">Already an Active Client?</h2>
          <p className="text-xs text-vjs-secondary leading-relaxed">
            Your login ID and password are provisioned directly by our project lead upon contract signing. Please check your onboarding email or sign in below.
          </p>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            to="/login"
            className="w-full py-2.5 px-4 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs tracking-wide shadow flex items-center justify-center gap-2 hover:bg-[#33EBFF] transition-colors"
          >
            <span>Go to Client Login</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            to="/contact"
            className="w-full py-2.5 px-4 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated hover:bg-vjs-surface-hover text-xs font-medium text-vjs-primary flex items-center justify-center gap-2 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Request Account from Project Lead</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
