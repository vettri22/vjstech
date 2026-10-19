import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, MessageSquare, Info } from 'lucide-react';
import { TeamCard } from '../components/TeamCard';
import type { TeamMemberProps } from '../components/TeamCard';
import { useLanguage } from '../context/LanguageContext';

// Default confirmed team members based on official project specification
const fallbackTeam: TeamMemberProps[] = [
  {
    name: 'Vijay Vasanthan K S',
    role: 'Project Lead + Client Communication',
    responsibilities: 'Coordinates project planning, client communication, requirement discussions, and delivery alignment.',
    skills: ['Project Management', 'Client Relations', 'Requirements Engineering', 'Agile Delivery'],
    avatar_initials: 'VV',
    photo_url: '/uploads/team/team_5a047602-88d8-4ab0-849f-056ddc57bdf9_1792401529766.jpg',
    order_index: 1,
  },
  {
    name: 'Jai pirajhith M',
    role: 'UI/UX + Frontend',
    responsibilities: 'Focuses on interface design, user experience, responsive layouts, and frontend implementation.',
    skills: ['UI/UX Design', 'React / TypeScript', 'Design Systems', 'Responsive Web', 'WCAG Accessibility'],
    avatar_initials: 'JP',
    photo_url: '/uploads/team/team_f0281466-edf5-4394-908c-e8e6e7d4d248_1792401279893.png',
    order_index: 2,
  },
  {
    name: 'Keerthinandhan Y',
    role: 'Backend + API',
    responsibilities: 'Focuses on backend services, application logic, API development, and system integration.',
    skills: ['REST APIs', 'Node.js / Express', 'Python / FastAPI', 'System Integration', 'Auth & Security'],
    avatar_initials: 'KY',
    photo_url: '/uploads/team/team_42ad33d5-ca77-4b3c-8777-9d5b1def6bdc_1792399975615.png',
    order_index: 3,
  },
  {
    name: 'Vettriselvam U',
    role: 'Database + DevOps',
    responsibilities: 'Focuses on database design, data management, deployment workflows, and DevOps responsibilities.',
    skills: ['PostgreSQL / SQL', 'Database Optimization', 'Docker & CI/CD', 'Cloud Deployment', 'Linux'],
    avatar_initials: 'VU',
    photo_url: '/uploads/team/team_27f1ff30-51f6-4ee2-ba38-bd234364273d_1792401680094.jpg',
    order_index: 4,
  },
  {
    name: 'Sanjay Kumar E',
    role: 'AI/ML + QA + Security',
    responsibilities: 'Focuses on AI/ML integration, quality assurance, software testing, and security-focused reviews.',
    skills: ['AI/ML Integrations', 'Automated Testing', 'Application Security', 'Defensive Hardening', 'Quality Assurance'],
    avatar_initials: 'SK',
    photo_url: '/uploads/team/team_38df086b-17ea-4089-86a3-723705b77761_1792401476777.jpg',
    order_index: 5,
  },
];

export const Team: React.FC = () => {
  const { t } = useLanguage();
  const [team, setTeam] = useState<TeamMemberProps[]>(fallbackTeam);

  useEffect(() => {
    fetch('/api/team')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        if (data.team && data.team.length > 0) {
          setTeam(data.team);
        }
      })
      .catch(err => {
        console.warn('Using confirmed offline team data fallback:', err);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-vjs-subtle bg-vjs-surface text-xs font-mono text-[#00E5FF]">
          <Users className="w-3.5 h-3.5" />
          <span>{t.team.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-vjs-primary">
          {t.team.title}
        </h1>
        <p className="text-base sm:text-lg text-vjs-secondary leading-relaxed">
          {t.team.subtitle}
        </p>
      </div>

      {/* Disclaimers & Ethics statement */}
      <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface text-xs text-vjs-muted flex items-start gap-2.5 max-w-3xl">
        <Info className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          The profiles below describe the assigned operational responsibilities of each team member within VJS TECH projects. We do not publish fabricated certifications, exaggerated employee headcounts, or invented corporate histories.
        </p>
      </div>

      {/* Team Grid (5 Confirmed Members) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {team.map((member, idx) => (
          <TeamCard key={idx} member={member} />
        ))}
      </div>

      {/* Direct Collaboration CTA */}
      <div className="p-8 sm:p-10 rounded-2xl border border-vjs-subtle bg-gradient-to-r from-vjs-surface to-vjs-surface-elevated flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-vjs-primary">
            Work directly with our engineering team
          </h2>
          <p className="text-xs sm:text-sm text-vjs-secondary max-w-xl">
            Discuss your requirements directly with Vijay Vasanthan K S (Project Lead) and our technical specialists.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#050505] font-semibold text-xs transition-colors hover:bg-[#33EBFF]"
          >
            <span>Start a Conversation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <a
            href="https://wa.me/919360761552?text=Hello%20Vijay%2C%20I%20would%20like%20to%20discuss%20a%20project%20with%20VJS%20TECH."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-vjs-strong bg-vjs-surface hover:bg-vjs-surface-hover text-vjs-primary font-medium text-xs transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>WhatsApp Project Lead</span>
          </a>
        </div>
      </div>
    </div>
  );
};
