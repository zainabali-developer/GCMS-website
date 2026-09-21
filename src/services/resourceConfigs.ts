import { BUCKETS } from '../lib/supabase';
import type { ResourceConfig } from './resourceTypes';
import type { SingletonConfig } from '../components/admin/AdminSingletonPage';

export const aboutSingletonConfig: SingletonConfig = {
  table: 'about',
  title: 'About GCMS',
  description: 'This content appears on the About page and the homepage About preview.',
  fields: [
    { name: 'title', label: 'Section title', type: 'text', placeholder: 'About Government College of Management Sciences, Abbottabad' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'mission', label: 'Mission', type: 'textarea' },
    { name: 'vision', label: 'Vision', type: 'textarea' },
    { name: 'core_values', label: 'Core values', type: 'textarea', helpText: 'One value per line.' },
  ],
};

export const principalSingletonConfig: SingletonConfig = {
  table: 'principal',
  title: 'Principal',
  description: "Shown in the Principal's Message section on the homepage and About page.",
  fields: [
    { name: 'photo_url', label: 'Principal photograph', type: 'image', bucket: BUCKETS.principal },
    { name: 'name', label: 'Full name', type: 'text', placeholder: 'Leave blank until confirmed' },
    { name: 'designation', label: 'Designation', type: 'text', defaultValue: 'Principal' },
    { name: 'message', label: 'Message from the Principal', type: 'textarea' },
  ],
};

export const campusLifeSingletonConfig: SingletonConfig = {
  table: 'campus_life',
  title: 'Campus Life',
  description: 'The introductory text shown at the top of the Campus Life page.',
  fields: [{ name: 'intro', label: 'Introduction', type: 'textarea' }],
};

export const siteSettingsConfig: SingletonConfig = {
  table: 'site_settings',
  title: 'Site Settings',
  description: 'College name, contact details, homepage text, and social links used across the site.',
  fields: [
    { name: 'college_name', label: 'College name', type: 'text', required: true },
    { name: 'short_name', label: 'Short name', type: 'text', placeholder: 'GCMS Abbottabad' },
    { name: 'logo_url', label: 'Logo', type: 'image', bucket: BUCKETS.siteAssets, folder: 'branding' },
    { name: 'established_year', label: 'Established year', type: 'number' },
    { name: 'hero_title', label: 'Homepage hero title', type: 'text' },
    { name: 'hero_subtitle', label: 'Homepage hero subtitle', type: 'textarea' },
    { name: 'address', label: 'Address', type: 'textarea' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'office_hours', label: 'Office hours', type: 'text', placeholder: 'e.g. Mon–Sat, 8:00 AM – 2:00 PM' },
    { name: 'map_embed_url', label: 'Google Map embed URL', type: 'text', helpText: 'The src URL from a Google Maps “Embed a map” iframe.' },
    { name: 'facebook_url', label: 'Facebook URL', type: 'text' },
    { name: 'twitter_url', label: 'Twitter / X URL', type: 'text' },
    { name: 'instagram_url', label: 'Instagram URL', type: 'text' },
    { name: 'youtube_url', label: 'YouTube URL', type: 'text' },
    { name: 'linkedin_url', label: 'LinkedIn URL', type: 'text' },
    { name: 'footer_text', label: 'Extra footer text', type: 'text' },
  ],
};

export const departmentsConfig: ResourceConfig = {
  table: 'departments',
  entityLabel: 'Department',
  entityLabelPlural: 'Departments',
  orderBy: 'display_order',
  searchFields: ['name', 'head_name'],
  fields: [
    { name: 'name', label: 'Department name', type: 'text', required: true, showInTable: true },
    { name: 'slug', label: 'Slug', type: 'slug', slugSource: 'name', required: true, showInTable: true },
    { name: 'head_name', label: 'Department head', type: 'text', showInTable: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image_url', label: 'Department image', type: 'image', bucket: BUCKETS.siteAssets, folder: 'departments' },
    { name: 'display_order', label: 'Display order', type: 'number', defaultValue: 0 },
  ],
};

export const programsConfig: ResourceConfig = {
  table: 'programs',
  entityLabel: 'Program',
  entityLabelPlural: 'Programs',
  orderBy: 'display_order',
  searchFields: ['name', 'degree_level'],
  fields: [
    { name: 'name', label: 'Program name', type: 'text', required: true, showInTable: true },
    { name: 'slug', label: 'Slug', type: 'slug', slugSource: 'name', required: true },
    {
      name: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      showInTable: true,
      options: [
        { value: 'regular', label: 'Regular Program' },
        { value: 'short_course', label: 'Short Course' },
      ],
      defaultValue: 'regular',
    },
    { name: 'degree_level', label: 'Degree / type label', type: 'text', placeholder: 'e.g. BBA (Hons)' },
    { name: 'duration', label: 'Duration', type: 'text', placeholder: 'e.g. 4 Years', showInTable: true },
    {
      name: 'department_id',
      label: 'Department',
      type: 'select',
      optionsSource: { table: 'departments', valueField: 'id', labelField: 'name' },
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
    { name: 'admission_requirements', label: 'Admission requirements', type: 'textarea' },
    { name: 'subjects_overview', label: 'Subjects overview', type: 'textarea' },
    { name: 'career_opportunities', label: 'Career opportunities', type: 'textarea' },
    { name: 'fee_info', label: 'Fee information', type: 'textarea' },
    { name: 'image_url', label: 'Program image', type: 'image', bucket: BUCKETS.programImages },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      showInTable: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
      ],
      defaultValue: 'draft',
    },
    { name: 'admission_open', label: 'Admission currently open', type: 'boolean', defaultValue: false },
    { name: 'display_order', label: 'Display order', type: 'number', defaultValue: 0 },
  ],
};

