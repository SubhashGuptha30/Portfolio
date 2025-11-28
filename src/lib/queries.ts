import { groq } from 'next-sanity'

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    name,
    role,
    heroImage,
    heroTagline,
    heroSummary,
    aboutText,
    "resumeUrl": resume.asset->url,
    socialLinks,
    seoTitle,
    seoDescription,
    seoKeywords,
    ogImage
  }
`

export const projectsQuery = groq`
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    shortDescription,
    longDescription,
    technologies,
    demoUrl,
    codeUrl,
    thumbnailImage,
    demoMedia[] {
      ...,
      _type == "image" => {
        "url": asset->url
      },
      _type == "file" => {
        "url": asset->url
      }
    }
  }
`

export const skillsQuery = groq`
  *[_type == "skill"] | order(name asc) {
    _id,
    name,
    category
  }
`

export const certificationsQuery = groq`
  *[_type == "certification"] | order(issueDate desc) {
    _id,
    title,
    provider,
    issueDate,
    certificateImage,
    verificationUrl
  }
`

export const achievementsQuery = groq`
  *[_type == "achievement"] | order(date desc) {
    _id,
    title,
    description,
    date
  }
`

export const experiencesQuery = groq`
  *[_type == "experience"] | order(startDate desc) {
    _id,
    role,
    organization,
    startDate,
    endDate,
    isCurrent,
    description
  }
`
