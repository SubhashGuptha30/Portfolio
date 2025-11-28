'use client'

import { motion } from 'framer-motion'
import { Experience as ExperienceType } from '@/types/sanity'
import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface ExperienceProps {
    experiences: ExperienceType[]
}

const ExperienceItem = ({ exp, index }: { exp: ExperienceType; index: number }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: false, margin: "-100px" }}
            className="group relative border-t border-white/10 py-16 transition-all duration-500 hover:bg-white/5"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* Date Column */}
                <div className="md:col-span-2 pt-2">
                    <span className="text-white/40 font-mono text-sm tracking-wider">
                        {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} — {exp.isCurrent ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')}
                    </span>
                </div>

                {/* Main Content Column */}
                <div className="md:col-span-10 flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-4xl md:text-6xl font-bold font-syne text-white/20 group-hover:text-white transition-colors duration-500">
                            {exp.organization}
                        </h3>
                        <span className="text-xl md:text-2xl font-medium text-white/60 group-hover:text-white/80 transition-colors duration-300">
                            {exp.role}
                        </span>
                    </div>

                    <div className="flex items-start gap-8 md:w-1/3 justify-between">
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
                            className="overflow-hidden"
                        >
                            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                                {exp.description}
                            </p>
                        </motion.div>

                        <div className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 ${isHovered ? 'bg-white text-black rotate-45 scale-110' : 'text-white'}`}>
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

export default function Experience({ experiences }: ExperienceProps) {
    if (!experiences || experiences.length === 0) return null

    return (
        <section id="experience" className="bg-black py-32">
            <div className="container mx-auto px-6 mb-24">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    className="font-syne text-sm font-bold text-white/40 uppercase tracking-widest mb-4"
                >
                    Experience
                </motion.h2>
            </div>

            <div className="flex flex-col">
                {experiences.map((exp, index) => (
                    <ExperienceItem key={exp._id} exp={exp} index={index} />
                ))}
            </div>
        </section>
    )
}