export const subjectsConfig: ResourceConfig = {
  table: 'subjects',
  entityLabel: 'Subject',
  entityLabelPlural: 'Subjects',
  orderBy: 'created_at',
  ascending: false,
  searchFields: ['name', 'code'],
  fields: [
    { name: 'name', label: 'Subject name', type: 'text', required: true, showInTable: true },
    { name: 'code', label: 'Subject code', type: 'text', showInTable: true },
    {
      name: 'program_id',
      label: 'Program',
      type: 'select',
      required: true,
      showInTable: true,
      optionsSource: { table: 'programs', valueField: 'id', labelField: 'name' },
    },
    { name: 'semester', label: 'Semester / year', type: 'text', placeholder: 'e.g. Semester 3' },
    { name: 'credit_hours', label: 'Credit hours', type: 'number' },
    {
      name: 'teacher_id',
      label: 'Teacher',
      type: 'select',
      optionsSource: { table: 'faculty', valueField: 'id', labelField: 'name' },
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      showInTable: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
      ],
      defaultValue: 'published',
    },
  ],
};

export const facultyConfig: ResourceConfig = {
  table: 'faculty',
  entityLabel: 'Faculty Member',
  entityLabelPlural: 'Faculty',
  orderBy: 'display_order',
  searchFields: ['name', 'designation', 'email'],
  fields: [
    { name: 'name', label: 'Full name', type: 'text', required: true, showInTable: true },
    { name: 'slug', label: 'Slug', type: 'slug', slugSource: 'name', required: true },
    { name: 'photo_url', label: 'Profile photo', type: 'image', bucket: BUCKETS.facultyImages },
    { name: 'designation', label: 'Designation', type: 'text', showInTable: true },
    {
      name: 'department_id',
      label: 'Department',
      type: 'select',
      showInTable: true,
      optionsSource: { table: 'departments', valueField: 'id', labelField: 'name' },
    },
    { name: 'qualification', label: 'Qualification', type: 'text' },
    { name: 'specialization', label: 'Specialization', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'office', label: 'Office', type: 'text' },
    { name: 'experience', label: 'Experience', type: 'text', placeholder: 'e.g. 10+ years' },
    { name: 'bio', label: 'Short biography', type: 'textarea' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      showInTable: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
      ],
      defaultValue: 'published',
    },
    { name: 'display_order', label: 'Display order', type: 'number', defaultValue: 0 },
  ],
};

export const noticesConfig: ResourceConfig = {
  table: 'notices',
  entityLabel: 'Notice',
  entityLabelPlural: 'Notices',
  orderBy: 'created_at',
  ascending: false,
  searchFields: ['title', 'category'],
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
    { name: 'slug', label: 'Slug', type: 'slug', slugSource: 'title', required: true },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      showInTable: true,
      options: [
        { value: 'General', label: 'General' },
        { value: 'Academic', label: 'Academic' },
        { value: 'Admissions', label: 'Admissions' },
        { value: 'Examination', label: 'Examination' },
        { value: 'Events', label: 'Events' },
        { value: 'Urgent', label: 'Urgent' },
      ],
    },
    { name: 'content', label: 'Content', type: 'textarea', required: true },
    { name: 'pdf_url', label: 'Attach PDF', type: 'file', bucket: BUCKETS.documents, folder: 'notices' },
    { name: 'published_at', label: 'Publish date', type: 'date' },
    { name: 'expiry_date', label: 'Expiry date', type: 'date' },
    { name: 'is_pinned', label: 'Pin to top', type: 'boolean', defaultValue: false, showInTable: true },
    { name: 'is_published', label: 'Published', type: 'boolean', defaultValue: true, showInTable: true },
  ],
};

export const eventsConfig: ResourceConfig = {
  table: 'events',
  entityLabel: 'Event',
  entityLabelPlural: 'Events',
  orderBy: 'event_date',
  ascending: false,
  searchFields: ['title', 'location', 'organizer'],
  fields: [
    { name: 'title', label: 'Event title', type: 'text', required: true, showInTable: true },
    { name: 'slug', label: 'Slug', type: 'slug', slugSource: 'title', required: true },
    { name: 'event_date', label: 'Date', type: 'date', required: true, showInTable: true },
    { name: 'event_time', label: 'Time', type: 'time' },
    { name: 'location', label: 'Location', type: 'text' },
    { name: 'organizer', label: 'Organizer', type: 'text' },
    { name: 'registration_link', label: 'Registration link', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'image_url', label: 'Event image', type: 'image', bucket: BUCKETS.eventImages },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      showInTable: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
      ],
      defaultValue: 'published',
    },
  ],
};

