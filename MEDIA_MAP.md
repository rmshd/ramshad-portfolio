# Static media map

The uploaded source contained `index.html`, but not the referenced local media files. Put the files below in `incoming-media/` and run `organize-media.ps1`, or copy them manually to the exact destinations.

## Branding and profile

| Original filename | Destination |
|---|---|
| `ramshad portfolio.png` | `public/assets/images/branding/ramshad-portfolio.png` |
| `profile.png` | `public/assets/images/profile/profile.png` |

## Service icons — filenames remain exactly unchanged

| Exact filename | Destination |
|---|---|
| `graphic design.png` | `public/assets/images/services/graphic design.png` |
| `Motion Graphics.png` | `public/assets/images/services/Motion Graphics.png` |
| `3d.png` | `public/assets/images/services/3d.png` |
| `AI Visuals.png` | `public/assets/images/services/AI Visuals.png` |
| `Video Editing.png` | `public/assets/images/services/Video Editing.png` |
| `Brand Identity.png` | `public/assets/images/services/Brand Identity.png` |

Linux and Vercel filenames are case-sensitive. Keep all spaces, capital letters and extensions exactly as shown.

## Portfolio works

Do **not** place portfolio posters or videos in `public/assets/`. After deployment, open `/admin` and upload every work from there. The media will be stored in Supabase Storage and the project details will be stored in the `portfolio_items` table.
