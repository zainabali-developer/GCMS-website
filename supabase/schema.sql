-- ============================================================================
-- Government College of Management Sciences, Abbottabad — Database Schema
-- ============================================================================
-- Run this entire file once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- It is safe to re-run: every statement uses IF NOT EXISTS / OR REPLACE /
-- DROP POLICY IF EXISTS, so re-running will not duplicate objects.
--
-- After running this file, follow the README to:
--   1. Create storage buckets (handled below automatically).
--   2. Create your first admin user (Supabase Dashboard -> Authentication),
--      then add a matching row to public.profiles (see bottom of this file).
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Design note on relationships
-- ----------------------------------------------------------------------------
-- Programs <-> Subjects and Faculty <-> Subjects are modeled as direct
-- foreign keys (subjects.program_id, subjects.teacher_id) rather than
-- separate many-to-many junction tables. Every subject naturally belongs to
-- exactly one program/semester offering and is taught by one assigned
-- teacher, so a direct FK is a single source of truth the admin dashboard
-- can manage with one simple form field, instead of two places that could
-- drift out of sync. A faculty member's "subjects taught" list is derived
-- by querying subjects where teacher_id = faculty.id.
-- ----------------------------------------------------------------------------


-- ============================================================================
-- 1. PROFILES (admin users)
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Helper: is the current request from a logged-in admin?
-- SECURITY DEFINER lets this function read public.profiles even though
-- public.profiles itself has row-level security enabled.
-- ============================================================================
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles p where p.id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Deliberately no public INSERT/DELETE policy: admin accounts are created
-- directly in the Supabase dashboard (see README), not through the app.


-- ============================================================================
-- 2. SITE SETTINGS (singleton)
-- ============================================================================
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  college_name text not null default 'Government College of Management Sciences, Abbottabad',
  short_name text default 'GCMS Abbottabad',
  logo_url text,
  address text default '56QR+73P Govt College of Management Sciences, Jinnahabad Habibullah Colony, Abbottabad, 22010, Pakistan',
  phone text,
  email text,
  office_hours text,
  facebook_url text,
  twitter_url text,
  instagram_url text,
  youtube_url text,
  linkedin_url text,
  footer_text text,
  hero_title text default 'Government College of Management Sciences, Abbottabad',
  hero_subtitle text default 'Empowering Students Through Quality Education, Professional Skills & Innovation',
  established_year int,
  map_embed_url text,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 3. ABOUT (singleton)
-- ============================================================================
create table if not exists public.about (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  mission text,
  vision text,
  core_values text,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 4. PRINCIPAL (singleton)
-- ============================================================================
create table if not exists public.principal (
  id uuid primary key default gen_random_uuid(),
  name text,
  designation text default 'Principal',
  message text,
  photo_url text,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 5. CAMPUS LIFE (singleton)
-- ============================================================================
create table if not exists public.campus_life (
  id uuid primary key default gen_random_uuid(),
  intro text,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 6. DEPARTMENTS
-- ============================================================================
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  head_name text,
  description text,
  image_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_departments_slug on public.departments(slug);

-- ============================================================================
-- 7. PROGRAMS
-- ============================================================================
create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type text not null default 'regular' check (type in ('regular', 'short_course')),
  degree_level text,
  duration text,
  department_id uuid references public.departments(id) on delete set null,
  description text,
  eligibility text,
  admission_requirements text,
  subjects_overview text,
  career_opportunities text,
  fee_info text,
  image_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  admission_open boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_programs_slug on public.programs(slug);
create index if not exists idx_programs_department on public.programs(department_id);
create index if not exists idx_programs_status on public.programs(status);
create index if not exists idx_programs_type on public.programs(type);

-- ============================================================================
-- 8. FACULTY
-- ============================================================================
create table if not exists public.faculty (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  photo_url text,
  designation text,
  department_id uuid references public.departments(id) on delete set null,
  qualification text,
  specialization text,
  email text,
  phone text,
  bio text,
  office text,
  experience text,
  status text not null default 'published' check (status in ('draft', 'published')),
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_faculty_slug on public.faculty(slug);
create index if not exists idx_faculty_department on public.faculty(department_id);
create index if not exists idx_faculty_status on public.faculty(status);

-- ============================================================================
-- 9. SUBJECTS
-- ============================================================================
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text,
  program_id uuid references public.programs(id) on delete cascade,
  semester text,
  credit_hours int,
  teacher_id uuid references public.faculty(id) on delete set null,
  description text,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_subjects_program on public.subjects(program_id);
create index if not exists idx_subjects_teacher on public.subjects(teacher_id);
create index if not exists idx_subjects_status on public.subjects(status);

-- ============================================================================
-- 10. ADMISSIONS (singleton) + STEPS + FAQS
-- ============================================================================
create table if not exists public.admissions (
  id uuid primary key default gen_random_uuid(),
  overview text,
  eligibility text,
  required_documents text,
  important_dates text,
  fee_info text,
  contact_note text,
  updated_at timestamptz not null default now()
);

create table if not exists public.admission_steps (
  id uuid primary key default gen_random_uuid(),
  step_number int not null default 1,
  title text not null,
  description text
);
create index if not exists idx_admission_steps_order on public.admission_steps(step_number);

create table if not exists public.admission_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  display_order int not null default 0
);
create index if not exists idx_admission_faqs_order on public.admission_faqs(display_order);

-- ============================================================================
-- 11. NOTICES
-- ============================================================================
create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text,
  category text,
  is_pinned boolean not null default false,
  is_published boolean not null default true,
  published_at date default current_date,
  expiry_date date,
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_notices_slug on public.notices(slug);
create index if not exists idx_notices_published on public.notices(is_published, is_pinned);

-- ============================================================================
-- 12. EVENTS
-- ============================================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  event_date date not null,
  event_time text,
  location text,
  image_url text,
  organizer text,
  registration_link text,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_events_slug on public.events(slug);
create index if not exists idx_events_date on public.events(event_date);
create index if not exists idx_events_status on public.events(status);

-- ============================================================================
-- 13. GALLERY
-- ============================================================================
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  category text not null default 'Other',
  image_url text not null,
  created_at timestamptz not null default now()
);
create index if not exists idx_gallery_category on public.gallery(category);

-- ============================================================================
-- 14. DOWNLOADS
-- ============================================================================
create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  file_url text not null,
  file_name text,
  created_at timestamptz not null default now()
);
create index if not exists idx_downloads_category on public.downloads(category);

-- ============================================================================
-- 15. CONTACT MESSAGES
-- ============================================================================
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_contact_messages_read on public.contact_messages(is_read);

-- ============================================================================
-- 16. STATISTICS
-- ============================================================================
create table if not exists public.statistics (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  icon text,
  display_order int not null default 0,
  is_visible boolean not null default true
);

-- ============================================================================
-- 17. HIGHLIGHTS ("Why Choose GCMS")
-- ============================================================================
create table if not exists public.highlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text,
  display_order int not null default 0,
  is_visible boolean not null default true
);


