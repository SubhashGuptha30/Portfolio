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


## ☁️ Cloud Deployment

Detailed, step-by-step guides are available for both AWS and Google Cloud:

-   [**Deploy to AWS App Runner**](./DEPLOY_AWS.md) (Recommended for ease of use)
-   [**Deploy to Google Cloud Run**](./DEPLOY_GCP.md) (Recommended for scalability)

Both guides cover setting up continuous deployment from GitHub.

### Environment Variables
Remember to set these in your cloud provider's dashboard:
*   `NEXT_PUBLIC_SANITY_PROJECT_ID`
*   `NEXT_PUBLIC_SANITY_DATASET`

