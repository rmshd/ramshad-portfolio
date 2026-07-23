# Upgrade the current live site to Pro Admin

Current repository: `mshd/ramshad-portfolio`

Current Vercel project: `ramshad-portfolio`

## 1. Run the new SQL first

Open Supabase Dashboard → SQL Editor → New query.

Open this package file:

```text
supabase/setup.sql
```

Copy the complete SQL, paste it into Supabase and press **Run**.

It adds the new tables and columns without deleting existing portfolio projects or enquiries.

Confirm these tables exist:

- `site_settings`
- `portfolio_categories`
- `portfolio_items`
- `skills`
- `tools`
- `timeline_items`
- `services`
- `social_links`
- `portfolio_messages`

## 2. Preserve the current image files

Do not delete the current cloned GitHub repository contents before copying this upgrade.

The current repository already contains your real files in:

```text
public/assets/images/branding/
public/assets/images/profile/
public/assets/images/services/
```

Copy all files and folders from this new package into the existing `ramshad-portfolio` repository. Choose **Replace the files in the destination** when Windows asks. Files not present in this ZIP—your real PNG files—will remain in place.

## 3. Commit and push

GitHub Desktop summary:

```text
Upgrade to professional portfolio admin
```

Then click:

1. **Commit to main**
2. **Push origin**

## 4. Wait for Vercel

Vercel → Deployments → latest deployment:

```text
Building → Ready
```

The existing URL remains unchanged.

## 5. Test

Open:

```text
https://ramshad-portfolio.vercel.app/api/health
```

Then:

```text
https://ramshad-portfolio.vercel.app/admin
```

Enter the existing `ADMIN_KEY` value.

## 6. Verify public content

Edit a small field first, such as Hero experience `5+ Years` → `6+ Years`, save it and refresh the website.