-- ============================================================================
-- updated_at auto-touch trigger (keeps updated_at fresh on every UPDATE)
-- ============================================================================
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'about', 'principal', 'campus_life', 'departments',
    'programs', 'faculty', 'subjects', 'admissions', 'notices', 'events'
  ]
  loop
    execute format(
      'drop trigger if exists trg_touch_updated_at on public.%I; ' ||
      'create trigger trg_touch_updated_at before update on public.%I ' ||
      'for each row execute function public.touch_updated_at();',
      t, t
    );
  end loop;
end $$;


-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
-- Pattern:
--  - Singleton / always-public tables (about, principal, site_settings,
--    campus_life, admissions, admission_steps, admission_faqs, departments,
--    gallery, downloads, statistics, highlights): anyone can SELECT,
--    only admins can INSERT/UPDATE/DELETE.
--  - Tables with a draft/published workflow (programs, faculty, subjects,
--    notices, events): the public can SELECT only published rows; admins
--    can SELECT everything (including drafts) and manage all rows.
--  - contact_messages: anyone can INSERT (submit the contact form); only
--    admins can SELECT / UPDATE / DELETE. Public users can never read
--    other people's messages.
--  - profiles: see policies defined above (self-read/update only).
-- ============================================================================

-- ---- Always-public content tables ----
do $$
declare
  t text;
begin
  foreach t in array array[
    'about', 'principal', 'site_settings', 'campus_life', 'departments',
    'admissions', 'admission_steps', 'admission_faqs', 'gallery',
    'downloads', 'statistics', 'highlights'
  ]
  loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "%I_public_read" on public.%I;', t, t);
    execute format(
      'create policy "%I_public_read" on public.%I for select using (true);', t, t
    );

    execute format('drop policy if exists "%I_admin_insert" on public.%I;', t, t);
    execute format(
      'create policy "%I_admin_insert" on public.%I for insert with check (public.is_admin());', t, t
    );

    execute format('drop policy if exists "%I_admin_update" on public.%I;', t, t);
    execute format(
      'create policy "%I_admin_update" on public.%I for update using (public.is_admin());', t, t
    );

    execute format('drop policy if exists "%I_admin_delete" on public.%I;', t, t);
    execute format(
      'create policy "%I_admin_delete" on public.%I for delete using (public.is_admin());', t, t
    );
  end loop;
end $$;

-- ---- Draft/published workflow tables ----
do $$
declare
  t text;
  status_expr text;
