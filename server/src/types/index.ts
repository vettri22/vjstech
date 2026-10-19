export type UserRole = 'admin' | 'client';
export type ClientStatus = 'active' | 'inactive' | 'finished';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: UserRole;
  client_status?: ClientStatus;
  organization?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export type ArchitectureStatus = 'pending' | 'approved' | 'declined';

export interface ProjectArchitecture {
  id: string;
  project_id: string;
  title: string;
  description: string;
  diagram_url?: string;
  tech_spec?: string;
  status: ArchitectureStatus;
  client_feedback?: string;
  created_at: string;
  reviewed_at?: string;
}

export interface ProjectMessage {
  id: string;
  project_id: string;
  sender_id: string;
  sender_role: 'admin' | 'client';
  sender_name: string;
  message_type: 'message' | 'feedback' | 'note' | 'architecture';
  content: string;
  created_at: string;
}

export interface RateLimitUnlock {
  id: string;
  email: string;
  ip_address?: string;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  resolved_at?: string;
}

export type EnquiryStatus = 'new' | 'reviewed' | 'contacted' | 'proposal_sent' | 'archived';

export interface Enquiry {
  id: string;
  reference_code: string;
  full_name: string;
  email: string;
  phone?: string;
  organization?: string;
  client_category: string;
  services: string[]; // JSON array
  project_title: string;
  project_description: string;
  budget_range?: string;
  desired_timeline?: string;
  preferred_contact_method: string;
  additional_notes?: string;
  consent_given: boolean;
  status: EnquiryStatus;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export type ProjectStatus =
  | 'Enquiry Received'
  | 'Requirements Review'
  | 'Proposal'
  | 'Approved'
  | 'In Development'
  | 'Awaiting Client Review'
  | 'Revision'
  | 'Completed'
  | 'On Hold';

export interface Project {
  id: string;
  reference_code: string;
  name: string;
  slug: string;
  client_id: string;
  description: string;
  status: ProjectStatus;
  start_date?: string;
  target_end_date?: string;
  created_at: string;
  updated_at: string;
}

export type MilestoneStatus = 'pending' | 'in_progress' | 'review' | 'approved' | 'completed';

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  due_date?: string;
  completed_at?: string;
  order_index: number;
  created_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  author_id: string;
  author_name?: string;
  title: string;
  message: string;
  created_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  title: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  uploaded_by: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  responsibilities: string;
  skills: string[]; // JSON array
  avatar_initials: string;
  photo_url?: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  role?: string;
  short_desc: string;
  full_desc: string;
  category: string;
  technologies: string[]; // JSON array
  cover_image: string;
  gallery_images?: string[]; // JSON array
  project_url?: string;
  repo_url?: string;
  completion_date?: string;
  client_attribution?: string;
  challenge: string;
  solution: string;
  architecture_highlights?: string[]; // JSON array
  results?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditEvent {
  id: string;
  user_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details_json?: string;
  ip_address?: string;
  created_at: string;
}
