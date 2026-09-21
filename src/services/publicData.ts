import { supabase } from '../lib/supabase';
import type {
  AboutInfo,
  AdmissionFaq,
  AdmissionStep,
  AdmissionsInfo,
  CampusLifeInfo,
  ContactMessage,
  Department,
  DownloadFile,
  EventItem,
  Faculty,
  GalleryImage,
  Highlight,
  Notice,
  PrincipalInfo,
  Program,
  SiteSettings,
  Statistic,
  Subject,
} from '../types/database';

// ---------- Site-wide singletons ----------

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return data as SiteSettings | null;
}

export async function getAbout(): Promise<AboutInfo | null> {
  const { data, error } = await supabase.from('about').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return data as AboutInfo | null;
}

export async function getPrincipal(): Promise<PrincipalInfo | null> {
  const { data, error } = await supabase.from('principal').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return data as PrincipalInfo | null;
}

export async function getCampusLife(): Promise<CampusLifeInfo | null> {
  const { data, error } = await supabase.from('campus_life').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return data as CampusLifeInfo | null;
}

export async function getStatistics(): Promise<Statistic[]> {
  const { data, error } = await supabase
    .from('statistics')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Statistic[];
}

export async function getHighlights(): Promise<Highlight[]> {
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Highlight[];
}

// ---------- Departments ----------

export async function getDepartments(): Promise<Department[]> {
  const { data, error } = await supabase.from('departments').select('*').order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Department[];
}

export async function getDepartmentBySlug(slug: string): Promise<Department | null> {
  const { data, error } = await supabase.from('departments').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data as Department | null;
}

// ---------- Programs ----------

export async function getPrograms(type?: 'regular' | 'short_course'): Promise<Program[]> {
  let query = supabase
    .from('programs')
    .select('*, department:departments(*)')
    .eq('status', 'published')
    .order('display_order', { ascending: true });
  if (type) query = query.eq('type', type);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Program[];
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const { data, error } = await supabase
    .from('programs')
    .select('*, department:departments(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Program | null;
}

export async function getProgramsByDepartment(departmentId: string): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('department_id', departmentId)
    .eq('status', 'published')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as Program[];
}

// ---------- Subjects ----------

