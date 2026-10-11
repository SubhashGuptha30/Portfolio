'use client'

import { client } from '@/lib/sanity'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import BackToTop from '@/components/BackToTop'
import { fetchHomeData, type HomeData } from '@/lib/homeData'

import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Achievements from '@/components/Achievements'
import Certifications from '@/components/Certifications'
import Experience from '@/components/Experience'
import Contact from '@/components/Contact'

// Content is prerendered at build time (so it is in the HTML for search engines and
// link previews), then refreshed from Sanity in the background so Studio edits show
// up without waiting for the next rebuild.
export default function HomeClient({ initialData }: { initialData: HomeData }) {
  const [data, setData] = useState<HomeData>(initialData)

  useEffect(() => {
    fetchHomeData(client).then(setData).catch((error) => console.error('Error refreshing data:', error))
  }, [])

  return (
    <main className="bg-slate-950 min-h-screen text-slate-200 selection:bg-primary/30">
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
    </main>
  )
}
