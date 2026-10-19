import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  CheckCircle2,
  MessageSquare,
  LogOut,
  Send,
  AlertCircle,
  Calendar,
  Clock,
  Layers,
  Check,
  X,
  ExternalLink,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ClientPortal: React.FC = () => {
  const { user, token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projectDetail, setProjectDetail] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Active tab within the selected project
  const [activeProjectTab, setActiveProjectTab] = useState<'overview' | 'architectures' | 'messages'>('overview');

  // Direct conversation stream state
  const [directMessageText, setDirectMessageText] = useState('');
  const [directMessageType, setDirectMessageType] = useState<'message' | 'feedback' | 'note'>('message');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Architecture review state
  const [reviewingArchId, setReviewingArchId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState<{ [archId: string]: string }>({});
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Traditional sprint note state
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [isPostingUpdate, setIsPostingUpdate] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to load project records');
        }

        const data = await res.json();
        setProjects(data.projects || []);
        if (data.projects && data.projects.length > 0) {
          setSelectedProjectId(data.projects[0].id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, token, navigate]);

  const loadProjectDetail = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjectDetail(data);
      }
    } catch (err) {
      console.error('Error fetching project detail:', err);
    }
  };

  useEffect(() => {
    if (!selectedProjectId || !token) return;
    loadProjectDetail(selectedProjectId);
  }, [selectedProjectId, token]);

  const getDeadlineStatus = (targetEndDate?: string | null) => {
    if (!targetEndDate) {
      return { text: 'Scoping / Milestone-based delivery', isNear: false, isOverdue: false, days: null };
    }
    const target = new Date(targetEndDate);
    const now = new Date();
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return {
        text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'}`,
        isNear: true,
        isOverdue: true,
        days: diffDays,
      };
    }
    if (diffDays === 0) {
      return {
        text: 'Scheduled for Delivery Today!',
        isNear: true,
        isOverdue: false,
        days: 0,
      };
    }
    if (diffDays <= 7) {
      return {
        text: `Approaching Deadline: Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
        isNear: true,
        isOverdue: false,
        days: diffDays,
      };
    }
    return {
      text: `Target: ${targetEndDate.split('T')[0]} (${diffDays} days remaining)`,
      isNear: false,
      isOverdue: false,
      days: diffDays,
    };
  };

  const handleReviewArchitecture = async (archId: string, status: 'approved' | 'declined') => {
    if (!selectedProjectId) return;
    const clientFeedback = declineReason[archId] || '';
    if (status === 'declined' && !clientFeedback.trim()) {
      alert('Please provide instructions describing what changes or adjustments are required.');
      return;
    }

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/projects/${selectedProjectId}/architectures/${archId}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          clientFeedback: status === 'declined' ? clientFeedback.trim() : undefined,
        }),
      });

      if (res.ok) {
        setFeedbackMessage(
          status === 'approved'
            ? 'Architecture & idea proposal approved successfully. Engineering lead has been notified.'
            : 'Change request submitted. Your feedback has been forwarded directly to the engineering team.'
        );
        setReviewingArchId(null);
        setDeclineReason(prev => ({ ...prev, [archId]: '' }));
        loadProjectDetail(selectedProjectId);
        setTimeout(() => setFeedbackMessage(null), 4000);
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to process architecture review.');
      }
    } catch (err) {
      console.error('Failed to review architecture:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSendDirectMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !directMessageText.trim()) return;

    setIsSendingMessage(true);
    try {
      const res = await fetch(`/api/projects/${selectedProjectId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: directMessageText.trim(),
          messageType: directMessageType,
        }),
      });

      if (res.ok) {
        setDirectMessageText('');
        loadProjectDetail(selectedProjectId);
      }
    } catch (err) {
      console.error('Failed to send direct message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handlePostUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateTitle.trim() || !updateMessage.trim() || !selectedProjectId) return;

    setIsPostingUpdate(true);
    try {
      const res = await fetch(`/api/projects/${selectedProjectId}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updateTitle,
          message: updateMessage,
        }),
      });

      if (res.ok) {
        loadProjectDetail(selectedProjectId);
        setUpdateTitle('');
        setUpdateMessage('');
        setFeedbackMessage('Project sprint note logged successfully.');
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to post project note:', err);
    } finally {
      setIsPostingUpdate(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'In Development':
        return 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/40';
      case 'Approved':
      case 'Completed':
      case 'Delivered & Deployed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40';
      case 'Requirements Review':
      case 'Architecture & Prototype':
      case 'Proposal':
        return 'bg-[#3B0A6B]/20 text-purple-300 border-[#3B0A6B]/60';
      case 'Testing & Hardening':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/40';
      default:
        return 'bg-vjs-surface-elevated text-vjs-secondary border-vjs-subtle';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-mono text-vjs-muted">Loading authorized client records...</p>
      </div>
    );
  }

  const architectures = projectDetail?.architectures || [];
  const pendingArchitectures = architectures.filter((a: any) => a.status === 'pending');
  const messages = projectDetail?.messages || [];
  const milestones = projectDetail?.milestones || [];
  const updates = projectDetail?.updates || [];
  const deadline = getDeadlineStatus(projectDetail?.project?.target_end_date);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar: Client info and Logout */}
      <div className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3B0A6B] to-[#0B0B0E] border border-[#3B0A6B] flex items-center justify-center text-[#00E5FF] font-mono font-bold text-sm">
            {user?.fullName.slice(0, 2).toUpperCase() || 'CL'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-vjs-primary">{user?.fullName}</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                Verified Client
              </span>
            </div>
            <div className="text-xs text-vjs-muted">
              {user?.organization ? `${user.organization} • ` : ''}
              {user?.email}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated hover:bg-vjs-surface-hover text-vjs-secondary hover:text-vjs-primary text-xs font-medium transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Secure Sign Out</span>
        </button>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-medium flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-vjs-muted hover:text-vjs-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Client Dashboard Body */}
      {projects.length === 0 ? (
        /* Empty State */
        <div className="p-12 rounded-2xl border border-dashed border-vjs-subtle bg-vjs-surface text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-xl bg-vjs-surface-elevated flex items-center justify-center text-vjs-muted">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-vjs-primary">No Active Projects Assigned</h2>
            <p className="text-xs text-vjs-secondary max-w-md mx-auto">
              Your client account is active. Once our project leads formalize and assign your project record, milestones, architecture proposals, and timeline updates will display here.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="mailto:vjstechofficial@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#00E5FF] text-[#050505] text-xs font-bold hover:bg-[#33EBFF] transition-colors"
            >
              Contact Project Lead
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Project Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-vjs-muted font-bold px-1">
              Your Authorized Projects ({projects.length})
            </div>
            <div className="space-y-2">
              {projects.map(proj => (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => setSelectedProjectId(proj.id)}
                  className={`w-full p-4 rounded-xl text-left border transition-all ${
                    selectedProjectId === proj.id
                      ? 'border-[#00E5FF] bg-vjs-surface-elevated shadow-md'
                      : 'border-vjs-subtle bg-vjs-surface hover:border-vjs-strong'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold text-[#00E5FF]">
                      {proj.reference_code}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getStatusBadge(
                        proj.status
                      )}`}
                    >
                      {proj.status}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-vjs-primary">{proj.name}</h3>
                  <p className="mt-1 text-xs text-vjs-secondary line-clamp-2">
                    {proj.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Project Detail View */}
          {projectDetail ? (
            <div className="lg:col-span-8 space-y-6">
              {/* Project Card Header & Delivery Calendar Status */}
              <div className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-vjs-subtle pb-4">
                  <div>
                    <span className="text-xs font-mono text-vjs-muted">
                      Tracking Code: {projectDetail.project.reference_code}
                    </span>
                    <h2 className="text-xl font-bold text-vjs-primary mt-0.5">
                      {projectDetail.project.name}
                    </h2>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-3 py-1 rounded-md border ${getStatusBadge(
                      projectDetail.project.status
                    )}`}
                  >
                    {projectDetail.project.status}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-vjs-secondary leading-relaxed">
                  {projectDetail.project.description}
                </p>

                {/* Delivery Calendar Card with Proximity Alert */}
                <div className="p-4 rounded-xl bg-vjs-surface-elevated border border-vjs-subtle space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-vjs-primary flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#00E5FF]" />
                      <span>Dedicated Delivery Calendar</span>
                    </span>
                    <span className="text-[10px] font-mono text-vjs-muted">
                      Admin Scheduled
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-vjs-surface border border-vjs-subtle">
                      <span className="block text-vjs-muted text-[10px]">Project Kickoff</span>
                      <span className="text-vjs-primary font-bold">{projectDetail.project.start_date || 'In Scoping'}</span>
                    </div>

                    <div className="p-3 rounded-lg bg-vjs-surface border border-vjs-subtle">
                      <span className="block text-vjs-muted text-[10px]">Scheduled Delivery</span>
                      <span className="text-vjs-primary font-bold">
                        {projectDetail.project.target_end_date ? projectDetail.project.target_end_date.split('T')[0] : 'Milestone Based'}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-vjs-surface border border-vjs-subtle">
                      <span className="block text-vjs-muted text-[10px]">Access Isolation</span>
                      <span className="text-[#00E5FF] font-bold">Server Guarded</span>
                    </div>
                  </div>

                  {/* Deadline Proximity Notification Banner */}
                  <div
                    className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                      deadline.isOverdue
                        ? 'bg-red-500/10 text-red-400 border border-red-500/30 font-bold'
                        : deadline.isNear
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold'
                        : 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                    }`}
                  >
                    <Clock className="w-4 h-4 shrink-0" />
                    <div className="flex-1">
                      <span className="font-bold">{deadline.text}</span>
                      {deadline.isNear && (
                        <span className="block text-[11px] opacity-90 mt-0.5">
                          Engineering lead has been alerted regarding delivery completion.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pending Architecture Proposal Alert Callout */}
                {pendingArchitectures.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        <strong>Action Required:</strong> {pendingArchitectures.length} Architecture & Idea Proposal awaiting your approval or change request.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveProjectTab('architectures')}
                      className="px-2.5 py-1 rounded-lg bg-amber-400 text-[#050505] text-[11px] font-bold shrink-0 hover:bg-amber-300 transition-colors"
                    >
                      Review Now
                    </button>
                  </div>
                )}
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex border-b border-vjs-subtle gap-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setActiveProjectTab('overview')}
                  className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeProjectTab === 'overview'
                      ? 'border-[#00E5FF] text-[#00E5FF]'
                      : 'border-transparent text-vjs-muted hover:text-vjs-primary'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Overview & Milestones</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveProjectTab('architectures')}
                  className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeProjectTab === 'architectures'
                      ? 'border-[#00E5FF] text-[#00E5FF]'
                      : 'border-transparent text-vjs-muted hover:text-vjs-primary'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Architecture & Ideas</span>
                  {pendingArchitectures.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-[#050505] font-bold">
                      {pendingArchitectures.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveProjectTab('messages')}
                  className={`pb-2.5 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    activeProjectTab === 'messages'
                      ? 'border-[#00E5FF] text-[#00E5FF]'
                      : 'border-transparent text-vjs-muted hover:text-vjs-primary'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Direct Discussion</span>
                  {messages.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-vjs-surface-elevated text-vjs-secondary">
                      {messages.length}
                    </span>
                  )}
                </button>
              </div>

              {/* TAB 1: OVERVIEW & MILESTONES */}
              {activeProjectTab === 'overview' && (
                <div className="space-y-6">
                  {/* Milestones Checklist */}
                  <div className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4">
                    <h3 className="text-sm font-bold text-vjs-primary font-mono uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
                      <span>Project Milestones & Deliverables</span>
                    </h3>

                    {milestones.length > 0 ? (
                      <div className="space-y-3">
                        {milestones.map((milestone: any) => {
                          const isComplete = milestone.status === 'completed' || milestone.status === 'approved';
                          const isInProgress = milestone.status === 'in_progress';
                          return (
                            <div
                              key={milestone.id}
                              className="p-3.5 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated flex items-start justify-between gap-3"
                            >
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      isComplete
                                        ? 'bg-emerald-400'
                                        : isInProgress
                                        ? 'bg-[#00E5FF] animate-pulse'
                                        : 'bg-vjs-muted'
                                    }`}
                                  />
                                  <h4 className="text-xs sm:text-sm font-bold text-vjs-primary">
                                    {milestone.title}
                                  </h4>
                                </div>
                                <p className="text-xs text-vjs-secondary pl-4">
                                  {milestone.description}
                                </p>
                                {milestone.due_date && (
                                  <div className="text-[11px] font-mono text-vjs-muted pl-4">
                                    Target Date: {milestone.due_date}
                                  </div>
                                )}
                              </div>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase shrink-0 ${
                                  isComplete
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : isInProgress
                                    ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/30'
                                    : 'bg-vjs-surface text-vjs-muted border-vjs-subtle'
                                }`}
                              >
                                {milestone.status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-vjs-muted font-mono">
                        Milestones are currently being configured for this project.
                      </p>
                    )}
                  </div>

                  {/* Project Updates Stream */}
                  <div className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4">
                    <h3 className="text-sm font-bold text-vjs-primary font-mono uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#00E5FF]" />
                      <span>Sprint Timeline Logs</span>
                    </h3>

                    {updates.length > 0 ? (
                      <div className="space-y-3">
                        {updates.map((update: any) => (
                          <div
                            key={update.id}
                            className="p-3.5 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-vjs-primary">
                                {update.title}
                              </span>
                              <span className="text-[10px] font-mono text-vjs-muted">
                                {new Date(update.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-vjs-secondary leading-relaxed">
                              {update.message}
                            </p>
                            {update.author_name && (
                              <div className="text-[10px] font-mono text-[#00E5FF]">
                                Logged by: {update.author_name}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-vjs-muted font-mono">
                        No timeline logs recorded yet.
                      </p>
                    )}

                    {/* Form to submit a client sprint note */}
                    <form onSubmit={handlePostUpdate} className="pt-4 border-t border-vjs-subtle space-y-3">
                      <h4 className="text-xs font-bold text-vjs-primary font-mono uppercase tracking-wider">
                        Log a Project Sprint Note
                      </h4>
                      <input
                        type="text"
                        required
                        value={updateTitle}
                        onChange={e => setUpdateTitle(e.target.value)}
                        placeholder="Subject / Sprint Topic"
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                      />
                      <textarea
                        rows={2}
                        required
                        value={updateMessage}
                        onChange={e => setUpdateMessage(e.target.value)}
                        placeholder="Enter your message or sprint note..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface text-vjs-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                      />
                      <button
                        type="submit"
                        disabled={isPostingUpdate}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00E5FF] hover:bg-[#33EBFF] text-[#050505] text-xs font-bold transition-colors"
                      >
                        <Send className="w-3 h-3" />
                        <span>{isPostingUpdate ? 'Submitting...' : 'Log Note'}</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 2: ARCHITECTURE & IDEA PROPOSALS */}
              {activeProjectTab === 'architectures' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-vjs-subtle pb-4">
                      <div>
                        <h3 className="text-sm font-bold text-vjs-primary font-mono uppercase tracking-wider flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#00E5FF]" />
                          <span>Architecture & Idea Proposals</span>
                        </h3>
                        <p className="text-xs text-vjs-secondary mt-1">
                          Review engineering architectures, technical ideas, and system blueprints proposed by the VJS TECH team. Approve proposals to proceed or decline with specific modification instructions.
                        </p>
                      </div>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-vjs-surface-elevated text-vjs-secondary border border-vjs-subtle shrink-0">
                        Total: {architectures.length}
                      </span>
                    </div>

                    {architectures.length === 0 ? (
                      <div className="p-8 text-center text-vjs-muted text-xs font-mono space-y-2">
                        <Layers className="w-8 h-8 mx-auto opacity-40 text-vjs-muted" />
                        <p>No architecture proposals submitted by the engineering team yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {architectures.map((arch: any) => {
                          const isPending = arch.status === 'pending';
                          const isApproved = arch.status === 'approved';
                          const isDeclined = arch.status === 'declined';
                          const isEditingDecline = reviewingArchId === arch.id;

                          return (
                            <div
                              key={arch.id}
                              className={`p-5 rounded-2xl border space-y-4 transition-all ${
                                isPending
                                  ? 'border-amber-500/40 bg-amber-500/5'
                                  : isApproved
                                  ? 'border-emerald-500/30 bg-emerald-500/5'
                                  : 'border-red-500/30 bg-red-500/5'
                              }`}
                            >
                              {/* Proposal Header */}
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <h4 className="text-sm font-bold text-vjs-primary">
                                    {arch.title}
                                  </h4>
                                  <span className="text-[10px] font-mono text-vjs-muted">
                                    Submitted by VJS TECH on {new Date(arch.created_at).toLocaleDateString()}
                                  </span>
                                </div>

                                <span
                                  className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-md border uppercase ${
                                    isApproved
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                      : isDeclined
                                      ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                      : 'bg-amber-500/10 text-amber-300 border-amber-500/40 animate-pulse'
                                  }`}
                                >
                                  {isApproved
                                    ? 'Approved by Client'
                                    : isDeclined
                                    ? 'Revision Requested'
                                    : 'Awaiting Your Review'}
                                </span>
                              </div>

                              {/* Proposal Description */}
                              <p className="text-xs sm:text-sm text-vjs-secondary leading-relaxed whitespace-pre-line">
                                {arch.description}
                              </p>

                              {/* Tech Spec / Specification if available */}
                              {arch.tech_spec && (
                                <div className="p-3.5 rounded-xl bg-vjs-surface border border-vjs-subtle space-y-1">
                                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                                    Technical Specification & Stack
                                  </div>
                                  <pre className="text-xs font-mono text-vjs-secondary whitespace-pre-wrap">
                                    {arch.tech_spec}
                                  </pre>
                                </div>
                              )}

                              {/* Diagram Link */}
                              {arch.diagram_url && (
                                <div>
                                  <a
                                    href={arch.diagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00E5FF] hover:underline"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>View Architecture Diagram / Prototype Wireframe</span>
                                  </a>
                                </div>
                              )}

                              {/* Status Details */}
                              {isApproved && (
                                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center gap-2">
                                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                                  <span>
                                    You approved this architecture proposal. The team has progressed this spec into development sprints.
                                  </span>
                                </div>
                              )}

                              {isDeclined && (
                                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono space-y-1">
                                  <div className="flex items-center gap-2 font-bold text-red-400">
                                    <X className="w-4 h-4 shrink-0" />
                                    <span>You requested changes on this proposal:</span>
                                  </div>
                                  <p className="pl-6 text-xs text-vjs-secondary">
                                    "{arch.client_feedback}"
                                  </p>
                                </div>
                              )}

                              {/* Review Actions if Pending */}
                              {isPending && !isEditingDecline && (
                                <div className="pt-2 flex flex-wrap items-center gap-3">
                                  <button
                                    type="button"
                                    disabled={isSubmittingReview}
                                    onClick={() => handleReviewArchitecture(arch.id, 'approved')}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-[#050505] text-xs font-bold hover:bg-emerald-400 transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Approve Architecture Proposal</span>
                                  </button>

                                  <button
                                    type="button"
                                    disabled={isSubmittingReview}
                                    onClick={() => setReviewingArchId(arch.id)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs font-bold transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Decline & Request Changes</span>
                                  </button>
                                </div>
                              )}

                              {/* Decline / Request Changes Form */}
                              {isPending && isEditingDecline && (
                                <div className="p-4 rounded-xl border border-red-500/40 bg-vjs-surface space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold font-mono text-red-400">
                                      Specify Required Changes / Revisions
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setReviewingArchId(null)}
                                      className="text-vjs-muted hover:text-vjs-primary text-xs"
                                    >
                                      Cancel
                                    </button>
                                  </div>

                                  <p className="text-[11px] text-vjs-secondary">
                                    Please explain what parts of this architecture or idea do not meet your expectations, and suggest the desired changes.
                                  </p>

                                  <textarea
                                    rows={3}
                                    value={declineReason[arch.id] || ''}
                                    onChange={e =>
                                      setDeclineReason(prev => ({
                                        ...prev,
                                        [arch.id]: e.target.value,
                                      }))
                                    }
                                    placeholder="Enter specific revisions, technology adjustments, or feedback..."
                                    className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary focus:outline-none focus:ring-2 focus:ring-red-400"
                                  />

                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      disabled={isSubmittingReview}
                                      onClick={() => handleReviewArchitecture(arch.id, 'declined')}
                                      className="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors"
                                    >
                                      {isSubmittingReview ? 'Submitting...' : 'Submit Change Request'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setReviewingArchId(null)}
                                      className="px-3 py-2 rounded-xl border border-vjs-subtle bg-vjs-surface text-vjs-secondary text-xs hover:text-vjs-primary"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: DIRECT DISCUSSION & CLIENT FEEDBACK STREAM */}
              {activeProjectTab === 'messages' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-vjs-subtle pb-4">
                      <div>
                        <h3 className="text-sm font-bold text-vjs-primary font-mono uppercase tracking-wider flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-[#00E5FF]" />
                          <span>Direct Conversation & Client Feedback Stream</span>
                        </h3>
                        <p className="text-xs text-vjs-secondary mt-1">
                          Direct, chronological communication channel between you and VJS TECH engineering leads.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-[#00E5FF] px-2 py-1 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 shrink-0">
                        End-to-End Isolated
                      </span>
                    </div>

                    {/* Messages Scrollable Container */}
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                      {messages.length === 0 ? (
                        <div className="p-8 text-center text-vjs-muted text-xs font-mono">
                          No direct messages recorded yet. Start the conversation below.
                        </div>
                      ) : (
                        messages.map((msg: any) => {
                          const isFromAdmin = msg.sender_role === 'admin';
                          return (
                            <div
                              key={msg.id}
                              className={`p-3.5 rounded-xl border space-y-1.5 ${
                                isFromAdmin
                                  ? 'bg-vjs-surface border-[#3B0A6B]/50 ml-0 mr-4'
                                  : 'bg-vjs-surface-elevated border-[#00E5FF]/40 ml-4 mr-0'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                      isFromAdmin
                                        ? 'bg-[#3B0A6B]/30 text-purple-300 border border-[#3B0A6B]/60'
                                        : 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                                    }`}
                                  >
                                    {isFromAdmin ? 'VJS TECH Engineering Lead' : 'You (Client)'}
                                  </span>
                                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-vjs-surface text-vjs-muted border border-vjs-subtle">
                                    {msg.message_type}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-vjs-muted">
                                  {new Date(msg.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}{' '}
                                  • {new Date(msg.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-xs text-vjs-primary leading-relaxed whitespace-pre-line">
                                {msg.content}
                              </p>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Message Submission Form */}
                    <form onSubmit={handleSendDirectMessage} className="pt-4 border-t border-vjs-subtle space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold font-mono text-vjs-primary uppercase tracking-wider">
                          Post Direct Message / Feedback to Engineering Team
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <label className="text-vjs-muted text-[11px]">Type:</label>
                          <select
                            value={directMessageType}
                            onChange={e => setDirectMessageType(e.target.value as any)}
                            className="text-xs font-mono px-2 py-1 rounded bg-vjs-surface-elevated border border-vjs-subtle text-vjs-primary focus:outline-none focus:border-[#00E5FF]"
                          >
                            <option value="message">Direct Question</option>
                            <option value="feedback">Project Feedback</option>
                            <option value="note">Sprint Note</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <textarea
                          rows={2}
                          required
                          value={directMessageText}
                          onChange={e => setDirectMessageText(e.target.value)}
                          placeholder="Type your message, sprint feedback, or inquiry to the engineering team..."
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-vjs-subtle bg-vjs-surface text-vjs-primary focus:outline-none focus:ring-2 focus:ring-[#00E5FF]"
                        />
                        <button
                          type="submit"
                          disabled={isSendingMessage || !directMessageText.trim()}
                          className="px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#33EBFF] text-[#050505] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 self-end shrink-0 disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSendingMessage ? 'Sending...' : 'Send'}</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