begin
  foreach t in array array['programs', 'faculty', 'subjects', 'events']
  loop
    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists "%I_read" on public.%I;', t, t);
    execute format(
      'create policy "%I_read" on public.%I for select using (status = ''published'' or public.is_admin());', t, t
    );

    execute format('drop policy if exists "%I_admin_insert" on public.%I;', t, t);
    execute format(
      'create policy "%I_admin_insert" on public.%I for insert with check (public.is_admin());', t, t
    );

    execute format('drop policy if exists "%I_admin_update" on public.%I;', t, t);
    execute format(
      'create policy "%I_admin_update" on public.%I for update using (public.is_admin());', t, t
    );

    execute format('drop policy if exists "%I_admin_delete" on public.%I;', t, t);
    execute format(
      'create policy "%I_admin_delete" on public.%I for delete using (public.is_admin());', t, t
    );
  end loop;
end $$;

-- Notices use is_published (boolean) instead of a status enum
alter table public.notices enable row level security;

drop policy if exists "notices_read" on public.notices;
create policy "notices_read" on public.notices
  for select using (is_published = true or public.is_admin());

drop policy if exists "notices_admin_insert" on public.notices;
create policy "notices_admin_insert" on public.notices
  for insert with check (public.is_admin());

drop policy if exists "notices_admin_update" on public.notices;
create policy "notices_admin_update" on public.notices
  for update using (public.is_admin());

drop policy if exists "notices_admin_delete" on public.notices;
create policy "notices_admin_delete" on public.notices
  for delete using (public.is_admin());

-- ---- Contact messages: public can submit, only admins can read/manage ----
alter table public.contact_messages enable row level security;

drop policy if exists "contact_messages_public_insert" on public.contact_messages;
create policy "contact_messages_public_insert" on public.contact_messages
  for insert with check (true);

drop policy if exists "contact_messages_admin_select" on public.contact_messages;
create policy "contact_messages_admin_select" on public.contact_messages
  for select using (public.is_admin());

drop policy if exists "contact_messages_admin_update" on public.contact_messages;
create policy "contact_messages_admin_update" on public.contact_messages
  for update using (public.is_admin());

drop policy if exists "contact_messages_admin_delete" on public.contact_messages;
create policy "contact_messages_admin_delete" on public.contact_messages
  for delete using (public.is_admin());


-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
-- All buckets are public for READ (so <img src> and download links work
-- directly from their public URL) but writes are locked to admins only.
-- ============================================================================
insert into storage.buckets (id, name, public)
values
  ('faculty-images', 'faculty-images', true),
  ('gallery', 'gallery', true),
  ('program-images', 'program-images', true),
  ('event-images', 'event-images', true),
  ('documents', 'documents', true),
  ('principal', 'principal', true),
  ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

do $$
declare
  b text;
begin
  foreach b in array array[
    'faculty-images', 'gallery', 'program-images', 'event-images',
    'documents', 'principal', 'site-assets'
  ]
  loop
    execute format(
      'drop policy if exists "%I_public_read" on storage.objects;', b
    );
    execute format(
      'create policy "%I_public_read" on storage.objects for select using (bucket_id = %L);', b, b
    );

    execute format(
      'drop policy if exists "%I_admin_insert" on storage.objects;', b
    );
    execute format(
      'create policy "%I_admin_insert" on storage.objects for insert with check (bucket_id = %L and public.is_admin());', b, b
    );

    execute format(
      'drop policy if exists "%I_admin_update" on storage.objects;', b
    );
    execute format(
      'create policy "%I_admin_update" on storage.objects for update using (bucket_id = %L and public.is_admin());', b, b
    );

    execute format(
      'drop policy if exists "%I_admin_delete" on storage.objects;', b
    );
    execute format(
      'create policy "%I_admin_delete" on storage.objects for delete using (bucket_id = %L and public.is_admin());', b, b
    );
  end loop;
end $$;


-- ============================================================================
-- SEED: singleton rows
-- ============================================================================
-- These tables are designed to hold exactly one row each. Insert an empty
-- starting row for each so the admin dashboard has something to update
-- (upsert-on-save logic in the app also handles the case where the row
-- doesn't exist yet, so this is a convenience, not a requirement).
-- ============================================================================
insert into public.site_settings (college_name)
select 'Government College of Management Sciences, Abbottabad'
where not exists (select 1 from public.site_settings);

insert into public.about (title)
select 'About Government College of Management Sciences, Abbottabad'
where not exists (select 1 from public.about);

insert into public.principal (designation)
select 'Principal'
where not exists (select 1 from public.principal);

insert into public.campus_life (intro)
select null
where not exists (select 1 from public.campus_life);

insert into public.admissions (overview)
select null
where not exists (select 1 from public.admissions);


-- ============================================================================
-- NEXT STEP: create your first admin login
-- ============================================================================
-- 1. In the Supabase dashboard, go to Authentication -> Users -> Add user,
--    and create a user with your admin email + password.
-- 2. Copy that user's UUID (shown in the users table).
-- 3. Run the statement below with that UUID to grant them admin access:
--
--   insert into public.profiles (id, full_name, role)
--   values ('PASTE-USER-UUID-HERE', 'Admin Name', 'admin');
--
-- See the README for the full walkthrough.
-- ============================================================================
