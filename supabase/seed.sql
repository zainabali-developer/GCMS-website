-- ============================================================================
-- Initial program data for Government College of Management Sciences,
-- Abbottabad. Run this AFTER schema.sql, once.
--
-- Only the program name, type and duration are filled in here — these are
-- the only facts provided. Everything else (description, eligibility,
-- fees, career opportunities, department...) is left blank on purpose, and
-- the public site shows "Information will be updated by the college." for
-- any blank field. Fill these in from the admin dashboard (Programs) once
-- you have the official details.
-- ============================================================================

insert into public.programs (name, slug, type, duration, status, display_order)
values
  ('BBA (Hons)', 'bba-hons', 'regular', '4 Years', 'published', 1),
  ('BS Commerce', 'bs-commerce', 'regular', '4 Years', 'published', 2),
  ('D.Com', 'd-com', 'regular', '2 Years', 'published', 3),
  ('DBA', 'dba', 'regular', '2 Years', 'published', 4),
  ('ICS', 'ics', 'regular', '2 Years', 'published', 5),
  ('DIT', 'dit', 'regular', '1 Year', 'published', 6),
  ('B.Ed Computer Science', 'bed-computer-science', 'regular', '2 Years', 'published', 7)
on conflict (slug) do nothing;

insert into public.programs (name, slug, type, status, display_order)
values
  ('English Shorthand and Typewriting', 'english-shorthand-and-typewriting', 'short_course', 'published', 1),
  ('Tourism and Hospitality Management', 'tourism-and-hospitality-management', 'short_course', 'published', 2),
  ('QuickBooks (Accounting Software)', 'quickbooks-accounting-software', 'short_course', 'published', 3),
  ('Graphic Designing', 'graphic-designing', 'short_course', 'published', 4),
  ('E-Commerce', 'e-commerce', 'short_course', 'published', 5),
  ('Digital Marketing', 'digital-marketing', 'short_course', 'published', 6),
  ('Database Development', 'database-development', 'short_course', 'published', 7),
  ('Artificial Intelligence', 'artificial-intelligence', 'short_course', 'published', 8)
on conflict (slug) do nothing;
