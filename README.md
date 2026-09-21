# GCMS Abbottabad — Official Website

A complete website for the **Government College of Management Sciences (GCMS), Abbottabad**
(also known as Commerce College Mandian), built with React, TypeScript, Vite, Tailwind CSS
and Supabase. It includes the full public website and a protected admin dashboard that manages
every piece of content on the site.

Once you finish the setup below, the only thing you should ever need to touch again in code is
your own content — everything (programs, faculty, notices, events, gallery, downloads, site
settings...) is managed from `/admin`.

---

## 1. What's included

- **Public website** — Home, About, Programs (+ detail pages), Departments (+ detail pages),
  Faculty (+ detail pages, with search/filter), Subjects, Admissions, Notices (+ detail pages),
  Events (+ detail pages), Gallery (with lightbox), Downloads, Campus Life, Contact (with a
  working form that saves to the database), and site-wide Search.
- **Admin dashboard** (`/admin`) — protected by Supabase Auth login. Full create/edit/delete for
  About, Principal, Programs, Departments, Faculty, Subjects, Admissions (overview + process
  steps + FAQs), Notices, Events, Gallery, Downloads, Statistics, "Why Choose GCMS" highlights,
  Site Settings, and a Contact Messages inbox (read/unread, delete).
- **Supabase backend** — Postgres schema with Row Level Security, Supabase Auth for the admin
  login, and Supabase Storage for images and documents.
- Nothing is hardcoded and nothing is faked: every list, form and count on the site reads from
  and writes to your real Supabase project.

### A note on content that wasn't provided

The brief for this site was explicit that names, fees, dates, and similar official details
should never be invented. Wherever that information wasn't supplied (the principal's name,
teacher bios, admission fees and deadlines, department names, etc.), the site shows a plain
placeholder like *"Information will be updated by the college."* instead of made-up content.
Fill these in from the admin dashboard once you have the official details — the only content
seeded automatically is the list of program names and durations given in the brief (see
`supabase/seed.sql`).

---

## 2. Prerequisites

