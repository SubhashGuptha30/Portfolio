'use client'

import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface ContactProps {
    data: any
}

export default function Contact({ data }: ContactProps) {
    if (!data) return null

    return (
        <section id="contact" className="bg-black py-32 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-20">
                    <div className="flex-1">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            className="font-syne text-6xl md:text-9xl font-bold text-white leading-[0.8] mb-12 tracking-tighter"
                        >
                            LET'S WORK <br />
                            <span className="text-white/40">TOGETHER</span>
                        </motion.h2>

                        <div className="flex flex-col gap-8">
                            <a
                                href={`mailto:${data.socialLinks?.email}`}
                                className="text-2xl md:text-4xl text-white hover:text-white/60 transition-colors border-b border-white/20 pb-2 w-fit"
                            >
                                {data.socialLinks?.email}
                            </a>

                            <div className="flex gap-8">
                                {data.socialLinks?.github && (
                                    <a href={data.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors uppercase tracking-widest text-sm">
                                        Github
                                    </a>
                                )}
                                {data.socialLinks?.linkedin && (
                                    <a href={data.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors uppercase tracking-widest text-sm">
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="md:w-1/3 pt-4">
                        <p className="text-white/60 text-lg leading-relaxed mb-8">
                            I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                        </p>
                        <div className="flex flex-col gap-2 text-white/40 text-sm uppercase tracking-widest">
                            <span>Based in</span>
                            <span className="text-white">Kakinada, India</span>
                        </div>
                    </div>
                </div>

                <div className="mt-32 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm uppercase tracking-widest font-mono">
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
                        <span>© {new Date().getFullYear()} Subhash Guptha</span>
                        <span className="hidden md:inline w-1 h-1 bg-white/20 rounded-full" />
                        <span>All Rights Reserved</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center text-center md:text-right">
                        <span>Designed & Built with Passion</span>
                        <span className="hidden md:inline w-1 h-1 bg-white/20 rounded-full" />
                        <span>Next.js • Tailwind • Sanity</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
