# Ramshad Portfolio — Complete Vercel + Supabase Package

Production site: `https://ramshad-portfolio.vercel.app/`

This package contains the full frontend HTML, admin HTML, Vercel API functions, Supabase SQL, organized static-media folders and deployment instructions.

## Important media rule

- Logo, profile photo and the six service icons are static files inside `public/assets/images/`.
- Portfolio/Works posters and videos are **not** stored inside the Vercel project.
- Portfolio/Works are uploaded from `/admin` and stored permanently in Supabase Storage.

## Complete folder structure

```text
ramshad-portfolio-vercel-complete/
├── api/
│   ├── _lib/
│   ├── admin/
│   ├── contact.js
│   ├── health.js
│   └── portfolio.js
├── public/
│   ├── index.html
│   ├── admin.html
│   └── assets/
│       └── images/
│           ├── branding/
│           │   └── ramshad-portfolio.png       ← add original file
│           ├── profile/
│           │   └── profile.png                 ← add original file
│           └── services/
│               ├── graphic design.png          ← exact original name
│               ├── Motion Graphics.png         ← exact original name
│               ├── 3d.png                      ← exact original name
│               ├── AI Visuals.png              ← exact original name
│               ├── Video Editing.png           ← exact original name
│               └── Brand Identity.png           ← exact original name
├── supabase/
│   └── setup.sql
├── incoming-media/
├── scripts/
│   └── check.js
├── .env.example
├── .gitignore
├── MEDIA_MAP.md
├── organize-media.ps1
├── package.json
├── README.md
├── VERCEL_DEPLOY_CHECKLIST.md
└── vercel.json
```

The uploaded file contained only HTML, so the real PNG media files are not embedded in this ZIP. Copy your original files into `incoming-media/` and run the organizer, or place them manually in the paths above.

## 1. Organize the static media on Windows

Put these files inside `incoming-media/`:

```text
ramshad portfolio.png
profile.png
graphic design.png
Motion Graphics.png
3d.png
AI Visuals.png
Video Editing.png
Brand Identity.png
```

Run from PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\organize-media.ps1
```

The six service icon names are not changed.

## 2. Create the Supabase backend

1. Open your Supabase project.
2. Go to **SQL Editor**.
3. Copy and run all of `supabase/setup.sql`.
4. Copy the Project URL, anon key and service-role key from Supabase project settings.

The SQL creates:

- `portfolio_items`
- `portfolio_messages`
- public Storage bucket `portfolio-media`

The portfolio starts empty. Upload works later from `/admin`.

## 3. Add Vercel environment variables

In the existing Vercel project, open **Settings → Environment Variables** and add:

```text
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET=portfolio-media
ADMIN_KEY
```

Never put `SUPABASE_SERVICE_ROLE_KEY` or `ADMIN_KEY` inside HTML or GitHub.

## 4. Deploy to the same Vercel project

Replace the contents of the GitHub repository already connected to the current Vercel project, then commit and push.

Recommended Vercel settings:

- Framework Preset: `Other`
- Root Directory: repository root
- Build Command: empty/automatic
- Output Directory: empty; Vercel serves `public/`
- Install Command: `npm install`

Deploying the same project keeps the current URL.

## 5. Upload Works from the backend

After deployment, open:

```text
https://ramshad-portfolio.vercel.app/admin
```

Enter the same value used for `ADMIN_KEY`. Upload the title, category, accent and image/video. The browser uploads media directly to Supabase Storage; Vercel stores only the API logic.

## Test URLs

```text
/api/health
/api/portfolio
/admin
```

## Local development

```bash
npm install
npx vercel env pull .env.local
npx vercel dev
```
