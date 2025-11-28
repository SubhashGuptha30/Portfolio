'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Skill } from '@/types/sanity'
import { ChevronDown } from 'lucide-react'

interface SkillsProps {
    skills: Skill[]
}

const CATEGORIES = ['frontend', 'backend', 'database', 'languages', 'tools', 'cloud', 'mobile', 'design', 'soft-skills', 'other']

export default function Skills({ skills }: SkillsProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)

    // Group skills by category
    const groupedSkills = useMemo(() => {
        const groups: Record<string, Skill[]> = {}
        CATEGORIES.forEach(cat => {
            groups[cat] = skills.filter(skill => skill.category === cat)
        })
        return groups
    }, [skills])

    if (!skills || skills.length === 0) return null

    return (
        <section
            id="skills"
            className="py-32 bg-black text-white overflow-hidden min-h-screen flex items-center"
        >
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">

                    {/* Categories List (Desktop & Mobile) */}
                    <div className="w-full lg:w-1/3 flex flex-col gap-6">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            onViewportLeave={() => setActiveCategory(null)}
                            className="font-syne text-sm font-bold text-white/40 uppercase tracking-widest mb-8"
                        >
                            Expertise
                        </motion.h2>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, margin: "-100px" }}
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                            className="flex flex-col gap-6"
                        >

                            {CATEGORIES.map((category) => {
                                const hasSkills = groupedSkills[category]?.length > 0
                                if (!hasSkills) return null

                                const isActive = activeCategory === category
                                const isHovered = hoveredCategory === category

                                return (
                                    <motion.div
                                        key={category}
                                        variants={{
                                            hidden: { opacity: 0, x: -20 },
                                            visible: { opacity: 1, x: 0 }
                                        }}
                                        className="relative group"
                                    >
                                        {/* Desktop Hover / Mobile Click Trigger */}
                                        <button
                                            onClick={() => setActiveCategory(category)}
                                            onMouseEnter={() => {
                                                setHoveredCategory(category)
                                                setActiveCategory(category)
                                            }}
                                            onMouseLeave={() => setHoveredCategory(null)}
                                            className={`text-3xl md:text-5xl font-bold uppercase font-syne transition-all duration-500 text-left w-full flex items-center justify-between
                                            ${isActive ? 'text-white translate-x-4' : 'text-white/20 hover:text-white/60'}
                                        `}
                                        >
                                            {category}
                                            {/* Mobile Indicator */}
                                            <span className="lg:hidden text-2xl">
                                                <ChevronDown className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} />
                                            </span>
                                        </button>

                                        {/* Mobile Accordion Content */}
                                        <div className="lg:hidden overflow-hidden">
                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="pt-4 pb-8"
                                                    >
                                                        <div className="flex flex-wrap gap-3">
                                                            {groupedSkills[category].map((skill) => (
                                                                <span
                                                                    key={skill._id}
                                                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/80"
                                                                >
                                                                    {skill.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </div>

                    {/* Desktop Content Area (Right Side) */}
                    <div className="hidden lg:flex w-full lg:w-2/3 items-center justify-center relative min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {activeCategory ? (
                                <motion.div
                                    key={activeCategory}
                                    initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full"
                                >
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {groupedSkills[activeCategory]?.map((skill, index) => (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                                                key={skill._id}
                                                className="group flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                                            >
                                                {/* Icon placeholder if we had icons, for now just text */}
                                                <span className="text-xl font-medium text-white/80 group-hover:text-white transition-colors">
                                                    {skill.name}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="intro-message"
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: false }}
                                    exit="hidden"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1,
                                                delayChildren: 0.2
                                            }
                                        }
                                    }}
                                    className="text-center max-w-xl"
                                >
                                    <h3 className="font-syne text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                        <motion.span
                                            variants={{
                                                hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
                                                visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                                            }}
                                            className="block"
                                        >
                                            Explore My
                                        </motion.span>
                                        <motion.span
                                            variants={{
                                                hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
                                                visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                                            }}
                                            className="block text-white/40"
                                        >
                                            Technical Arsenal
                                        </motion.span>
                                    </h3>
                                    <motion.p
                                        variants={{
                                            hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
                                            visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
                                        }}
                                        className="text-white/60 text-lg leading-relaxed"
                                    >
                                        Hover over the categories on the left to reveal the tools and technologies I use to craft digital experiences.
                                    </motion.p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}
