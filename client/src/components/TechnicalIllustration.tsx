import React from 'react';
import { Layers, ShieldCheck, Cpu, Database } from 'lucide-react';

export const TechnicalIllustration: React.FC = () => {
  return (
    <div className="relative w-full rounded-2xl border border-vjs-subtle bg-vjs-surface p-5 sm:p-6 shadow-2xl overflow-hidden">
      {/* Editorial Header bar with simulated terminal status */}
      <div className="flex items-center justify-between pb-4 border-b border-vjs-subtle text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]/80" />
          <span className="text-vjs-muted ml-2">architecture-spec.vjs</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#00E5FF]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
          <span>PRODUCTION READY</span>
        </div>
      </div>

      {/* Layered Architectural Blueprint */}
      <div className="mt-5 space-y-3.5 font-mono">
        {/* Layer 1: Client & Presentation */}
        <div className="p-3.5 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated hover:border-[#00E5FF]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-[#3B0A6B]/30 border border-[#3B0A6B]/60 text-[#00E5FF]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-vjs-primary">PRESENTATION TIER</div>
                <div className="text-[11px] text-vjs-muted">React • TypeScript • Tailwind • Responsive UI/UX</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              WCAG 2.2 AA
            </span>
          </div>
        </div>

        {/* Data Transit Line */}
        <div className="flex items-center justify-center">
          <div className="h-3 w-px bg-gradient-to-b from-[#00E5FF] to-[#3B0A6B]" />
        </div>

        {/* Layer 2: API Gateway & Security */}
        <div className="p-3.5 rounded-xl border border-[#3B0A6B]/50 bg-vjs-surface-elevated hover:border-[#00E5FF]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-[#3B0A6B]/40 border border-[#3B0A6B] text-[#00E5FF]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-vjs-primary">SECURITY & API GATEWAY</div>
                <div className="text-[11px] text-vjs-muted">JWT Auth • RBAC • IDOR Defense • Rate Limiting</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#3B0A6B]/30 text-purple-300 border border-[#3B0A6B]">
              DPDP & OWASP
            </span>
          </div>
        </div>

        {/* Data Transit Line */}
        <div className="flex items-center justify-center">
          <div className="h-3 w-px bg-gradient-to-b from-[#3B0A6B] to-[#00E5FF]" />
        </div>

        {/* Layer 3: Application Logic & AI */}
        <div className="p-3.5 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated hover:border-[#00E5FF]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-[#3B0A6B]/30 border border-[#3B0A6B]/60 text-[#00E5FF]">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-vjs-primary">APPLICATION CORE & WORKFLOWS</div>
                <div className="text-[11px] text-vjs-muted">Node.js / Express • Python AI Inference • Task Queues</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-vjs-surface text-vjs-secondary border border-vjs-subtle">
              Async Services
            </span>
          </div>
        </div>

        {/* Data Transit Line */}
        <div className="flex items-center justify-center">
          <div className="h-3 w-px bg-gradient-to-b from-[#00E5FF] to-[#3B0A6B]" />
        </div>

        {/* Layer 4: Database & Audit Storage */}
        <div className="p-3.5 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated hover:border-[#00E5FF]/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-[#3B0A6B]/30 border border-[#3B0A6B]/60 text-[#00E5FF]">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-vjs-primary">DATA & AUDIT ENGINE</div>
                <div className="text-[11px] text-vjs-muted">PostgreSQL / SQLite • Parameterized SQL • Audit Trail</div>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
              ACID Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Engineering Metrics Footer */}
      <div className="mt-5 pt-4 border-t border-vjs-subtle grid grid-cols-3 gap-2 text-center font-mono">
        <div className="p-2 rounded-lg bg-vjs-surface border border-vjs-subtle">
          <div className="text-xs font-bold text-[#00E5FF]">100%</div>
          <div className="text-[10px] text-vjs-muted">Type-Safe</div>
        </div>
        <div className="p-2 rounded-lg bg-vjs-surface border border-vjs-subtle">
          <div className="text-xs font-bold text-vjs-primary">0</div>
          <div className="text-[10px] text-vjs-muted">Trackers</div>
        </div>
        <div className="p-2 rounded-lg bg-vjs-surface border border-vjs-subtle">
          <div className="text-xs font-bold text-purple-400">Strict</div>
          <div className="text-[10px] text-vjs-muted">IDOR Guard</div>
        </div>
      </div>
    </div>
  );
};