- [Node.js](https://nodejs.org/) 18 or later, and npm (comes with Node).
- A free [Supabase](https://supabase.com/) account and project.

---

## 3. Create your Supabase project

1. Go to [supabase.com](https://supabase.com/), sign in, and click **New Project**.
2. Pick any name and password, choose a region close to Pakistan, and wait for it to finish
   provisioning (about two minutes).
3. In the left sidebar, go to **Project Settings -> API**. You'll need two values from this
   page in the next step:
   - **Project URL**
   - **anon / public** API key

---

## 4. Configure the project

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Open `.env` and paste in the two values from step 3 above:

   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

   **This is the only file you should ever need to edit to configure the project.**

---

## 5. Set up the database

1. In your Supabase project, open the **SQL Editor** (left sidebar).
2. Click **New query**, then open `supabase/schema.sql` from this project, copy its entire
   contents, paste them into the editor, and click **Run**.
   - This creates every table, sets up Row Level Security policies, creates the storage
     buckets used for images/documents, and adds a couple of helper triggers.
   - It's safe to re-run this file if you ever need to — it won't create duplicates.
3. Open a new query, paste in the contents of `supabase/seed.sql`, and click **Run**.
   - This inserts the official program list (BBA, BS Commerce, D.Com, DBA, ICS, DIT, B.Ed
     Computer Science, and the eight short courses) from the project brief, with just their
     name, type and duration filled in.

That's it for the database — storage buckets, tables, security policies and starter data are
all in place.

---

## 6. Create your first admin login

The admin dashboard uses Supabase Auth, and admin accounts are created directly in the
Supabase dashboard rather than through a public sign-up form (so random visitors can't create
themselves an admin account).

1. In Supabase, go to **Authentication -> Users -> Add user -> Create new user**.
2. Enter your email address and a password, and make sure **Auto Confirm User** is checked.
3. Click the new user to open their details, and copy their **User UID**.
4. Back in the **SQL Editor**, run:

   ```sql
   insert into public.profiles (id, full_name, role)
   values ('paste-the-user-uid-here', 'Your Name', 'admin');
   ```

5. You can now log in at `/admin/login` with that email and password.

To add more admins later, repeat this process with a new Supabase Auth user and a matching
`profiles` row.

---

## 7. Run it locally

```bash
npm run dev
```

Open the URL it prints (typically `http://localhost:5173`). The admin dashboard is at
`http://localhost:5173/admin/login`.

---

## 8. Add your content

Log in at `/admin` and, roughly in this order:

1. **Site Settings** — college name, phone, email, address, office hours, social links, and the
   homepage hero text.
2. **About** — description, mission, vision, core values.
3. **Principal** — upload the principal's photo, name and message once confirmed.
4. **Departments** — add each department (the brief didn't name specific departments, so none
   are pre-loaded).
5. **Programs** — the 15 official programs/short courses are already there; open each one and
   fill in eligibility, fees, career opportunities, and a program image as they're confirmed.
6. **Faculty** and **Subjects** — add teachers and link them to departments and subjects as you
   receive their official information and photos.
7. **Admissions, Notices, Events, Gallery, Downloads, Statistics, Why Choose GCMS** — add as
   needed; everything you publish here appears on the public site immediately.

---

## 9. Build for production

```bash
npm run build
```

This runs a full TypeScript check and produces an optimized build in `dist/`. Preview it
locally with:

```bash
npm run preview
```

---

## 10. Deploy to Vercel

1. Push this project to a GitHub repository.
2. In [Vercel](https://vercel.com/), click **Add New -> Project** and import the repository.
   Vercel will auto-detect the Vite framework preset (build command `npm run build`, output
   directory `dist`) — you don't need to change these.
3. Under **Environment Variables**, add the same two values from your `.env` file:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**.

Because this is a single-page app with client-side routing, if you deploy anywhere other than
Vercel (which handles this automatically), make sure your host rewrites all unmatched routes to
`/index.html`.

---

## 11. Project structure

```
src/
  assets/          Official crest and principal photo
  components/
    ui/            Reusable building blocks (Button, Modal, Table, ImageUploader...)
    layout/        Header, Footer, admin sidebar, page layouts
    admin/          Generic, config-driven CRUD (AdminResourcePage, AdminSingletonPage)
    home/           Homepage section components
  contexts/         Auth, Toast notifications, Site Settings
  hooks/            Small reusable hooks (e.g. dynamic <select> options)
  lib/              Supabase client, error formatting, icon lookup
  services/         All Supabase queries, storage upload/delete, resource configs
  types/            TypeScript types mirroring the database schema
  pages/
    public/         One component per public route
    admin/           One thin wrapper per admin route (most just plug a config into the
                     generic AdminResourcePage/AdminSingletonPage)
supabase/
  schema.sql        Full database schema, RLS policies, storage buckets
  seed.sql          Official program list from the brief
```

### How the admin CRUD works

Rather than hand-writing near-identical create/edit/delete screens for Programs, Faculty,
Departments, Subjects, Notices, Events, Gallery, Downloads, Statistics and Highlights, each of
those admin pages is a **config** (in `src/services/resourceConfigs.ts`) describing its fields —
label, type (text, textarea, image, select, date, boolean...), and validation — fed into one
shared `AdminResourcePage` component. This keeps the create/edit forms, search, pagination,
image/file upload and delete-confirmation logic in one well-tested place instead of duplicated
a dozen times. Singleton content (About, Principal, Site Settings, Admissions overview, Campus
Life intro) works the same way through `AdminSingletonPage`.

To add a brand new manageable content type later, you mostly just need a new table in Supabase
and a new config object — you don't need to write a new form from scratch.

---

## 12. Troubleshooting

- **Blank page / console error about environment variables** — make sure `.env` exists (copied
  from `.env.example`) and both values are filled in, then restart `npm run dev`.
- **"You don't have permission to do that" when saving in the admin dashboard** — your Supabase
  Auth user doesn't have a matching row in `public.profiles`. Repeat step 6.
- **Images/files don't upload** — double-check `supabase/schema.sql` ran successfully; it
  creates the storage buckets the uploaders write to.
- **Changes made in the admin dashboard don't show up on the public site** — published content
  appears immediately; double-check the item's **Status** is set to *Published* (or, for
  Notices, that **Published** is checked).
