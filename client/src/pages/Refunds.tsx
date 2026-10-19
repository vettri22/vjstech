import React from 'react';
import { RefreshCcw } from 'lucide-react';

export const Refunds: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="space-y-3 border-b border-vjs-subtle pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <RefreshCcw className="w-3.5 h-3.5" />
          <span>Commercial Transparency</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-vjs-primary">
          Refund & Cancellation Policy
        </h1>
        <p className="text-xs font-mono text-vjs-muted">
          Applicable to Custom Software Engineering & Agency Services • Operating Jurisdiction: India
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-vjs-secondary leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            1. Nature of Custom Software Solutions
          </h2>
          <p>
            VJS TECH provides tailored software development, systems architecture, and design services. Because our work is custom-engineered to your specific technical specifications, commercial refunds are handled through structured milestone assessments rather than generic consumer product returns.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            2. Cancellation Before Project Commencement
          </h2>
          <p>
            If a client requests project cancellation in writing before any technical discovery sessions, wireframing, or software architecture work has commenced, any advance deposit paid will be refunded in full, minus any non-recoverable third-party payment gateway transaction fees.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            3. Cancellation After Work Has Commenced
          </h2>
          <p>
            If a project is cancelled while active development is in progress:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Completed & Approved Milestones:</strong> Payments made for previously completed milestones where deliverables have been demonstrated or handed over are final and non-refundable.
            </li>
            <li>
              <strong>Active In-Progress Milestone:</strong> A pro-rata evaluation is conducted based on actual engineering hours and completed deliverables. Any unexpended balance from that milestone's advance will be credited back to the client.
            </li>
            <li>
              <strong>Handover of Partial Work:</strong> The client will receive all source code and documentation created up to the formal cancellation date.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            4. Duplicate, Erroneous, or Failed Payments
          </h2>
          <p>
            If your account was billed multiple times for the same milestone invoice due to a network glitch or gateway processing error:
          </p>
          <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface space-y-1.5">
            <div className="font-semibold text-vjs-primary">Guaranteed 100% Reversal:</div>
            <p className="text-xs">
              Upon notification, duplicate transactions are investigated immediately and refunded 100% within <strong>5 to 7 business days</strong> to the original payment source (bank account, UPI, or card).
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-vjs-primary">
            5. Procedure for Requesting a Refund
          </h2>
          <p>
            To initiate a formal cancellation or refund inquiry, please send an email from your authorized project contact address to:
          </p>
          <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated font-mono text-xs space-y-1">
            <div>Email: vjstechofficial@gmail.com</div>
            <div>Subject: Refund Request — [Project Name / Reference Code]</div>
            <div>WhatsApp Verification: +91 9360761552</div>
          </div>
          <p className="text-xs text-vjs-muted">
            Please include your unique project tracking code (e.g. <code>VJS-2026-XXXX</code>) and invoice receipt to expedite review.
          </p>
        </section>
      </div>
    </div>
  );
};
