// TypeScript models mirroring the Supabase schema in supabase/schema.sql.
// Keep this file in sync with the SQL migration if you change either one.

export type ContentStatus = 'draft' | 'published';
export type ProgramType = 'regular' | 'short_course';

export interface Profile {
  id: string; // auth.users.id
  full_name: string | null;
  role: 'admin' | 'super_admin';
  created_at: string;
}

export interface SiteSettings {
  id: string;
  college_name: string;
  short_name: string | null;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  office_hours: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  linkedin_url: string | null;
  footer_text: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  established_year: number | null;
  map_embed_url: string | null;
  updated_at: string;
}

export interface AboutInfo {
  id: string;
  title: string | null;
  description: string | null;
  mission: string | null;
  vision: string | null;
  core_values: string | null;
  updated_at: string;
}

export interface PrincipalInfo {
  id: string;
  name: string | null;
  designation: string | null;
  message: string | null;
  photo_url: string | null;
  updated_at: string;
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  head_name: string | null;
  description: string | null;
  image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  name: string;
  slug: string;
  type: ProgramType;
  degree_level: string | null;
  duration: string | null;
  department_id: string | null;
  description: string | null;
  eligibility: string | null;
  admission_requirements: string | null;
  subjects_overview: string | null;
  career_opportunities: string | null;
  fee_info: string | null;
  image_url: string | null;
  status: ContentStatus;
  admission_open: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
  department?: Department | null;
}

export interface Subject {
  id: string;
  name: string;
  code: string | null;
  program_id: string | null;
  semester: string | null;
  credit_hours: number | null;
  teacher_id: string | null;
  description: string | null;
  status: ContentStatus;
  created_at: string;
  program?: Program | null;
  teacher?: Faculty | null;
}

export interface Faculty {
  id: string;
  name: string;
  slug: string;
  photo_url: string | null;
  designation: string | null;
  department_id: string | null;
  qualification: string | null;
  specialization: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  office: string | null;
  experience: string | null;
  status: ContentStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
  department?: Department | null;
  subjects?: Subject[];
}

export interface AdmissionsInfo {
  id: string;
  overview: string | null;
  eligibility: string | null;
  required_documents: string | null;
  important_dates: string | null;
  fee_info: string | null;
  contact_note: string | null;
  updated_at: string;
}

export interface AdmissionStep {
  id: string;
  step_number: number;
  title: string;
  description: string | null;
}

export interface AdmissionFaq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export interface Notice {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  category: string | null;
  is_pinned: boolean;
  is_published: boolean;
  published_at: string | null;
  expiry_date: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  location: string | null;
  image_url: string | null;
  organizer: string | null;
  registration_link: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  title: string | null;
  description: string | null;
  category: string;
  image_url: string;
  created_at: string;
}

export interface DownloadFile {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  file_url: string;
  file_name: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Statistic {
  id: string;
  label: string;
  value: string;
  icon: string | null;
  display_order: number;
  is_visible: boolean;
}

export interface Highlight {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  display_order: number;
  is_visible: boolean;
}

export interface CampusLifeInfo {
  id: string;
  intro: string | null;
  updated_at: string;
}

export const GALLERY_CATEGORIES = [
  'Campus',
  'Events',
  'Seminars',
  'Sports',
  'Academic Activities',
  'Other',
] as const;

export const DOWNLOAD_CATEGORIES = [
  'Admission Forms',
  'Prospectus',
  'Timetables',
  'Syllabus',
  'Notices',
  'Forms',
  'Other',
] as const;

export const NOTICE_CATEGORIES = [
  'General',
  'Academic',
  'Admissions',
  'Examination',
  'Events',
  'Urgent',
] as const;
