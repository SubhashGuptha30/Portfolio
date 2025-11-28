'use client'

import { motion } from 'framer-motion'
import { Achievement } from '@/types/sanity'

interface AchievementsProps {
    achievements: Achievement[]
}

export default function Achievements({ achievements }: AchievementsProps) {
    if (!achievements || achievements.length === 0) return null

    return (
        <section id="achievements" className="bg-black py-32 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-16 md:gap-32 mb-20">
                    <div className="md:w-1/3">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            className="font-syne text-sm font-bold text-white/40 uppercase tracking-widest mb-4"
                        >
                            Recognition
                        </motion.h2>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {achievements.map((achievement, index) => (
                        <motion.div
                            key={achievement._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                <span className="text-8xl font-syne font-bold text-white">
                                    {new Date(achievement.date).getFullYear()}
                                </span>
                            </div>

                            <div className="relative z-10">
                                <span className="inline-block px-3 py-1 mb-6 text-xs font-mono text-white/60 border border-white/10 rounded-full bg-black/20">
                                    {new Date(achievement.date).getFullYear()}
                                </span>

                                <h3 className="text-2xl font-bold text-white mb-4 font-syne leading-tight group-hover:text-white/90 transition-colors">
                                    {achievement.title}
                                </h3>

                                <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                                    {achievement.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
