import type { SanityClient } from 'next-sanity'
import {
  siteSettingsQuery,
  projectsQuery,
  skillsQuery,
  achievementsQuery,
  certificationsQuery,
  experiencesQuery,
} from '@/lib/queries'

export type HomeData = {
  siteSettings: any
  projects: any[]
  skills: any[]
  achievements: any[]
  certifications: any[]
  experience: any[]
}

export async function fetchHomeData(client: SanityClient): Promise<HomeData> {
  const [siteSettings, projects, skills, achievements, certifications, experience] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(projectsQuery),
    client.fetch(skillsQuery),
    client.fetch(achievementsQuery),
    client.fetch(certificationsQuery),
    client.fetch(experiencesQuery),
  ])
  return { siteSettings, projects, skills, achievements, certifications, experience }
}
