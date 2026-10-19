import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  FolderKanban,
  Users,
  Activity,
  LogOut,
  CheckCircle2,
  Plus,
  RefreshCw,
  UserPlus,
  Briefcase,
  Save,
  Trash2,
  Lock,
  Building,
  Phone,
  Camera,
  Upload,
  Calendar,
  Clock,
  AlertTriangle,
  Send,
  FileText,
  Check,
  X,
  MessageSquare,
  ChevronRight,
  HelpCircle,
  ExternalLink,
  Star,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ImageLightboxModal } from '../components/ImageLightboxModal';

export const AdminPortal: React.FC = () => {
  const { user, token, logout, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'enquiries' | 'projects' | 'clients' | 'unlocks' | 'portfolio' | 'team' | 'audit'>('enquiries');

  // Enquiries state
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('all');
  const [isUpdatingEnquiry, setIsUpdatingEnquiry] = useState<string | null>(null);

  // Projects state
  const [projects, setProjects] = useState<any[]>([]);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    clientId: '',
    description: '',
    status: 'Requirements Review',
    startDate: '',
    targetEndDate: '',
  });

  // Project Collaboration Hub state (when clicking a specific project)
  const [selectedProjectForHub, setSelectedProjectForHub] = useState<string | null>(null);
  const [projectHubDetail, setProjectHubDetail] = useState<any | null>(null);
  const [hubTab, setHubTab] = useState<'overview' | 'messages' | 'architectures'>('overview');
  const [newArchitecture, setNewArchitecture] = useState({
    title: '',
    description: '',
    techSpec: '',
    diagramUrl: '',
  });
  const [hubMessageContent, setHubMessageContent] = useState('');
  const [hubMessageType, setHubMessageType] = useState<'message' | 'note' | 'feedback'>('message');

  // Clients state
  const [clients, setClients] = useState<any[]>([]);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClient, setNewClient] = useState({
    fullName: '',
    email: '',
    password: '',
    organization: '',
    phone: '',
    clientStatus: 'active' as 'active' | 'inactive' | 'finished',
  });

  // Rate Limit Unlock Requests state
  const [unlockRequests, setUnlockRequests] = useState<any[]>([]);

  // Portfolio & Services state
  const [portfolioItems, setPortfolioItems] = useState<any[]>([]);
  const [editingPortfolioId, setEditingPortfolioId] = useState<string | null>(null);
  const [portfolioDraft, setPortfolioDraft] = useState<any>({});
  const [showNewPortfolioModal, setShowNewPortfolioModal] = useState(false);
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: '',
    role: 'Full Stack Developer',
    category: 'Full-Stack Web Applications',
    completionDate: 'Completed',
    shortDesc: '',
    fullDesc: '',
    challenge: '',
    solution: '',
    architectureHighlights: '',
    results: '',
    technologies: 'Python, Flask, Chart.js, REST APIs',
    projectUrl: '',
    repoUrl: '',
    coverImage: '',
    imagesData: [] as string[],
  });

  // Audit state
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Team state
  const [team, setTeam] = useState<any[]>([]);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState<string | null>(null);
  const [isUploadingPortfolioImage, setIsUploadingPortfolioImage] = useState<string | null>(null);

  // Lightbox state for fullscreen screenshot previews
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxTitle, setLightboxTitle] = useState('');
  const [showLightbox, setShowLightbox] = useState(false);

  const openImageLightbox = (images: string[], index = 0, title = '') => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxTitle(title);
    setShowLightbox(true);
  };

  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      navigate('/portal');
      return;
    }

    loadData();
  }, [isAuthenticated, isAdmin, navigate, token, enquiryStatusFilter]);

  const loadData = async () => {
    try {
      // Load Enquiries
      const enqUrl =
        enquiryStatusFilter === 'all'
          ? '/api/enquiries'
          : `/api/enquiries?status=${enquiryStatusFilter}`;
      const enqRes = await fetch(enqUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (enqRes.ok) {
        const enqData = await enqRes.json();
        setEnquiries(enqData.enquiries || []);
      }

      // Load Projects
      const projRes = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (projRes.ok) {
        const projData = await projRes.json();
        setProjects(projData.projects || []);
      }

      // Load Clients
      const clientsRes = await fetch('/api/auth/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData.clients || []);
      }

      // Load Portfolio Projects
      const portfolioRes = await fetch('/api/portfolio');
      if (portfolioRes.ok) {
        const portData = await portfolioRes.json();
        setPortfolioItems(portData.projects || []);
      }

      // Load Team
      const teamRes = await fetch('/api/team');
      if (teamRes.ok) {
        const teamData = await teamRes.json();
        setTeam(teamData.team || []);
      }

      // Load Audit
      const auditRes = await fetch('/api/audit?limit=50', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (auditRes.ok) {
        const auditData = await auditRes.json();
        setAuditLogs(auditData.events || []);
      }

      // Load Rate Limit Unlock Requests
      const unlockRes = await fetch('/api/auth/unlock-requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (unlockRes.ok) {
        const unlockData = await unlockRes.json();
        setUnlockRequests(unlockData.requests || []);
      }
    } catch (err) {
      console.error('Error loading admin portal data:', err);
    }
  };

  const getDeadlineStatus = (targetEndDate?: string | null) => {
    if (!targetEndDate) {
      return { text: 'No delivery date configured', isNear: false, isOverdue: false, days: null };
    }
    const target = new Date(targetEndDate);
    const now = new Date();
    // Normalize to date comparison
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
        text: `Deadline Approaching: Due in ${diffDays} day${diffDays === 1 ? '' : 's'}`,
        isNear: true,
        isOverdue: false,
        days: diffDays,
      };
    }
    return {
      text: `Target: ${targetEndDate} (${diffDays} days left)`,
      isNear: false,
      isOverdue: false,
      days: diffDays,
    };
  };

  const handleUpdateEnquiryStatus = async (id: string, status: string, notes?: string) => {
    setIsUpdatingEnquiry(id);
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, adminNotes: notes }),
      });

      if (res.ok) {
        setFeedbackMessage('Enquiry status updated.');
        loadData();
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update enquiry:', err);
    } finally {
      setIsUpdatingEnquiry(null);
    }
  };

  const handleDeleteEnquiry = async (id: string, ref: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete enquiry "${ref}"?`)) return;
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFeedbackMessage(`Enquiry ${ref} deleted successfully.`);
        loadData();
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete enquiry:', err);
    }
  };

  const handleDeleteProject = async (id: string, ref: string) => {
    if (!window.confirm(`Permanently delete project "${ref}"? All associated milestones, messages, updates, and architecture proposals will also be deleted.`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFeedbackMessage(`Project ${ref} deleted.`);
        if (selectedProjectForHub === id) setSelectedProjectForHub(null);
        loadData();
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete project:', err);
    }
  };

  const handleUpdateClientStatus = async (clientId: string, status: 'active' | 'inactive' | 'finished') => {
    try {
      const res = await fetch(`/api/auth/clients/${clientId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setFeedbackMessage(`Client account provisioning set to "${status}".`);
        loadData();
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update client status:', err);
    }
  };

  const handleDeleteClient = async (clientId: string, email: string) => {
    if (!window.confirm(`Permanently delete client account "${email}"? This will also remove any assigned records.`)) return;
    try {
      const res = await fetch(`/api/auth/clients/${clientId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFeedbackMessage(`Client account "${email}" deleted.`);
        loadData();
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete client account:', err);
    }
  };

  const handleUpdateProjectDeadline = async (projectId: string, targetEndDate: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetEndDate }),
      });
      if (res.ok) {
        setFeedbackMessage(`Delivery deadline date set to ${targetEndDate}.`);
        loadData();
        if (selectedProjectForHub === projectId) {
          loadProjectHubDetail(projectId);
        }
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update delivery deadline:', err);
    }
  };

  const handleApproveUnlock = async (unlockId: string, email: string) => {
    try {
      const res = await fetch(`/api/auth/approve-unlock/${unlockId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFeedbackMessage(`Rate limit reset approved for ${email}. They can now sign in immediately!`);
        loadData();
        setTimeout(() => setFeedbackMessage(null), 4000);
      }
    } catch (err) {
      console.error('Failed to approve unlock:', err);
    }
  };

  const loadProjectHubDetail = async (projectId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjectHubDetail(data);
      }
    } catch (err) {
      console.error('Failed to load project hub detail:', err);
    }
  };

  const handleOpenProjectHub = (projectId: string) => {
    setSelectedProjectForHub(projectId);
    setHubTab('overview');
    loadProjectHubDetail(projectId);
  };

  const handlePostArchitecture = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForHub || !newArchitecture.title || !newArchitecture.description) return;
    try {
      const res = await fetch(`/api/projects/${selectedProjectForHub}/architectures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newArchitecture),
      });
      if (res.ok) {
        setFeedbackMessage('Architecture & idea proposal submitted for client review.');
        setNewArchitecture({ title: '', description: '', techSpec: '', diagramUrl: '' });
        loadProjectHubDetail(selectedProjectForHub);
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to post architecture:', err);
    }
  };

  const handlePostHubMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectForHub || !hubMessageContent.trim()) return;
    try {
      const res = await fetch(`/api/projects/${selectedProjectForHub}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: hubMessageContent.trim(), messageType: hubMessageType }),
      });
      if (res.ok) {
        setHubMessageContent('');
        loadProjectHubDetail(selectedProjectForHub);
      }
    } catch (err) {
      console.error('Failed to post message:', err);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/create-client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newClient),
      });

      const data = await res.json();
      if (res.ok) {
        setShowNewClientModal(false);
        setNewClient({
          fullName: '',
          email: '',
          password: '',
          organization: '',
          phone: '',
          clientStatus: 'active',
        });
        setFeedbackMessage(`Client account created successfully for ${data.client.email}`);
        loadData();
        setTimeout(() => setFeedbackMessage(null), 4000);
      } else {
        alert(data.error || 'Failed to create client account.');
      }
    } catch (err) {
      console.error('Failed to create client:', err);
      alert('Network error while provisioning client account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProject),
      });

      if (res.ok) {
        setShowNewProjectModal(false);
        setNewProject({
          name: '',
          clientId: '',
          description: '',
          status: 'Requirements Review',
          startDate: '',
          targetEndDate: '',
        });
        setFeedbackMessage('Project record created successfully.');
        loadData();
        setTimeout(() => setFeedbackMessage(null), 3000);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create project.');
      }
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const handleUpdateProjectStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setFeedbackMessage(`Project status updated to "${status}".`);
        loadData();
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to update project status:', err);
    }
  };

  const startEditPortfolio = (item: any) => {
    setEditingPortfolioId(item.id);
    setPortfolioDraft({
      id: item.id,
      title: item.title || '',
      role: item.role || 'Full Stack Developer',
      category: item.category || 'Full-Stack Web Applications',
      completion_date: item.completion_date || item.completionDate || 'Completed',
      short_desc: item.short_desc || item.shortDesc || '',
      full_desc: item.full_desc || item.fullDesc || '',
      challenge: item.challenge || '',
      solution: item.solution || '',
      architecture_highlights: Array.isArray(item.architecture_highlights)
        ? item.architecture_highlights.join('\n')
        : Array.isArray(item.architectureHighlights)
        ? item.architectureHighlights.join('\n')
        : (item.architecture_highlights || item.architectureHighlights || ''),
      results: item.results || '',
      technologies: Array.isArray(item.technologies)
        ? item.technologies.join(', ')
        : (item.technologies || ''),
      project_url: item.project_url || item.projectUrl || '',
      repo_url: item.repo_url || item.repoUrl || '',
      cover_image: item.cover_image || item.coverImage || '',
      gallery_images: item.gallery_images || item.galleryImages || [],
      is_published: item.is_published,
    });
  };

  const handleSavePortfolioChanges = async (id: string) => {
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: portfolioDraft.title,
          role: portfolioDraft.role,
          category: portfolioDraft.category,
          completionDate: portfolioDraft.completion_date,
          shortDesc: portfolioDraft.short_desc,
          fullDesc: portfolioDraft.full_desc,
          challenge: portfolioDraft.challenge,
          solution: portfolioDraft.solution,
          architectureHighlights: portfolioDraft.architecture_highlights,
          results: portfolioDraft.results,
          technologies: portfolioDraft.technologies,
          coverImage: portfolioDraft.cover_image,
          projectUrl: portfolioDraft.project_url,
          repoUrl: portfolioDraft.repo_url,
          isPublished: portfolioDraft.is_published,
        }),
      });

      if (res.ok) {
        setFeedbackMessage('Portfolio project changes saved successfully.');
        setEditingPortfolioId(null);
        loadData();
        setTimeout(() => setFeedbackMessage(null), 3000);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to update portfolio project.');
      }
    } catch (err) {
      console.error('Failed to update portfolio project:', err);
    }
  };

  const handleDeletePortfolio = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFeedbackMessage(`Project "${title}" deleted.`);
        loadData();
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete portfolio project:', err);
    }
  };

  const handleCreatePortfolioItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolioItem.title.trim() || !newPortfolioItem.shortDesc.trim() || !newPortfolioItem.fullDesc.trim() || !newPortfolioItem.challenge.trim() || !newPortfolioItem.solution.trim()) {
      alert('Please fill in all required fields: Title, Role, Short Description, Full Description, Challenge, and Solution.');
      return;
    }
    setIsSubmitting(true);
    try {
      const techArray = newPortfolioItem.technologies.split(',').map(s => s.trim()).filter(Boolean);
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newPortfolioItem.title.trim(),
          role: newPortfolioItem.role.trim(),
          category: newPortfolioItem.category,
          completionDate: newPortfolioItem.completionDate.trim(),
          shortDesc: newPortfolioItem.shortDesc.trim(),
          fullDesc: newPortfolioItem.fullDesc.trim(),
          challenge: newPortfolioItem.challenge.trim(),
          solution: newPortfolioItem.solution.trim(),
          architectureHighlights: newPortfolioItem.architectureHighlights,
          results: newPortfolioItem.results.trim(),
          technologies: techArray,
          projectUrl: newPortfolioItem.projectUrl.trim(),
          repoUrl: newPortfolioItem.repoUrl.trim(),
          coverImage: newPortfolioItem.coverImage && !newPortfolioItem.coverImage.startsWith('data:image/') ? newPortfolioItem.coverImage : '',
          imageData: newPortfolioItem.coverImage && newPortfolioItem.coverImage.startsWith('data:image/') ? newPortfolioItem.coverImage : undefined,
          imagesData: newPortfolioItem.imagesData.length > 0 ? newPortfolioItem.imagesData : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowNewPortfolioModal(false);
        setNewPortfolioItem({
          title: '',
          role: 'Full Stack Developer',
          category: 'Full-Stack Web Applications',
          completionDate: 'Completed',
          shortDesc: '',
          fullDesc: '',
          challenge: '',
          solution: '',
          architectureHighlights: '',
          results: '',
          technologies: 'Python, Flask, Chart.js, REST APIs',
          projectUrl: '',
          repoUrl: '',
          coverImage: '',
          imagesData: [],
        });
        setFeedbackMessage(data.message || 'New portfolio case study published successfully.');
        loadData();
        setTimeout(() => setFeedbackMessage(null), 3000);
      } else {
        alert(data.error || 'Failed to create case study.');
      }
    } catch (err) {
      console.error('Failed to create portfolio item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalFilesChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      alert('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    const readPromises = fileArray.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64List = await Promise.all(readPromises);
      setNewPortfolioItem(prev => {
        const combined = [...prev.imagesData, ...base64List];
        return {
          ...prev,
          imagesData: combined,
          coverImage: prev.coverImage || combined[0] || '',
        };
      });
    } catch (err) {
      console.error('Error reading files:', err);
    }
  };

  const handleModalRemoveImage = (indexToRemove: number) => {
    setNewPortfolioItem(prev => {
      const updated = prev.imagesData.filter((_, idx) => idx !== indexToRemove);
      const newCover = prev.coverImage === prev.imagesData[indexToRemove]
        ? (updated[0] || '')
        : prev.coverImage;
      return {
        ...prev,
        imagesData: updated,
        coverImage: newCover,
      };
    });
  };

  const handleModalSetCover = (imgData: string) => {
    setNewPortfolioItem(prev => ({
      ...prev,
      coverImage: imgData,
    }));
  };

  const handlePhotoUpload = async (memberId: string, file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFeedbackMessage('Please select a valid image file (JPG, PNG, WebP).');
      setTimeout(() => setFeedbackMessage(null), 4000);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFeedbackMessage('Selected image exceeds the 10MB file size limit.');
      setTimeout(() => setFeedbackMessage(null), 4000);
      return;
    }

    setIsUploadingPhoto(memberId);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch(`/api/team/${memberId}/photo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ photoData: base64Data }),
        });

        const data = await res.json();
        if (res.ok) {
          setFeedbackMessage(data.message || 'Photo uploaded successfully.');
          setTeam(prev =>
            prev.map(m => (m.id === memberId ? { ...m, photo_url: data.photoUrl } : m))
          );
        } else {
          setFeedbackMessage(data.error || 'Failed to upload photo.');
        }
        setIsUploadingPhoto(null);
        setTimeout(() => setFeedbackMessage(null), 4000);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Failed to upload photo:', err);
      setFeedbackMessage('An unexpected error occurred while uploading.');
      setIsUploadingPhoto(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleRemovePhoto = async (memberId: string) => {
    setIsUploadingPhoto(memberId);
    try {
      const res = await fetch(`/api/team/${memberId}/photo`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setFeedbackMessage(data.message || 'Photo removed. Initials avatar restored.');
        setTeam(prev =>
          prev.map(m => (m.id === memberId ? { ...m, photo_url: null } : m))
        );
      } else {
        setFeedbackMessage(data.error || 'Failed to remove photo.');
      }
    } catch (err) {
      console.error('Failed to remove photo:', err);
      setFeedbackMessage('An unexpected error occurred while removing photo.');
    } finally {
      setIsUploadingPhoto(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handlePortfolioImagesUpload = async (projectId: string, files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      setFeedbackMessage('Please select valid image files (JPG, PNG, WebP).');
      setTimeout(() => setFeedbackMessage(null), 4000);
      return;
    }

    for (const f of fileArray) {
      if (f.size > 10 * 1024 * 1024) {
        setFeedbackMessage(`File "${f.name}" exceeds the 10MB file size limit.`);
        setTimeout(() => setFeedbackMessage(null), 4000);
        return;
      }
    }

    setIsUploadingPortfolioImage(projectId);
    try {
      const readPromises = fileArray.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const base64List = await Promise.all(readPromises);

      const res = await fetch(`/api/portfolio/${projectId}/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imagesData: base64List }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedbackMessage(data.message || `${fileArray.length} screenshot(s) uploaded successfully.`);
        setPortfolioItems(prev =>
          prev.map(p =>
            p.id === projectId
              ? { ...p, cover_image: data.coverImage, gallery_images: data.galleryImages }
              : p
          )
        );
        if (editingPortfolioId === projectId) {
          setPortfolioDraft((prev: any) => ({
            ...prev,
            cover_image: data.coverImage,
            gallery_images: data.galleryImages,
          }));
        }
      } else {
        setFeedbackMessage(data.error || 'Failed to upload images.');
      }
    } catch (err) {
      console.error('Failed to upload images:', err);
      setFeedbackMessage('An unexpected error occurred while uploading images.');
    } finally {
      setIsUploadingPortfolioImage(null);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleSetCoverImage = async (projectId: string, imageUrl: string) => {
    try {
      const res = await fetch(`/api/portfolio/${projectId}/cover`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coverImage: imageUrl }),
      });
      if (res.ok) {
        setFeedbackMessage('Primary cover image updated.');
        setPortfolioItems(prev =>
          prev.map(p => (p.id === projectId ? { ...p, cover_image: imageUrl } : p))
        );
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to set cover image:', err);
    }
  };

  const handleDeleteGalleryImage = async (projectId: string, imageUrl: string, title: string) => {
    if (!window.confirm(`Delete this screenshot from "${title}"?`)) return;
    try {
      const res = await fetch(`/api/portfolio/${projectId}/image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imageUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbackMessage('Screenshot deleted.');
        setPortfolioItems(prev =>
          prev.map(p =>
            p.id === projectId
              ? { ...p, cover_image: data.coverImage, gallery_images: data.galleryImages }
              : p
          )
        );
        if (editingPortfolioId === projectId) {
          setPortfolioDraft((prev: any) => ({
            ...prev,
            cover_image: data.coverImage,
            gallery_images: data.galleryImages,
          }));
        }
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to delete gallery image:', err);
    }
  };

  const handleRemovePortfolioImage = async (projectId: string, title: string) => {
    if (!window.confirm(`Remove all screenshots for "${title}"?`)) return;
    setIsUploadingPortfolioImage(projectId);
    try {
      const res = await fetch(`/api/portfolio/${projectId}/image`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFeedbackMessage(`All images removed for "${title}".`);
        setPortfolioItems(prev =>
          prev.map(p => (p.id === projectId ? { ...p, cover_image: '', gallery_images: [] } : p))
        );
        if (editingPortfolioId === projectId) {
          setPortfolioDraft((prev: any) => ({ ...prev, cover_image: '', gallery_images: [] }));
        }
        setTimeout(() => setFeedbackMessage(null), 3000);
      }
    } catch (err) {
      console.error('Failed to remove image:', err);
    } finally {
      setIsUploadingPortfolioImage(null);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#3B0A6B]/30 border border-[#3B0A6B] flex items-center justify-center text-[#00E5FF]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-vjs-primary">
                VJS TECH Staff Administration
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3B0A6B]/30 text-purple-300 border border-[#3B0A6B]">
                Admin Access
              </span>
            </div>
            <div className="text-xs text-vjs-muted">
              Logged in as <strong className="text-vjs-primary">{user?.email}</strong> ({user?.fullName})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            className="p-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated hover:bg-vjs-surface-hover text-vjs-secondary hover:text-vjs-primary transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated hover:bg-vjs-surface-hover text-vjs-secondary hover:text-vjs-primary text-xs font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-vjs-subtle pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('enquiries')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'enquiries'
              ? 'bg-[#00E5FF] text-[#050505] shadow-sm'
              : 'border border-vjs-subtle bg-vjs-surface text-vjs-secondary hover:text-vjs-primary'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Enquiries ({enquiries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'projects'
              ? 'bg-[#00E5FF] text-[#050505] shadow-sm'
              : 'border border-vjs-subtle bg-vjs-surface text-vjs-secondary hover:text-vjs-primary'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Client Projects ({projects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('clients')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'clients'
              ? 'bg-[#00E5FF] text-[#050505] shadow-sm'
              : 'border border-vjs-subtle bg-vjs-surface text-vjs-secondary hover:text-vjs-primary'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Clients Directory ({clients.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('unlocks')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'unlocks'
              ? 'bg-[#00E5FF] text-[#050505] shadow-sm'
              : 'border border-vjs-subtle bg-vjs-surface text-vjs-secondary hover:text-vjs-primary'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Unlock Requests ({unlockRequests.filter(r => r.status === 'pending').length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('portfolio')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'portfolio'
              ? 'bg-[#00E5FF] text-[#050505] shadow-sm'
              : 'border border-vjs-subtle bg-vjs-surface text-vjs-secondary hover:text-vjs-primary'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Portfolio & Showcase ({portfolioItems.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('team')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'team'
              ? 'bg-[#00E5FF] text-[#050505] shadow-sm'
              : 'border border-vjs-subtle bg-vjs-surface text-vjs-secondary hover:text-vjs-primary'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team ({team.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-[#00E5FF] text-[#050505] shadow-sm'
              : 'border border-vjs-subtle bg-vjs-surface text-vjs-secondary hover:text-vjs-primary'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Audit Log ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: Enquiries Management */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-base font-bold text-vjs-primary">
              Incoming Client Project Enquiries
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-vjs-muted font-mono">Status Filter:</span>
              <select
                value={enquiryStatusFilter}
                onChange={e => setEnquiryStatusFilter(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface text-vjs-primary focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="contacted">Contacted</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {enquiries.length === 0 ? (
            <div className="p-10 rounded-2xl border border-dashed border-vjs-subtle text-center text-xs text-vjs-muted">
              No enquiries match the current filter.
            </div>
          ) : (
            <div className="space-y-4">
              {enquiries.map(enquiry => (
                <div
                  key={enquiry.id}
                  className="p-5 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 border-b border-vjs-subtle pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#00E5FF]">
                          {enquiry.reference_code}
                        </span>
                        <span className="text-xs font-mono text-vjs-muted">
                          {new Date(enquiry.created_at).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-vjs-primary mt-1">
                        {enquiry.project_title}
                      </h3>
                      <div className="text-xs text-vjs-secondary">
                        Client: <strong>{enquiry.full_name}</strong> ({enquiry.email}) • {enquiry.phone || 'No phone'} • Category: {enquiry.client_category}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        disabled={isUpdatingEnquiry === enquiry.id}
                        value={enquiry.status}
                        onChange={e => handleUpdateEnquiryStatus(enquiry.id, e.target.value)}
                        className="px-2.5 py-1 text-xs font-mono font-semibold rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="contacted">Contacted</option>
                        <option value="proposal_sent">Proposal Sent</option>
                        <option value="archived">Archived</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDeleteEnquiry(enquiry.id, enquiry.reference_code)}
                        className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-vjs-secondary leading-relaxed bg-vjs-surface-elevated p-3 rounded-xl border border-vjs-subtle">
                    {enquiry.project_description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-vjs-muted">
                    <div>
                      <span className="text-vjs-primary block">Services:</span>
                      <span>{enquiry.services.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-vjs-primary block">Budget Range:</span>
                      <span>{enquiry.budget_range || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-vjs-primary block">Timeline:</span>
                      <span>{enquiry.desired_timeline || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="text-vjs-primary block">Contact Method:</span>
                      <span>{enquiry.preferred_contact_method}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Projects Management */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-vjs-primary">Client Project Records</h2>
              <p className="text-xs text-vjs-secondary">Change project delivery status in real-time. Each project is strictly isolated to its assigned client.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewProjectModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00E5FF] text-[#050505] text-xs font-bold hover:bg-[#33EBFF] transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Project</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map(proj => {
              const deadline = getDeadlineStatus(proj.target_end_date);
              return (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#00E5FF]">
                        {proj.reference_code}
                      </span>
                      <div className="flex items-center gap-2">
                        <select
                          value={proj.status}
                          onChange={e => handleUpdateProjectStatus(proj.id, e.target.value)}
                          className="text-xs font-mono px-2 py-1 rounded-lg border border-[#00E5FF]/40 bg-vjs-surface-elevated text-vjs-primary font-bold focus:outline-none focus:ring-2 focus:ring-[#00E5FF]"
                        >
                          <option value="Requirements Review">Requirements Review</option>
                          <option value="Architecture & Prototype">Architecture & Prototype</option>
                          <option value="In Development">In Development</option>
                          <option value="Testing & Hardening">Testing & Hardening</option>
                          <option value="Delivered & Deployed">Delivered & Deployed</option>
                          <option value="On Hold">On Hold</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.id, proj.reference_code)}
                          className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete Project Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-vjs-primary">{proj.name}</h3>
                      <p className="mt-1 text-xs text-vjs-secondary line-clamp-2 leading-relaxed">{proj.description}</p>
                    </div>

                    {/* Delivery Calendar Date & Near Deadline Alert */}
                    <div className="p-3 rounded-xl bg-vjs-surface-elevated border border-vjs-subtle space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-vjs-muted flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-[#00E5FF]" />
                          <span>Delivery Deadline:</span>
                        </span>
                        <input
                          type="date"
                          value={proj.target_end_date ? proj.target_end_date.split('T')[0] : ''}
                          onChange={e => handleUpdateProjectDeadline(proj.id, e.target.value)}
                          className="px-2 py-1 rounded text-xs font-mono bg-vjs-surface border border-vjs-subtle text-vjs-primary focus:outline-none focus:border-[#00E5FF]"
                        />
                      </div>

                      {proj.target_end_date && (
                        <div
                          className={`p-2 rounded-lg text-[11px] font-mono flex items-center gap-1.5 ${
                            deadline.isOverdue
                              ? 'bg-red-500/10 text-red-400 border border-red-500/30 font-bold'
                              : deadline.isNear
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold animate-pulse'
                              : 'bg-emerald-500/5 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{deadline.text}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-vjs-subtle">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-vjs-muted">
                      <div>
                        Client: <strong className="text-vjs-primary">{proj.client_name || 'Assigned'}</strong> ({proj.client_email})
                      </div>
                      <span className="text-emerald-400">Isolated</span>
                    </div>

                    {/* Open Project Collaboration Hub */}
                    <button
                      type="button"
                      onClick={() => handleOpenProjectHub(proj.id)}
                      className="w-full py-2 px-3 rounded-xl border border-[#00E5FF]/40 bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Project Collaboration Hub (Notes, Feedback & Architecture)</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Project Collaboration Hub Modal */}
          {selectedProjectForHub && projectHubDetail && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-vjs-subtle bg-vjs-surface p-6 space-y-6 shadow-2xl">
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-vjs-subtle pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#00E5FF]">
                        {projectHubDetail.project.reference_code}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#00E5FF]/40 text-[#00E5FF]">
                        {projectHubDetail.project.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-vjs-primary mt-1">
                      {projectHubDetail.project.name}
                    </h3>
                    <div className="text-xs text-vjs-secondary font-mono mt-0.5">
                      Client: <strong>{projectHubDetail.project.client_name}</strong> ({projectHubDetail.project.client_email})
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedProjectForHub(null)}
                    className="p-1.5 rounded-lg border border-vjs-subtle hover:bg-vjs-surface-elevated text-vjs-muted hover:text-vjs-primary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sub-Tabs */}
                <div className="flex items-center gap-2 border-b border-vjs-subtle pb-3">
                  <button
                    type="button"
                    onClick={() => setHubTab('overview')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      hubTab === 'overview'
                        ? 'bg-[#00E5FF] text-[#050505]'
                        : 'border border-vjs-subtle text-vjs-secondary'
                    }`}
                  >
                    Calendar & Deadline
                  </button>
                  <button
                    type="button"
                    onClick={() => setHubTab('messages')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      hubTab === 'messages'
                        ? 'bg-[#00E5FF] text-[#050505]'
                        : 'border border-vjs-subtle text-vjs-secondary'
                    }`}
                  >
                    Client Notes & Direct Chat ({projectHubDetail.messages?.length || 0})
                  </button>
                  <button
                    type="button"
                    onClick={() => setHubTab('architectures')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      hubTab === 'architectures'
                        ? 'bg-[#00E5FF] text-[#050505]'
                        : 'border border-vjs-subtle text-vjs-secondary'
                    }`}
                  >
                    Architecture & Idea Proposals ({projectHubDetail.architectures?.length || 0})
                  </button>
                </div>

                {/* Sub-Tab 1: Overview & Calendar Deadline */}
                {hubTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated space-y-3">
                      <h4 className="text-xs font-bold font-mono text-vjs-primary uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#00E5FF]" />
                        <span>Dedicated Client Delivery Calendar</span>
                      </h4>
                      <p className="text-xs text-vjs-secondary">
                        Set and manage the committed delivery date for this specific client. Near-deadline warnings trigger automatically within 7 days.
                      </p>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                        <label className="text-xs font-mono text-vjs-muted">Scheduled Delivery Date:</label>
                        <input
                          type="date"
                          value={projectHubDetail.project.target_end_date ? projectHubDetail.project.target_end_date.split('T')[0] : ''}
                          onChange={e => handleUpdateProjectDeadline(projectHubDetail.project.id, e.target.value)}
                          className="px-3 py-1.5 rounded-lg bg-vjs-surface border border-vjs-subtle text-xs font-mono text-vjs-primary"
                        />
                      </div>

                      {projectHubDetail.project.target_end_date && (
                        <div className="pt-2">
                          {(() => {
                            const d = getDeadlineStatus(projectHubDetail.project.target_end_date);
                            return (
                              <div
                                className={`p-3 rounded-lg text-xs font-mono flex items-center gap-2 ${
                                  d.isOverdue
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/30 font-bold'
                                    : d.isNear
                                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold'
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                }`}
                              >
                                <Clock className="w-4 h-4" />
                                <span>{d.text}</span>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated space-y-2">
                      <h4 className="text-xs font-bold font-mono text-vjs-primary uppercase tracking-wider">
                        Project Scope Description
                      </h4>
                      <p className="text-xs text-vjs-secondary leading-relaxed">
                        {projectHubDetail.project.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Sub-Tab 2: Client Notes & Direct Chat */}
                {hubTab === 'messages' && (
                  <div className="space-y-4">
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {projectHubDetail.messages && projectHubDetail.messages.length > 0 ? (
                        projectHubDetail.messages.map((m: any) => {
                          const isAdminSender = m.sender_role === 'admin';
                          return (
                            <div
                              key={m.id}
                              className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                                isAdminSender
                                  ? 'border-[#00E5FF]/30 bg-[#00E5FF]/5 ml-6'
                                  : 'border-purple-500/30 bg-purple-500/5 mr-6'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px] font-mono">
                                <span className={isAdminSender ? 'text-[#00E5FF] font-bold' : 'text-purple-300 font-bold'}>
                                  {m.sender_name} ({isAdminSender ? 'VJS Staff' : 'Client'})
                                </span>
                                <span className="text-vjs-muted">
                                  {new Date(m.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-vjs-primary leading-relaxed whitespace-pre-line">
                                {m.content}
                              </p>
                              {m.message_type !== 'message' && (
                                <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-vjs-surface border border-vjs-subtle text-vjs-muted">
                                  Type: {m.message_type}
                                </span>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center text-xs text-vjs-muted font-mono border border-dashed border-vjs-subtle rounded-xl">
                          No direct messages or notes recorded yet. Send a note below to start the direct conversion.
                        </div>
                      )}
                    </div>

                    {/* Send Message Form */}
                    <form onSubmit={handlePostHubMessage} className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold font-mono text-vjs-primary uppercase tracking-wider">
                          Send Message / Client Note
                        </label>
                        <select
                          value={hubMessageType}
                          onChange={e => setHubMessageType(e.target.value as any)}
                          className="px-2 py-1 rounded text-xs font-mono bg-vjs-surface border border-vjs-subtle text-vjs-secondary"
                        >
                          <option value="message">Direct Message</option>
                          <option value="note">Internal Sprint Note</option>
                          <option value="feedback">Deliverable Feedback</option>
                        </select>
                      </div>
                      <textarea
                        rows={3}
                        required
                        value={hubMessageContent}
                        onChange={e => setHubMessageContent(e.target.value)}
                        placeholder="Write a direct note, architecture comment, or update for this client..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface text-vjs-primary focus:outline-none focus:border-[#00E5FF]"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs hover:bg-[#33EBFF] transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send to Client</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* Sub-Tab 3: Architecture & Idea Proposals */}
                {hubTab === 'architectures' && (
                  <div className="space-y-6">
                    {/* Proposal Form */}
                    <form onSubmit={handlePostArchitecture} className="p-4 rounded-xl border border-vjs-subtle bg-vjs-surface-elevated space-y-3">
                      <h4 className="text-xs font-bold font-mono text-vjs-primary uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#00E5FF]" />
                        <span>Post Idea or Architecture for Client Approval</span>
                      </h4>
                      <p className="text-xs text-vjs-secondary">
                        When you post an architecture or idea proposal, the client must review it in their portal and either Approve it or Decline it with feedback.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-vjs-primary mb-1">Architecture Title *</label>
                          <input
                            type="text"
                            required
                            value={newArchitecture.title}
                            onChange={e => setNewArchitecture({ ...newArchitecture, title: e.target.value })}
                            placeholder="e.g. Microservices & Real-Time Sync Architecture"
                            className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface text-vjs-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-vjs-primary mb-1">Tech Stack Spec</label>
                          <input
                            type="text"
                            value={newArchitecture.techSpec}
                            onChange={e => setNewArchitecture({ ...newArchitecture, techSpec: e.target.value })}
                            placeholder="e.g. Node.js, Redis, PostgreSQL, Docker"
                            className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface text-vjs-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-vjs-primary mb-1">Architecture / Idea Description *</label>
                        <textarea
                          rows={3}
                          required
                          value={newArchitecture.description}
                          onChange={e => setNewArchitecture({ ...newArchitecture, description: e.target.value })}
                          placeholder="Provide the architectural decisions, design components, API flow, and delivery strategy..."
                          className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface text-vjs-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-vjs-primary mb-1">Architecture Diagram / Prototype URL</label>
                        <input
                          type="url"
                          value={newArchitecture.diagramUrl}
                          onChange={e => setNewArchitecture({ ...newArchitecture, diagramUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface text-vjs-primary"
                        />
                      </div>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs hover:bg-[#33EBFF] transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Architecture Proposal to Client</span>
                      </button>
                    </form>

                    {/* Proposals List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold font-mono text-vjs-primary uppercase tracking-wider">
                        Submitted Architecture Proposals ({projectHubDetail.architectures?.length || 0})
                      </h4>

                      {projectHubDetail.architectures && projectHubDetail.architectures.length > 0 ? (
                        projectHubDetail.architectures.map((arch: any) => {
                          const isApproved = arch.status === 'approved';
                          const isDeclined = arch.status === 'declined';
                          return (
                            <div
                              key={arch.id}
                              className={`p-4 rounded-xl border space-y-2 ${
                                isApproved
                                  ? 'border-emerald-500/40 bg-emerald-500/5'
                                  : isDeclined
                                  ? 'border-red-500/40 bg-red-500/5'
                                  : 'border-[#00E5FF]/40 bg-[#00E5FF]/5'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <h5 className="text-sm font-bold text-vjs-primary">{arch.title}</h5>
                                <span
                                  className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-bold ${
                                    isApproved
                                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                      : isDeclined
                                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  }`}
                                >
                                  {arch.status}
                                </span>
                              </div>

                              <p className="text-xs text-vjs-secondary leading-relaxed">
                                {arch.description}
                              </p>

                              {arch.tech_spec && (
                                <div className="text-xs font-mono text-[#00E5FF]">
                                  Spec: {arch.tech_spec}
                                </div>
                              )}

                              {arch.diagram_url && (
                                <div>
                                  <a
                                    href={arch.diagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-[#00E5FF] hover:underline inline-flex items-center gap-1 font-mono"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>View Diagram / Reference</span>
                                  </a>
                                </div>
                              )}

                              {/* If client declined, show client feedback */}
                              {isDeclined && arch.client_feedback && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300 space-y-1">
                                  <div className="font-bold flex items-center gap-1.5">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    <span>Client Feedback & Requested Changes:</span>
                                  </div>
                                  <p className="pl-5">{arch.client_feedback}</p>
                                </div>
                              )}

                              {isApproved && (
                                <div className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Client Approved Architecture on {new Date(arch.reviewed_at || arch.created_at).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-vjs-muted font-mono">No architecture proposals submitted yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* New Project Modal */}
          {showNewProjectModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-vjs-subtle pb-3">
                  <h3 className="text-base font-bold text-vjs-primary">Create New Project</h3>
                  <button
                    type="button"
                    onClick={() => setShowNewProjectModal(false)}
                    className="text-xs text-vjs-muted hover:text-vjs-primary font-mono"
                  >
                    Cancel
                  </button>
                </div>
                <form onSubmit={handleCreateProject} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-vjs-primary mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProject.name}
                      onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="e.g. Energy Analytics Platform"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-vjs-primary">
                        Assign to Client Account *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowNewProjectModal(false);
                          setShowNewClientModal(true);
                        }}
                        className="text-[11px] text-[#00E5FF] hover:underline"
                      >
                        + Provision new client
                      </button>
                    </div>
                    <select
                      required
                      value={newProject.clientId}
                      onChange={e => setNewProject({ ...newProject, clientId: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                    >
                      <option value="">-- Select Client from Directory --</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.full_name} ({c.email}) {c.organization ? `— ${c.organization}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-vjs-primary mb-1">
                      Initial Status
                    </label>
                    <select
                      value={newProject.status}
                      onChange={e => setNewProject({ ...newProject, status: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                    >
                      <option value="Requirements Review">Requirements Review</option>
                      <option value="Architecture & Prototype">Architecture & Prototype</option>
                      <option value="In Development">In Development</option>
                      <option value="Testing & Hardening">Testing & Hardening</option>
                      <option value="Delivered & Deployed">Delivered & Deployed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-vjs-primary mb-1">
                      Description *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newProject.description}
                      onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                      placeholder="Project scope and architecture summary..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs hover:bg-[#33EBFF] transition-colors"
                    >
                      Create Project Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Clients Directory & Provisioning */}
      {activeTab === 'clients' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-vjs-primary">Client Account Provisioning</h2>
              <p className="text-xs text-vjs-secondary">Only administrators can create a login ID and password for clients. Each client has a strictly isolated dashboard.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewClientModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00E5FF] text-[#050505] text-xs font-bold hover:bg-[#33EBFF] transition-colors self-start sm:self-auto"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Provision Client Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
              <div
                key={client.id}
                className="p-5 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-vjs-muted">ID: {client.id.slice(0, 8)}...</span>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={client.client_status || 'active'}
                        onChange={e => handleUpdateClientStatus(client.id, e.target.value as any)}
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border focus:outline-none ${
                          client.client_status === 'inactive'
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : client.client_status === 'finished'
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="finished">Finished</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDeleteClient(client.id, client.email)}
                        className="p-1 rounded-md border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete Client Account"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-vjs-primary">{client.full_name}</h3>
                    <div className="text-xs text-vjs-secondary flex items-center gap-1.5 mt-1 font-mono">
                      <Mail className="w-3.5 h-3.5 text-[#00E5FF]" />
                      <span>{client.email}</span>
                    </div>
                    {client.organization && (
                      <div className="text-xs text-vjs-muted flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-vjs-muted" />
                        <span>{client.organization}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="text-xs text-vjs-muted flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-vjs-muted" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-vjs-subtle flex items-center justify-between text-[11px] font-mono text-vjs-muted">
                  <span>Registered: {new Date(client.created_at).toLocaleDateString()}</span>
                  <span className="text-[#00E5FF]">Strict Isolation</span>
                </div>
              </div>
            ))}
          </div>

          {/* New Client Modal */}
          {showNewClientModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-lg p-6 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-vjs-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-[#00E5FF]" />
                    <h3 className="text-base font-bold text-vjs-primary">Provision New Client Account</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewClientModal(false)}
                    className="text-xs text-vjs-muted hover:text-vjs-primary font-mono"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleCreateClient} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-vjs-primary mb-1">
                      Client Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newClient.fullName}
                      onChange={e => setNewClient({ ...newClient, fullName: e.target.value })}
                      placeholder="e.g. Anand Sundaram"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-vjs-primary mb-1">
                      Client Email Address (Login ID) *
                    </label>
                    <input
                      type="email"
                      required
                      value={newClient.email}
                      onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                      placeholder="client@company.com"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-vjs-primary mb-1">
                      Initial Account Password (Min 8 characters) *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-vjs-muted absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        minLength={8}
                        value={newClient.password}
                        onChange={e => setNewClient({ ...newClient, password: e.target.value })}
                        placeholder="SecureClientPass@2026"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-vjs-muted">You will provide this password to the client securely.</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-vjs-primary mb-1">
                        Organization / Company
                      </label>
                      <input
                        type="text"
                        value={newClient.organization}
                        onChange={e => setNewClient({ ...newClient, organization: e.target.value })}
                        placeholder="Acme Industrial Ltd"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-vjs-primary mb-1">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="text"
                        value={newClient.phone}
                        onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-vjs-primary mb-1">
                      Initial Client Provisioning Status
                    </label>
                    <select
                      value={newClient.clientStatus}
                      onChange={e => setNewClient({ ...newClient, clientStatus: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                    >
                      <option value="active">Active Client</option>
                      <option value="inactive">Inactive Client</option>
                      <option value="finished">Finished Engagement</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl bg-[#00E5FF] text-[#050505] font-bold text-xs hover:bg-[#33EBFF] transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Provisioning Account...' : 'Provision Client Credentials'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Rate Limit Unlock Requests */}
      {activeTab === 'unlocks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-vjs-primary">Rate Limit Reset Requests</h2>
              <p className="text-xs text-vjs-secondary">
                When clients hit the security login rate limit, they submit an unlock request. Approving their request removes the limit immediately so they can log in.
              </p>
            </div>
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated hover:bg-vjs-surface-hover text-xs font-medium text-vjs-primary"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Requests</span>
            </button>
          </div>

          {unlockRequests.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-vjs-subtle bg-vjs-surface text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-sm font-bold text-vjs-primary">No Pending Unlock Requests</div>
              <p className="text-xs text-vjs-muted">All client accounts and login connections are operating normally.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {unlockRequests.map(item => {
                const isPending = item.status === 'pending';
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isPending ? 'border-amber-500/40 bg-amber-500/5 shadow-md' : 'border-vjs-subtle bg-vjs-surface opacity-75'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-[#00E5FF]" />
                        <span className="text-xs font-mono font-bold text-vjs-primary">{item.email}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                            isPending
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold animate-pulse'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-vjs-muted">
                        Client IP: {item.ip_address || 'Unspecified'} • Requested: {new Date(item.created_at).toLocaleString()}
                      </div>
                      {item.reason && (
                        <div className="text-xs text-vjs-secondary">Reason: {item.reason}</div>
                      )}
                    </div>

                    <div>
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => handleApproveUnlock(item.id, item.email)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050505] font-bold text-xs transition-colors shadow"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve Rate Limit (Allow Immediate Sign In)</span>
                        </button>
                      ) : (
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Reset Approved {item.resolved_at ? new Date(item.resolved_at).toLocaleTimeString() : ''}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Portfolio & Services Management */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-vjs-primary">Portfolio & Services Showcase</h2>
              <p className="text-xs text-vjs-secondary">Add project screenshots, update live website preview links, GitHub repositories, or add new services.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewPortfolioModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#00E5FF] text-[#050505] text-xs font-bold hover:bg-[#33EBFF] transition-colors self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Showcase Case Study</span>
            </button>
          </div>

          <div className="space-y-4">
            {portfolioItems.map(item => (
              <div
                key={item.id}
                className="p-5 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-vjs-subtle pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-vjs-primary">{item.title}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#3B0A6B]/30 text-purple-300 border border-[#3B0A6B]/50">
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${item.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                      {item.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingPortfolioId === item.id ? (
                      <button
                        type="button"
                        onClick={() => handleSavePortfolioChanges(item.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E5FF] text-[#050505] text-xs font-bold hover:bg-[#33EBFF] transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Changes</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startEditPortfolio(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated hover:bg-vjs-surface-hover text-xs font-medium text-vjs-primary transition-colors"
                      >
                        <span>Edit Details & Links</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeletePortfolio(item.id, item.title)}
                      className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                      title="Delete case study"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {editingPortfolioId === item.id ? (
                  <div className="space-y-4 pt-2 border-t border-vjs-subtle">
                    {/* Row 1: Core Meta */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-vjs-primary mb-1">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          value={portfolioDraft.title}
                          onChange={e => setPortfolioDraft({ ...portfolioDraft, title: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-vjs-primary mb-1">
                          Role *
                        </label>
                        <input
                          type="text"
                          value={portfolioDraft.role}
                          onChange={e => setPortfolioDraft({ ...portfolioDraft, role: e.target.value })}
                          placeholder="e.g. Full Stack Developer"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-vjs-primary mb-1">
                          Category *
                        </label>
                        <select
                          value={portfolioDraft.category}
                          onChange={e => setPortfolioDraft({ ...portfolioDraft, category: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                        >
                          <option value="Full-Stack Web Applications">Full-Stack Web Applications</option>
                          <option value="AI & Data Analytics">AI & Data Analytics</option>
                          <option value="Cybersecurity & Machine Learning">Cybersecurity & Machine Learning</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-vjs-primary mb-1">
                          Delivery Status / Date
                        </label>
                        <input
                          type="text"
                          value={portfolioDraft.completion_date}
                          onChange={e => setPortfolioDraft({ ...portfolioDraft, completion_date: e.target.value })}
                          placeholder="Completed / Delivered"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                        />
                      </div>
                    </div>

                    {/* Row 2: Short Description to Display */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-medium text-vjs-primary">
                          Short Description to Display * (Shown on cards & Home preview)
                        </label>
                        <span className="text-[10px] font-mono text-vjs-muted">2-3 sentences</span>
                      </div>
                      <textarea
                        rows={2}
                        value={portfolioDraft.short_desc}
                        onChange={e => setPortfolioDraft({ ...portfolioDraft, short_desc: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary leading-relaxed"
                      />
                    </div>

                    {/* Row 3: Full Case Study Description */}
                    <div>
                      <label className="block text-xs font-medium text-vjs-primary mb-1">
                        Full Case Study Description * (Detailed system overview)
                      </label>
                      <textarea
                        rows={3}
                        value={portfolioDraft.full_desc}
                        onChange={e => setPortfolioDraft({ ...portfolioDraft, full_desc: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary leading-relaxed"
                      />
                    </div>

                    {/* Row 4: 01 Problem & 02 Solution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-red-400 mb-1">
                          01 • The Problem & Constraints *
                        </label>
                        <textarea
                          rows={3}
                          value={portfolioDraft.challenge}
                          onChange={e => setPortfolioDraft({ ...portfolioDraft, challenge: e.target.value })}
                          placeholder="Specific operational challenges, scale, security constraints..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#00E5FF] mb-1">
                          02 • Engineered Solution *
                        </label>
                        <textarea
                          rows={3}
                          value={portfolioDraft.solution}
                          onChange={e => setPortfolioDraft({ ...portfolioDraft, solution: e.target.value })}
                          placeholder="Modular backend, architecture, database schemas, integrations..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                        />
                      </div>
                    </div>

                    {/* Row 5: Key Architectural Highlights & Verified Results */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-vjs-primary">
                            Key Architectural Highlights *
                          </label>
                          <span className="text-[10px] font-mono text-vjs-muted">1 highlight per line</span>
                        </div>
                        <textarea
                          rows={3}
                          value={portfolioDraft.architecture_highlights}
                          onChange={e => setPortfolioDraft({ ...portfolioDraft, architecture_highlights: e.target.value })}
                          placeholder="Rule-based recommendation engine&#10;Gamification subsystem tracking XP&#10;Server-side PDF certificate compilation"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-vjs-primary mb-1">
                          Verified Result / Measured Technical Outcome *
                        </label>
                        <textarea
                          rows={3}
                          value={portfolioDraft.results}
                          onChange={e => setPortfolioDraft({ ...portfolioDraft, results: e.target.value })}
                          placeholder="Delivered gamified XP, automated PDF certificates, and admin analytics..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                        />
                      </div>
                    </div>

                    {/* Row 6: Technologies, GitHub Repo, Live Preview URL */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-vjs-primary mb-1">
                          Technologies (comma separated)
                        </label>
                        <input
                          type="text"
                          value={portfolioDraft.technologies}
                          onChange={e => setPortfolioDraft({ ...portfolioDraft, technologies: e.target.value })}
                          placeholder="Python, Flask, Chart.js"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-vjs-primary mb-1">
                          GitHub Repository URL
                        </label>
                        <input
                          type="url"
                          value={portfolioDraft.repo_url}
                          onChange={e => setPortfolioDraft({ ...portfolioDraft, repo_url: e.target.value })}
                          placeholder="https://github.com/vettri22/..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-vjs-primary mb-1">
                          Live Website Preview URL
                        </label>
                        <input
                          type="url"
                          value={portfolioDraft.project_url}
                          onChange={e => setPortfolioDraft({ ...portfolioDraft, project_url: e.target.value })}
                          placeholder="https://... (Leave empty if pending)"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                        />
                      </div>
                    </div>

                    {/* Action buttons inside edit panel */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-vjs-subtle">
                      <button
                        type="button"
                        onClick={() => setEditingPortfolioId(null)}
                        className="px-3.5 py-1.5 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-secondary hover:text-vjs-primary text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSavePortfolioChanges(item.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#00E5FF] text-[#050505] text-xs font-bold hover:bg-[#33EBFF] transition-colors shadow-sm"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Case Study Changes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <p className="text-vjs-secondary leading-relaxed">{item.short_desc}</p>

                    {/* Direct Image Upload & Screenshot Gallery Bar (Like Team Photos) */}
                    <div className="p-4 rounded-xl bg-vjs-surface-elevated border border-vjs-subtle space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-vjs-subtle pb-2.5">
                        <div className="flex items-center gap-2">
                          <Camera className="w-4 h-4 text-[#00E5FF]" />
                          <span className="text-xs font-bold text-vjs-primary font-mono uppercase tracking-wider">
                            Project Screenshots Gallery ({(item.gallery_images || (item.cover_image ? [item.cover_image] : [])).length})
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Hidden Native File Input with multiple attribute */}
                          <input
                            type="file"
                            multiple
                            id={`portfolio-multi-photo-file-${item.id}`}
                            accept="image/png, image/jpeg, image/webp"
                            className="hidden"
                            onChange={e => {
                              if (e.target.files && e.target.files.length > 0) {
                                handlePortfolioImagesUpload(item.id, e.target.files);
                                e.target.value = '';
                              }
                            }}
                          />

                          {/* Styled Upload Button */}
                          <label
                            htmlFor={`portfolio-multi-photo-file-${item.id}`}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                              isUploadingPortfolioImage === item.id
                                ? 'bg-vjs-surface text-vjs-muted cursor-wait'
                                : 'bg-[#00E5FF] text-[#050505] hover:bg-[#33EBFF] shadow-sm'
                            }`}
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>
                              {isUploadingPortfolioImage === item.id
                                ? 'Uploading...'
                                : 'Upload Screenshots'}
                            </span>
                          </label>

                          {(item.gallery_images?.length > 0 || item.cover_image) && (
                            <button
                              type="button"
                              onClick={() => handleRemovePortfolioImage(item.id, item.title)}
                              className="p-1.5 rounded-lg border border-vjs-subtle bg-vjs-surface hover:bg-red-500/10 text-vjs-muted hover:text-red-400 text-xs transition-colors"
                              title="Clear all screenshots"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Thumbnails Gallery Strip */}
                      {(() => {
                        const gallery = item.gallery_images && item.gallery_images.length > 0
                          ? item.gallery_images
                          : item.cover_image
                          ? [item.cover_image]
                          : [];

                        if (gallery.length === 0) {
                          return (
                            <div className="p-4 rounded-lg border border-dashed border-vjs-subtle bg-vjs-surface text-center text-vjs-muted text-xs font-mono">
                              No screenshots uploaded yet. Click "Upload Screenshots" to select multiple images from your computer.
                            </div>
                          );
                        }

                        return (
                          <div className="flex flex-wrap items-center gap-3 pt-1">
                            {gallery.map((imgUrl: string, idx: number) => {
                              const isCover = imgUrl === item.cover_image;
                              return (
                                <div
                                  key={`${imgUrl}-${idx}`}
                                  className={`relative group rounded-xl overflow-hidden border transition-all ${
                                    isCover
                                      ? 'border-[#00E5FF] ring-2 ring-[#00E5FF]/40 bg-vjs-surface'
                                      : 'border-vjs-subtle bg-vjs-surface hover:border-vjs-strong'
                                  }`}
                                >
                                  {/* Thumbnail Image (Click to view fullscreen) */}
                                  <div
                                    className="w-32 h-20 overflow-hidden cursor-pointer relative"
                                    onClick={() => openImageLightbox(gallery, idx, item.title)}
                                    title="Click to preview in full screen"
                                  >
                                    <img
                                      src={imgUrl}
                                      alt={`${item.title} screenshot ${idx + 1}`}
                                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    {/* Fullscreen hover overlay icon */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Eye className="w-5 h-5 text-white drop-shadow" />
                                    </div>
                                  </div>

                                  {/* Cover Badge or Set as Cover Button */}
                                  <div className="p-1.5 bg-vjs-surface-elevated border-t border-vjs-subtle flex items-center justify-between gap-1 text-[10px] font-mono">
                                    {isCover ? (
                                      <span className="text-[#00E5FF] font-bold flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>Cover</span>
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleSetCoverImage(item.id, imgUrl)}
                                        className="text-vjs-muted hover:text-[#00E5FF] transition-colors"
                                        title="Set as primary cover image"
                                      >
                                        Set Cover
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteGalleryImage(item.id, imgUrl, item.title)}
                                      className="text-vjs-muted hover:text-red-400 p-0.5 rounded transition-colors"
                                      title="Delete screenshot"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-vjs-muted pt-2 border-t border-vjs-subtle">
                      <div>
                        <span className="text-vjs-primary">GitHub: </span>
                        <a href={item.repo_url} target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] hover:underline">
                          {item.repo_url || 'None'}
                        </a>
                      </div>
                      <div>
                        <span className="text-vjs-primary">Preview Link: </span>
                        {item.project_url ? (
                          <a href={item.project_url} target="_blank" rel="noopener noreferrer" className="text-[#00E5FF] hover:underline">
                            {item.project_url}
                          </a>
                        ) : (
                          <span className="text-vjs-muted italic">Empty (Preview Pending)</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* New Showcase Modal */}
          {showNewPortfolioModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
              <div className="w-full max-w-3xl my-auto p-6 sm:p-8 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
                <div className="flex items-start justify-between border-b border-vjs-subtle pb-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[11px] font-mono text-[#00E5FF] mb-1.5">
                      <Briefcase className="w-3 h-3" />
                      <span>Portfolio Case Study</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-vjs-primary">Add Showcase Case Study</h3>
                    <p className="text-xs text-vjs-secondary mt-0.5">
                      Fill in the complete engineering specifications matching our genuine case-study architecture.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewPortfolioModal(false)}
                    className="p-1.5 rounded-lg border border-vjs-subtle bg-vjs-surface hover:bg-vjs-surface-elevated text-vjs-muted hover:text-vjs-primary text-xs"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreatePortfolioItem} className="space-y-6 text-xs">
                  {/* Section 1: Identity & Meta */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                      1 • Identity & Role
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block font-medium text-vjs-primary mb-1">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={newPortfolioItem.title}
                          onChange={e => setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })}
                          placeholder="e.g. DevBites"
                          className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-vjs-primary mb-1">
                          Role *
                        </label>
                        <input
                          type="text"
                          required
                          value={newPortfolioItem.role}
                          onChange={e => setNewPortfolioItem({ ...newPortfolioItem, role: e.target.value })}
                          placeholder="e.g. Full Stack Developer"
                          className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-vjs-primary mb-1">
                          Delivery Status
                        </label>
                        <input
                          type="text"
                          value={newPortfolioItem.completionDate}
                          onChange={e => setNewPortfolioItem({ ...newPortfolioItem, completionDate: e.target.value })}
                          placeholder="Completed / Delivered"
                          className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-vjs-primary mb-1">
                        Category *
                      </label>
                      <select
                        value={newPortfolioItem.category}
                        onChange={e => setNewPortfolioItem({ ...newPortfolioItem, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                      >
                        <option value="Full-Stack Web Applications">Full-Stack Web Applications</option>
                        <option value="AI & Data Analytics">AI & Data Analytics</option>
                        <option value="Cybersecurity & Machine Learning">Cybersecurity & Machine Learning</option>
                      </select>
                    </div>
                  </div>

                  {/* Section 2: Descriptions */}
                  <div className="space-y-3 pt-3 border-t border-vjs-subtle">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                      2 • Project Descriptions
                    </h4>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block font-medium text-vjs-primary">
                          Short Description to Display * (Shown on cards & Home preview)
                        </label>
                        <span className="text-[10px] font-mono text-vjs-muted">2-3 sentences</span>
                      </div>
                      <textarea
                        rows={2}
                        required
                        value={newPortfolioItem.shortDesc}
                        onChange={e => setNewPortfolioItem({ ...newPortfolioItem, shortDesc: e.target.value })}
                        placeholder="A full-stack application for bite-sized developer learning and interactive quizzes, with XP and streak-based gamification..."
                        className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-vjs-primary mb-1">
                        Full Case Study Description * (Detailed system overview on case study page)
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={newPortfolioItem.fullDesc}
                        onChange={e => setNewPortfolioItem({ ...newPortfolioItem, fullDesc: e.target.value })}
                        placeholder="DevBites is a full-stack educational web application designed for developer micro-learning and interactive quizzes..."
                        className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Section 3: Deep Technical Architecture */}
                  <div className="space-y-3 pt-3 border-t border-vjs-subtle">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                      3 • Technical Architecture Deep-Dive
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-medium text-red-400 mb-1">
                          01 • The Problem & Constraints *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={newPortfolioItem.challenge}
                          onChange={e => setNewPortfolioItem({ ...newPortfolioItem, challenge: e.target.value })}
                          placeholder="Designing an engaging developer micro-learning environment that balances fast interactive quizzes with streak gamification..."
                          className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-[#00E5FF] mb-1">
                          02 • Engineered Solution *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={newPortfolioItem.solution}
                          onChange={e => setNewPortfolioItem({ ...newPortfolioItem, solution: e.target.value })}
                          placeholder="Architected a modular Python Flask backend with rule-based topic recommendation algorithms, Chart.js learning curve visualization..."
                          className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block font-medium text-vjs-primary">
                            Key Architectural Highlights *
                          </label>
                          <span className="text-[10px] font-mono text-vjs-muted">1 highlight per line</span>
                        </div>
                        <textarea
                          rows={4}
                          value={newPortfolioItem.architectureHighlights}
                          onChange={e => setNewPortfolioItem({ ...newPortfolioItem, architectureHighlights: e.target.value })}
                          placeholder="Rule-based recommendation engine tailoring quizzes to individual progression&#10;Gamification subsystem tracking XP, levels, and consecutive day streaks&#10;Automated server-side PDF certificate generation and verification pipeline&#10;Interactive Chart.js analytics dashboard for administrative oversight"
                          className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-vjs-primary mb-1">
                          Verified Result / Measured Technical Outcome *
                        </label>
                        <textarea
                          rows={4}
                          value={newPortfolioItem.results}
                          onChange={e => setNewPortfolioItem({ ...newPortfolioItem, results: e.target.value })}
                          placeholder="Delivered gamified XP and streak mechanics, automated on-demand PDF certificate generation, and an administrative analytics portal."
                          className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Tech Stack & Links */}
                  <div className="space-y-3 pt-3 border-t border-vjs-subtle">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                      4 • Technologies & Links
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-medium text-vjs-primary mb-1">
                          Technologies (comma separated) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newPortfolioItem.technologies}
                          onChange={e => setNewPortfolioItem({ ...newPortfolioItem, technologies: e.target.value })}
                          placeholder="Python, Flask, Chart.js, PDF Generation"
                          className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-vjs-primary mb-1">
                          GitHub Repository URL
                        </label>
                        <input
                          type="url"
                          value={newPortfolioItem.repoUrl}
                          onChange={e => setNewPortfolioItem({ ...newPortfolioItem, repoUrl: e.target.value })}
                          placeholder="https://github.com/vettri22/devbites"
                          className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-medium text-vjs-primary mb-1">
                          Website Preview URL
                        </label>
                        <input
                          type="url"
                          value={newPortfolioItem.projectUrl}
                          onChange={e => setNewPortfolioItem({ ...newPortfolioItem, projectUrl: e.target.value })}
                          placeholder="https://... (Leave empty for Preview Pending)"
                          className="w-full px-3 py-2 rounded-lg border border-vjs-subtle bg-vjs-surface-elevated text-vjs-primary font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Direct Multiple Screenshot Upload */}
                  <div className="space-y-3 pt-3 border-t border-vjs-subtle">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-[#00E5FF] font-bold">
                        5 • Project Screenshots ({newPortfolioItem.imagesData.length})
                      </h4>
                      <span className="text-[10px] text-vjs-muted">
                        Select multiple images from computer (JPG, PNG, WebP)
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-dashed border-vjs-subtle bg-vjs-surface-elevated text-center space-y-2">
                      <input
                        type="file"
                        multiple
                        id="new-portfolio-multi-file-input"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={e => {
                          handleModalFilesChange(e.target.files);
                          e.target.value = '';
                        }}
                        className="hidden"
                      />
                      <label
                        htmlFor="new-portfolio-multi-file-input"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E5FF] text-[#050505] font-bold cursor-pointer hover:bg-[#33EBFF] transition-colors shadow-sm"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Select Screenshots from Computer</span>
                      </label>
                      <p className="text-[11px] text-vjs-muted font-mono">
                        You can select multiple files at once. The first will be default cover, or choose any below.
                      </p>
                    </div>

                    {/* Previews strip */}
                    {newPortfolioItem.imagesData.length > 0 && (
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        {newPortfolioItem.imagesData.map((imgData, idx) => {
                          const isCover = (newPortfolioItem.coverImage === imgData) || (!newPortfolioItem.coverImage && idx === 0);
                          return (
                            <div
                              key={idx}
                              className={`relative group rounded-xl overflow-hidden border transition-all ${
                                isCover
                                  ? 'border-[#00E5FF] ring-2 ring-[#00E5FF]/40 bg-vjs-surface'
                                  : 'border-vjs-subtle bg-vjs-surface hover:border-vjs-strong'
                              }`}
                            >
                              <div className="w-28 h-18 overflow-hidden relative">
                                <img
                                  src={imgData}
                                  alt={`Preview ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-1.5 bg-vjs-surface-elevated border-t border-vjs-subtle flex items-center justify-between gap-1 text-[10px] font-mono">
                                {isCover ? (
                                  <span className="text-[#00E5FF] font-bold flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-current" />
                                    <span>Cover</span>
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleModalSetCover(imgData)}
                                    className="text-vjs-muted hover:text-[#00E5FF] transition-colors"
                                  >
                                    Set Cover
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleModalRemoveImage(idx)}
                                  className="text-vjs-muted hover:text-red-400 p-0.5 rounded transition-colors"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-vjs-subtle flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewPortfolioModal(false)}
                      className="px-4 py-2.5 rounded-xl border border-vjs-subtle bg-vjs-surface hover:bg-vjs-surface-elevated text-vjs-secondary hover:text-vjs-primary font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#33EBFF] text-[#050505] font-bold tracking-wide shadow-lg transition-all disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isSubmitting ? 'Publishing Case Study...' : 'Publish Case Study to Portfolio'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Team Management & Photo Uploads */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-vjs-subtle bg-vjs-surface">
            <div>
              <h2 className="text-base font-bold text-vjs-primary">Official 5 Team Members</h2>
              <p className="text-xs text-vjs-secondary mt-1">
                Upload and manage real photos for each team member. Photos are updated live across the public website.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#00E5FF]/30 bg-[#00E5FF]/10 text-xs font-mono text-[#00E5FF] shrink-0">
              <Camera className="w-3.5 h-3.5" />
              <span>{team.filter(m => m.photo_url).length} / {team.length} Photos Configured</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map(member => (
              <div
                key={member.id}
                className="p-5 rounded-2xl border border-vjs-subtle bg-vjs-surface space-y-4 flex flex-col justify-between hover:border-[#00E5FF]/30 transition-all shadow-sm"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3.5">
                    {/* Member Photo Avatar or Initials Fallback */}
                    {member.photo_url ? (
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#00E5FF]/60 shadow-md bg-vjs-surface-elevated shrink-0">
                        <img
                          src={member.photo_url}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B0A6B] to-[#0B0B0E] border border-[#3B0A6B]/60 text-[#00E5FF] font-mono font-bold flex items-center justify-center text-base shadow-md shrink-0">
                        {member.avatar_initials}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-vjs-primary truncate">{member.name}</h3>
                      <div className="text-xs text-[#00E5FF] font-mono truncate">{member.role}</div>
                      <div className="text-[11px] font-mono text-vjs-muted mt-0.5">
                        {member.photo_url ? (
                          <span className="text-emerald-400">● Photo uploaded</span>
                        ) : (
                          <span className="text-vjs-muted">○ Initials avatar</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-vjs-secondary leading-relaxed line-clamp-2">
                    {member.responsibilities}
                  </p>
                </div>

                {/* Photo Upload Controls */}
                <div className="pt-3 border-t border-vjs-subtle space-y-2">
                  <div className="flex items-center gap-2">
                    {/* Hidden Native File Input */}
                    <input
                      type="file"
                      id={`team-photo-file-${member.id}`}
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          handlePhotoUpload(member.id, e.target.files[0]);
                          e.target.value = '';
                        }
                      }}
                    />

                    {/* Styled Upload Button */}
                    <label
                      htmlFor={`team-photo-file-${member.id}`}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                        isUploadingPhoto === member.id
                          ? 'bg-vjs-surface-elevated text-vjs-muted cursor-wait'
                          : 'bg-[#00E5FF] text-[#050505] hover:bg-[#33EBFF] shadow-sm'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>
                        {isUploadingPhoto === member.id
                          ? 'Uploading...'
                          : member.photo_url
                          ? 'Change Photo'
                          : 'Upload Photo'}
                      </span>
                    </label>

                    {/* Remove Photo Button */}
                    {member.photo_url && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(member.id)}
                        disabled={isUploadingPhoto === member.id}
                        className="p-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition-colors"
                        title="Remove custom photo and revert to initials"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] text-vjs-muted font-mono text-center">
                    JPG, PNG, WebP up to 10MB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Audit Log */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-vjs-primary">System & Security Audit Trail</h2>
          <div className="rounded-2xl border border-vjs-subtle bg-vjs-surface overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-vjs-subtle text-vjs-muted bg-vjs-surface-elevated">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Entity</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vjs-subtle text-vjs-secondary">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-vjs-surface-hover">
                    <td className="p-3 text-vjs-muted">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 font-bold text-[#00E5FF]">{log.action}</td>
                    <td className="p-3">{log.entity_type}</td>
                    <td className="p-3 text-vjs-muted">{log.ip_address || 'Localhost'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <ImageLightboxModal
        isOpen={showLightbox}
        images={lightboxImages}
        initialIndex={lightboxIndex}
        projectTitle={lightboxTitle}
        onClose={() => setShowLightbox(false)}
      />
    </div>
  );
};
