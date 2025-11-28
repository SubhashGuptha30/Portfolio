# Subhash Guptha Portfolio

A modern, high-performance personal portfolio website built with Next.js, Tailwind CSS, and Sanity CMS.

## Features
- **Modern Design**: Dark-themed, glassmorphism, responsive.
- **CMS Integration**: All content (projects, skills, certifications, etc.) is managed via Sanity Studio.
- **Performance**: Fast loading, SEO optimized.
- **No-Code Updates**: Update content without touching the code.

## Getting Started

### 1. Prerequisites
- Node.js installed.
- A [Sanity.io](https://www.sanity.io/) account (Free tier is sufficient).

### 2. Setup Sanity
1. Log in to Sanity and create a new project.
2. Get your **Project ID** and **Dataset** name (usually `production`).
3. Rename `.env.local.example` to `.env.local` (if not already done) and update the values:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
   ```
4. You also need to add `http://localhost:3000` to your Sanity Project's **CORS origins** in the Sanity Dashboard (API tab).

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Locally
```bash
npm run dev
```
The site will be available at `http://localhost:3000`.
The CMS Studio will be available at `http://localhost:3000/studio`.

## Content Management
Visit `/studio` to access the CMS. You will need to log in with your Sanity account.
- **Site Settings**: Update hero image, name, tagline, resume URL, social links.
- **Projects**: Add your projects with images and links.
- **Skills**: Add skills with categories (Language, Tool, Technology).
- **Certifications**: Add certificates.
- **Achievements**: Add awards and achievements.
- **Experience**: Add leadership roles and experience.

## Deployment

### Option 1: Vercel (Recommended)
1. Push this code to a GitHub repository (optional but easier) OR use Vercel CLI.
2. If using Vercel CLI:
   ```bash
   npm i -g vercel
   vercel
   ```
3. **Important**: Add the Environment Variables (`NEXT_PUBLIC_SANITY_PROJECT_ID`, etc.) in the Vercel Project Settings.
4. Add your production domain to Sanity CORS origins.

### Option 2: AWS S3 + CloudFront (Static Export)
Since this project uses `next/image` with a remote source (Sanity), static export requires some configuration or using a custom loader. However, for a dynamic CMS site, Vercel or a Node.js hosting (Render, Netlify) is recommended.
If you must use static export:
1. Update `next.config.ts` to include `output: 'export'`.
2. Note that `next/image` optimization won't work out-of-the-box with `export`. You might need to use `unoptimized: true` in `next.config.ts` images config.
3. Run `npm run build`.
4. Upload the `out` directory to S3.

## Domain Setup
1. Buy your domain (`subhashguptha.online`).
2. In your hosting provider (e.g., Vercel), add the domain.
3. Update your DNS settings (A record or CNAME) as provided by the hosting provider.

## Customization
- **Colors**: Edit `src/app/globals.css` CSS variables.
- **Icons**: Uses `lucide-react`.
- **Animations**: Uses `framer-motion`.
