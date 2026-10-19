import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';

export interface TeamMemberProps {
  id?: string;
  name: string;
  role: string;
  bio?: string;
  responsibilities: string;
  skills: string[];
  avatar_initials: string;
  photo_url?: string;
  order_index?: number;
}

export const TeamCard: React.FC<{ member: TeamMemberProps }> = ({ member }) => {
  const [imgError, setImgError] = useState(false);

  const hasPhoto = member.photo_url && member.photo_url.trim().length > 0 && !imgError;

  return (
    <div className="rounded-2xl border border-vjs-subtle bg-vjs-surface hover:border-[#00E5FF]/40 transition-all flex flex-col justify-between overflow-hidden shadow-lg">
      {/* 1. Large Portrait-Sized Executive Photo Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-vjs-surface-elevated border-b border-vjs-subtle">
        {hasPhoto ? (
          <img
            src={member.photo_url}
            alt={`${member.name} portrait`}
            className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#260747] via-[#10071c] to-[#050505] flex flex-col items-center justify-center p-6 text-center relative select-none">
            {/* Ambient tech grid effect */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="w-24 h-24 rounded-2xl bg-[#3B0A6B]/50 border border-[#00E5FF]/50 flex items-center justify-center shadow-xl mb-3">
              <span className="text-3xl font-mono font-bold text-[#00E5FF] tracking-wider">
                {member.avatar_initials}
              </span>
            </div>
            <span className="text-[11px] font-mono text-vjs-muted uppercase tracking-widest">
              Executive Profile
            </span>
          </div>
        )}

        {/* Floating Core Member badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md bg-[#050505]/80 backdrop-blur-md text-[#00E5FF] border border-[#00E5FF]/30 shadow">
            <UserCheck className="w-3 h-3 text-[#00E5FF]" />
            <span>Core Member</span>
          </span>
        </div>
      </div>

      {/* 2. Member Information Section */}
      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Name & Official Role */}
          <div>
            <h3 className="text-xl font-bold text-vjs-primary tracking-tight">
              {member.name}
            </h3>
            <div className="mt-1 text-xs font-semibold text-[#00E5FF] font-mono">
              {member.role}
            </div>
          </div>

          {/* Assigned Responsibilities */}
          <div className="pt-2 border-t border-vjs-subtle space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-vjs-muted font-medium">
              Assigned Responsibilities:
            </div>
            <p className="text-xs text-vjs-secondary leading-relaxed">
              {member.responsibilities}
            </p>
          </div>
        </div>

        {/* Skill Matrix Badges */}
        {member.skills && member.skills.length > 0 && (
          <div className="pt-3 border-t border-vjs-subtle flex flex-wrap gap-1.5">
            {member.skills.map(skill => (
              <span
                key={skill}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-vjs-surface-elevated text-vjs-secondary border border-vjs-subtle"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
