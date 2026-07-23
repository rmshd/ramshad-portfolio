# Ramshad Portfolio — Pro Admin v3

A complete Vercel + Supabase portfolio CMS. The public design remains the same, while all important content can now be managed from `/admin` without editing HTML.

## Main admin modules

1. **Projects** — image/video upload, title, description, category dropdown, date, external link, featured, draft/published, show/hide, edit, delete and ordering.
2. **Skills & Tools** — edit percentage, description, icon, card size and skill chips; add/remove tools such as Unreal Engine or DaVinci Resolve.
3. **Life Journey** — add, edit, hide, delete and reorder milestones.
4. **Services** — add/edit services, descriptions, icon images, visibility and order.
5. **Hero & About** — profile picture, hero roles, bio, experience cards, statistics and footer.
6. **Contact & Socials** — WhatsApp, email, contact text and social links.
7. **Enquiries** — database inbox with New / Read / Replied status, search, filters and reply shortcuts.
8. **Dashboard** — project, message and content counts with quick actions.

## Important upgrade rule

Your existing logo, profile image and six service icons are already in your current GitHub repository. This ZIP does not contain those original image bytes.

**Do not empty/delete your current repository before this upgrade.** Copy the files from this package over the existing repository and choose **Replace/Merge**. Existing image files inside `public/assets/images/` will remain.

Required static service filenames remain exactly:

- `graphic design.png`
- `Motion Graphics.png`
- `3d.png`
- `AI Visuals.png`
- `Video Editing.png`
- `Brand Identity.png`

## First required action

Run the updated `supabase/setup.sql` in Supabase SQL Editor. It safely upgrades the old database and seeds current site content. Then copy the new project files over the existing repository, commit and push.

Read `UPGRADE_FROM_CURRENT_SITE.md` for the exact order.

## Existing Vercel variables

No new Vercel environment variable is required. Keep:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET=portfolio-media`
- `ADMIN_KEY`

## URLs after deployment

- Website: `/`
- Pro Admin: `/admin`
- Health API: `/api/health`
- Public content API: `/api/content`
- Public projects API: `/api/portfolio`

## Local validation

```powershell
npm install
npm run check
```

## Storage design

Large media uploads go directly from the browser to Supabase Storage using a short-lived signed upload token. Vercel Functions save only the metadata and database changes.