export async function getSubjects(programId?: string): Promise<Subject[]> {
  let query = supabase
    .from('subjects')
    .select('*, program:programs(*), teacher:faculty(*)')
    .eq('status', 'published')
    .order('semester', { ascending: true });
  if (programId) query = query.eq('program_id', programId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as unknown as Subject[];
}

// ---------- Faculty ----------

export async function getFaculty(): Promise<Faculty[]> {
  const { data, error } = await supabase
    .from('faculty')
    .select('*, department:departments(*)')
    .eq('status', 'published')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Faculty[];
}

export async function getFacultyBySlug(slug: string): Promise<Faculty | null> {
  const { data, error } = await supabase
    .from('faculty')
    .select('*, department:departments(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const faculty = data as unknown as Faculty;

  // Subjects taught are derived from subjects.teacher_id rather than a separate
  // junction table — a subject already names its one assigned teacher, so this
  // keeps a single source of truth instead of two places that can drift apart.
  const { data: subjects } = await supabase
    .from('subjects')
    .select('*, program:programs(*)')
    .eq('teacher_id', faculty.id)
    .eq('status', 'published');

  return { ...faculty, subjects: (subjects ?? []) as unknown as Subject[] };
}

export async function getFacultyByDepartment(departmentId: string): Promise<Faculty[]> {
  const { data, error } = await supabase
    .from('faculty')
    .select('*, department:departments(*)')
    .eq('department_id', departmentId)
    .eq('status', 'published')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Faculty[];
}

// ---------- Admissions ----------

export async function getAdmissionsInfo(): Promise<AdmissionsInfo | null> {
  const { data, error } = await supabase.from('admissions').select('*').limit(1).maybeSingle();
  if (error) throw error;
  return data as AdmissionsInfo | null;
}

export async function getAdmissionSteps(): Promise<AdmissionStep[]> {
  const { data, error } = await supabase.from('admission_steps').select('*').order('step_number', { ascending: true });
  if (error) throw error;
  return (data ?? []) as AdmissionStep[];
}

export async function getAdmissionFaqs(): Promise<AdmissionFaq[]> {
  const { data, error } = await supabase
    .from('admission_faqs')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as AdmissionFaq[];
}

// ---------- Notices ----------

export async function getNotices(): Promise<Notice[]> {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('is_published', true)
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Notice[];
}

export async function getNoticeBySlug(slug: string): Promise<Notice | null> {
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle();
  if (error) throw error;
  return data as Notice | null;
}

// ---------- Events ----------

export async function getEvents(): Promise<EventItem[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('event_date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as EventItem[];
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  if (error) throw error;
  return data as EventItem | null;
}

// ---------- Gallery ----------

export async function getGalleryImages(category?: string): Promise<GalleryImage[]> {
  let query = supabase.from('gallery').select('*').order('created_at', { ascending: false });
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as GalleryImage[];
}

// ---------- Downloads ----------

export async function getDownloads(category?: string): Promise<DownloadFile[]> {
  let query = supabase.from('downloads').select('*').order('created_at', { ascending: false });
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DownloadFile[];
}

// ---------- Contact ----------

export async function submitContactMessage(payload: {
  full_name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert({
    ...payload,
    is_read: false,
  } satisfies Partial<ContactMessage>);
  if (error) throw error;
}

// ---------- Global search ----------

export interface SearchResult {
  type: 'Program' | 'Faculty' | 'Department' | 'Notice' | 'Event' | 'Download';
  id: string;
  title: string;
  href: string;
  snippet?: string | null;
}

export async function globalSearch(term: string): Promise<SearchResult[]> {
  const q = term.trim();
  if (!q) return [];
  const like = `%${q}%`;

  const [programs, faculty, departments, notices, events, downloads] = await Promise.all([
    supabase.from('programs').select('id,name,slug,description').eq('status', 'published').ilike('name', like).limit(8),
    supabase.from('faculty').select('id,name,slug,designation').eq('status', 'published').ilike('name', like).limit(8),
    supabase.from('departments').select('id,name,slug,description').ilike('name', like).limit(8),
    supabase
      .from('notices')
      .select('id,title,slug,content')
      .eq('is_published', true)
      .ilike('title', like)
      .limit(8),
    supabase.from('events').select('id,title,slug,description').eq('status', 'published').ilike('title', like).limit(8),
    supabase.from('downloads').select('id,title,description').ilike('title', like).limit(8),
  ]);

  const results: SearchResult[] = [];

  (programs.data ?? []).forEach((p) =>
    results.push({ type: 'Program', id: p.id, title: p.name, href: `/programs/${p.slug}`, snippet: p.description })
  );
  (faculty.data ?? []).forEach((f) =>
    results.push({ type: 'Faculty', id: f.id, title: f.name, href: `/faculty/${f.slug}`, snippet: f.designation })
  );
  (departments.data ?? []).forEach((d) =>
    results.push({ type: 'Department', id: d.id, title: d.name, href: `/departments/${d.slug}`, snippet: d.description })
  );
  (notices.data ?? []).forEach((n) =>
    results.push({ type: 'Notice', id: n.id, title: n.title, href: `/notices/${n.slug}`, snippet: n.content })
  );
  (events.data ?? []).forEach((e) =>
    results.push({ type: 'Event', id: e.id, title: e.title, href: `/events/${e.slug}`, snippet: e.description })
  );
  (downloads.data ?? []).forEach((d) =>
    results.push({ type: 'Download', id: d.id, title: d.title, href: `/downloads`, snippet: d.description })
  );

  return results;
}