export const galleryConfig: ResourceConfig = {
  table: 'gallery',
  entityLabel: 'Photo',
  entityLabelPlural: 'Gallery',
  orderBy: 'created_at',
  ascending: false,
  searchFields: ['title', 'category'],
  fields: [
    { name: 'image_url', label: 'Image', type: 'image', required: true, bucket: BUCKETS.gallery },
    { name: 'title', label: 'Title', type: 'text', showInTable: true },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      showInTable: true,
      options: [
        { value: 'Campus', label: 'Campus' },
        { value: 'Events', label: 'Events' },
        { value: 'Seminars', label: 'Seminars' },
        { value: 'Sports', label: 'Sports' },
        { value: 'Academic Activities', label: 'Academic Activities' },
        { value: 'Other', label: 'Other' },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
};

export const downloadsConfig: ResourceConfig = {
  table: 'downloads',
  entityLabel: 'Document',
  entityLabelPlural: 'Downloads',
  orderBy: 'created_at',
  ascending: false,
  searchFields: ['title', 'category'],
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      showInTable: true,
      options: [
        { value: 'Admission Forms', label: 'Admission Forms' },
        { value: 'Prospectus', label: 'Prospectus' },
        { value: 'Timetables', label: 'Timetables' },
        { value: 'Syllabus', label: 'Syllabus' },
        { value: 'Notices', label: 'Notices' },
        { value: 'Forms', label: 'Forms' },
        { value: 'Other', label: 'Other' },
      ],
    },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'file_url', label: 'File', type: 'file', required: true, bucket: BUCKETS.documents, folder: 'downloads' },
  ],
};

export const admissionsSingletonConfig: SingletonConfig = {
  table: 'admissions',
  title: 'Admissions Overview',
  description: 'General admissions content. Add step-by-step process and FAQs further down this page.',
  fields: [
    { name: 'overview', label: 'Overview', type: 'textarea' },
    { name: 'eligibility', label: 'Eligibility', type: 'textarea' },
    { name: 'required_documents', label: 'Required documents', type: 'textarea', helpText: 'One document per line.' },
    { name: 'important_dates', label: 'Important dates', type: 'textarea' },
    { name: 'fee_info', label: 'Fee information', type: 'textarea' },
    { name: 'contact_note', label: 'Admissions contact note', type: 'textarea' },
  ],
};

export const admissionStepsConfig: ResourceConfig = {
  table: 'admission_steps',
  entityLabel: 'Step',
  entityLabelPlural: 'Admission Process Steps',
  orderBy: 'step_number',
  fields: [
    { name: 'step_number', label: 'Step number', type: 'number', required: true, showInTable: true, defaultValue: 1 },
    { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
};

export const admissionFaqsConfig: ResourceConfig = {
  table: 'admission_faqs',
  entityLabel: 'FAQ',
  entityLabelPlural: 'Admission FAQs',
  orderBy: 'display_order',
  fields: [
    { name: 'question', label: 'Question', type: 'text', required: true, showInTable: true },
    { name: 'answer', label: 'Answer', type: 'textarea', required: true },
    { name: 'display_order', label: 'Display order', type: 'number', defaultValue: 0 },
  ],
};

export const statisticsConfig: ResourceConfig = {
  table: 'statistics',
  entityLabel: 'Statistic',
  entityLabelPlural: 'Statistics',
  orderBy: 'display_order',
  fields: [
    { name: 'label', label: 'Label', type: 'text', required: true, showInTable: true, placeholder: 'e.g. Academic Programs' },
    { name: 'value', label: 'Value', type: 'text', required: true, showInTable: true, placeholder: 'e.g. 7' },
    { name: 'icon', label: 'Icon (lucide name)', type: 'text', placeholder: 'e.g. GraduationCap' },
    { name: 'is_visible', label: 'Visible on homepage', type: 'boolean', defaultValue: true, showInTable: true },
    { name: 'display_order', label: 'Display order', type: 'number', defaultValue: 0 },
  ],
};

export const highlightsConfig: ResourceConfig = {
  table: 'highlights',
  entityLabel: 'Highlight',
  entityLabelPlural: 'Why Choose GCMS',
  orderBy: 'display_order',
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true, showInTable: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'icon', label: 'Icon (lucide name)', type: 'text', placeholder: 'e.g. Award' },
    { name: 'is_visible', label: 'Visible', type: 'boolean', defaultValue: true, showInTable: true },
    { name: 'display_order', label: 'Display order', type: 'number', defaultValue: 0 },
  ],
};
