'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import { Github, Linkedin, Mail, FileText, ArrowDown } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { SiteSettings } from '@/types/sanity'

interface HeroProps {
    data: SiteSettings
}

export default function Hero({ data }: HeroProps) {
    const [showResume, setShowResume] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    useEffect(() => {
        if (showResume) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [showResume])

    if (!data) return null

    return (
        <section ref={containerRef} id="hero" className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
            {/* Background Image with Parallax */}
            {/* Background Image Removed - Moved to About Section */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <span className="inline-block px-4 py-2 mb-6 text-sm font-medium tracking-[0.2em] text-white/60 border border-white/10 rounded-full uppercase backdrop-blur-md">
                        {data.role || 'Creative Developer'}
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="font-syne text-[12vw] leading-[0.8] font-bold text-white mb-8 tracking-tighter mix-blend-difference"
                >
                    {data.name ? data.name.split(' ')[0].toUpperCase() : 'SUBHASH'}
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                        {data.name ? data.name.split(' ').slice(1).join(' ').toUpperCase() : 'GUPTHA'}
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed mb-12"
                >
                    {data.heroTagline || 'Crafting digital experiences with precision and passion.'}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="flex flex-col md:flex-row gap-6 justify-center items-center"
                >
                    <a
                        href="#projects"
                        className="group relative px-8 py-4 bg-white text-black rounded-full font-bold overflow-hidden transition-transform hover:scale-105"
                    >
                        <span className="relative z-10">VIEW WORK</span>
                        <div className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    </a>

                    <div className="flex gap-6 items-center">
                        {data.socialLinks?.github && (
                            <a href={data.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="text-white/60 hover:text-white transition-colors transform hover:scale-110">
                                <Github size={24} />
                            </a>
                        )}
                        {data.socialLinks?.linkedin && (
                            <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="text-white/60 hover:text-white transition-colors transform hover:scale-110">
                                <Linkedin size={24} />
                            </a>
                        )}
                        {data.socialLinks?.email && (
                            <a href={`mailto:${data.socialLinks.email}`} aria-label="Send Email" className="text-white/60 hover:text-white transition-colors transform hover:scale-110">
                                <Mail size={24} />
                            </a>
                        )}
                        {data.resumeUrl && (
                            <button
                                onClick={() => setShowResume(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/30"
                            >
                                <FileText size={18} />
                                <span>Resume</span>
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2"
            >
                <span className="text-xs tracking-widest uppercase">Scroll</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <ArrowDown size={20} />
                </motion.div>
            </motion.div>

            {/* Resume Modal */}
            {showResume && data.resumeUrl && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                        onClick={() => setShowResume(false)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-5xl h-[85vh] bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                    >
                        <div className="absolute top-4 right-4 z-10">
                            <button
                                onClick={() => setShowResume(false)}
                                className="p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-md"
                                aria-label="Close Resume Modal"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <iframe
                            src={data.resumeUrl}
                            className="w-full h-full"
                            title="Resume"
                        />
                    </motion.div>
                </div>
            )}
        </section>
    )
}
