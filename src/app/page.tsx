'use client'

import { client } from '@/lib/sanity'

import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Loader from '@/components/Loader'
import BackToTop from '@/components/BackToTop'

const Skills = dynamic(() => import('@/components/Skills'))
const Projects = dynamic(() => import('@/components/Projects'))
const Achievements = dynamic(() => import('@/components/Achievements'))
const Certifications = dynamic(() => import('@/components/Certifications'))
const Experience = dynamic(() => import('@/components/Experience'))
const Contact = dynamic(() => import('@/components/Contact'))
import {
  siteSettingsQuery,
  projectsQuery,
  skillsQuery,
  achievementsQuery,
  certificationsQuery,
  experiencesQuery
} from '@/lib/queries'

export default function Home() {
  const [data, setData] = useState<any>({
    siteSettings: null,
    projects: [],
    skills: [],
    achievements: [],
    certifications: [],
    experience: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Minimum loading time of 2.5s for the animation
        const minLoadTime = new Promise(resolve => setTimeout(resolve, 2500))

        const [
          siteSettings,
          projects,
          skills,
          achievements,
          certifications,
          experience
        ] = await Promise.all([
          client.fetch(siteSettingsQuery),
          client.fetch(projectsQuery),
          client.fetch(skillsQuery),
          client.fetch(achievementsQuery),
          client.fetch(certificationsQuery),
          client.fetch(experiencesQuery)
        ])

        await minLoadTime

        setData({
          siteSettings,
          projects,
          skills,
          achievements,
          certifications,
          experience
        })
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="bg-slate-950 min-h-screen text-slate-200 selection:bg-primary/30">
      <AnimatePresence mode="wait">
        {loading ? (
          <Loader key="loader" />
        ) : (
          <>
            <Navbar />
            <Hero data={data.siteSettings} />
            <About data={data.siteSettings} />
            <Skills skills={data.skills} />
            <Projects projects={data.projects} />
            <Achievements achievements={data.achievements} />
            <Experience experiences={data.experience} />
            <Certifications certifications={data.certifications} />
            <Contact data={data.siteSettings} />
            <BackToTop />


          </>
        )}
      </AnimatePresence>
    </main>
  )
}
