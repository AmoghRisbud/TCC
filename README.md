# The Collective Counsel (TCC) Website

Static Next.js (App Router) + Tailwind + Decap CMS (Git-based) implementation.

## Stack
- Next.js 14 (App Router, SSG)
- Tailwind CSS
- Decap CMS (Git-based, editorial workflow) at `/admin`
- Markdown content in `content/**`

## Getting Started (Windows PowerShell)
```powershell
npm install
npm run dev
```
Open: http://localhost:3000

## Build
```powershell
npm run build
npm start
```

## Content Structure
- `content/programs` Markdown with frontmatter
- `content/projects`
- `content/testimonials`
- `content/team`
- `content/jobs`
- `content/gallery`
- `content/settings/site.md`

## Adding Content via CMS
Deploy to Netlify (enable Identity + Git Gateway) or GitHub repo. Visit `/admin` to create drafts; publish after review.

## Future Go Backend Migration
Add API layer replacing `lib/content.ts` with network fetches; keep same data interfaces in `lib/types.ts`. Introduce ISR (`revalidate`) for frequently updated pages.

## SEO Roadmap (Upcoming)
- Dynamic meta per page
- JSON-LD for Programs (Course), Jobs (JobPosting), Organization
- Sitemap & robots.txt generation script

## License
Internal project. No license header added.
