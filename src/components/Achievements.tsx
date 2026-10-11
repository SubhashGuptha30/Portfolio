'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Trophy } from 'lucide-react'
import { Achievement } from '@/types/sanity'
import fallbackData from '@/data/achievements-fallback.json'

interface AchievementsProps {
    achievements: Achievement[]
}

type ProfileData = Record<string, { profileUrl?: string; stats?: Record<string, any> }>

// ─── Platform Configuration ─────────────────────────────────────────────────────
const PLATFORMS = [
    {
        key: 'googleSkills' as const,
        label: 'Google Skills',
        color: '#4285F4',
        gradient: 'from-blue-500/20 to-indigo-600/5',
        glowColor: 'rgba(66, 133, 244, 0.3)',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
        ),
    },
    {
        key: 'codechef' as const,
        label: 'CodeChef',
        color: '#5B4638',
        gradient: 'from-amber-800/20 to-stone-700/5',
        glowColor: 'rgba(91, 70, 56, 0.4)',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M11.257.004c-.278.03-.504.234-.604.478-.139.32-.065.73.213.96C11.423 1.864 12 2.7 12 3.6c0 .9-.577 1.736-1.134 2.158-.278.23-.352.64-.213.96.1.244.326.448.604.478.32.034.648-.078.848-.356C12.88 5.854 13.5 4.774 13.5 3.6c0-1.174-.62-2.254-1.395-3.24-.2-.278-.528-.39-.848-.356zM8.657.004c-.278.03-.504.234-.604.478-.139.32-.065.73.213.96C8.823 1.864 9.4 2.7 9.4 3.6c0 .9-.577 1.736-1.134 2.158-.278.23-.352.64-.213.96.1.244.326.448.604.478.32.034.648-.078.848-.356C10.28 5.854 10.9 4.774 10.9 3.6c0-1.174-.62-2.254-1.395-3.24-.2-.278-.528-.39-.848-.356zM5.857.004c-.278.03-.504.234-.604.478-.139.32-.065.73.213.96C6.023 1.864 6.6 2.7 6.6 3.6c0 .9-.577 1.736-1.134 2.158-.278.23-.352.64-.213.96.1.244.326.448.604.478.32.034.648-.078.848-.356C7.48 5.854 8.1 4.774 8.1 3.6 8.1 2.426 7.48 1.346 6.705.36 6.505.082 6.177-.03 5.857.004zM3 8.4c-1.2 0-2.4.6-2.4 1.8 0 .6.9 3.6.9 3.6s.9 7.2 1.8 8.4c.9 1.2 3.3 1.8 8.7 1.8 5.4 0 7.8-.6 8.7-1.8.9-1.2 1.8-8.4 1.8-8.4s.9-3 .9-3.6c0-1.2-1.2-1.8-2.4-1.8H3z" />
            </svg>
        ),
    },
    {
        key: 'hackerrank' as const,
        label: 'HackerRank',
        color: '#00EA64',
        gradient: 'from-emerald-500/20 to-green-600/5',
        glowColor: 'rgba(0, 234, 100, 0.3)',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 0c1.285 0 9.75 4.886 10.392 6.015.642 1.128.642 10.842 0 11.97C21.75 19.114 13.285 24 12 24s-9.75-4.886-10.392-6.015c-.642-1.128-.642-10.842 0-11.97C2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V7.057c0-.143-.117-.258-.258-.258h-1.2c-.141 0-.258.115-.258.258v9.886c0 .143.117.258.258.258h1.2c.141 0 .258-.115.258-.258v-3.875h4.074v3.875c0 .143.117.258.258.258h1.2c.141 0 .258-.115.258-.258V7.057c0-.143-.117-.258-.258-.258h-1.2z" />
            </svg>
        ),
    },
    {
        key: 'leetcode' as const,
        label: 'LeetCode',
        color: '#FFA116',
        gradient: 'from-amber-500/20 to-yellow-600/5',
        glowColor: 'rgba(255, 161, 22, 0.3)',
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a1.494 1.494 0 0 0-.076 2.012l.097.107 3.854 4.126 5.406 5.788a1.374 1.374 0 0 0 2.012.076l.107-.097 3.854-4.126 5.406-5.788a1.374 1.374 0 0 0 .076-2.012l-.097-.107-3.854-4.126L14.544.438A1.374 1.374 0 0 0 13.483 0zm-.684 2.217 4.723 5.057a.5.5 0 0 1 0 .682l-4.723 5.057a.5.5 0 0 1-.732 0L7.344 7.956a.5.5 0 0 1 0-.682l4.723-5.057a.5.5 0 0 1 .732 0z" />
            </svg>
        ),
    },
]

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function Achievements({ achievements }: AchievementsProps) {
    const [profiles, setProfiles] = useState<ProfileData>(fallbackData as ProfileData)

    useEffect(() => {
        fetch('/api/achievements')
            .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
            .then(setProfiles)
            .catch((err) => console.error('[achievements] Fetch failed:', err))
    }, [])

    const badgeCount = profiles.googleSkills?.stats?.totalBadges

    return (
        <section id="achievements" className="bg-black py-32 border-t border-white/[0.06]">
            <div className="container mx-auto px-6">
                {achievements && achievements.length > 0 && (
                    <div className="mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            className="font-syne text-sm font-bold text-white/60 uppercase tracking-widest mb-12"
                        >
                            Honors & Recognition
                        </motion.h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={achievement._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-100px' }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative p-8 bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.06] transition-colors duration-500"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                        <Trophy className="w-16 h-16 text-white" />
                                    </div>
                                    <div className="relative z-10">
                                        <span className="inline-block px-3 py-1 mb-6 text-xs font-mono text-white/60 border border-white/10 rounded-full">
                                            {new Date(achievement.date).getFullYear()}
                                        </span>
                                        <h3 className="text-xl font-bold text-white mb-3 font-syne leading-tight pr-16">
                                            {achievement.title}
                                        </h3>
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            {achievement.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                <h2 className="font-syne text-sm font-bold text-white/60 uppercase tracking-widest mb-6">
                    Coding Profiles
                </h2>
                <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {PLATFORMS.map((platform) => {
                        const url = profiles[platform.key]?.profileUrl
                        return (
                            <li key={platform.key}>
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15 transition-colors"
                                >
                                    <span style={{ color: platform.color }}>{platform.icon}</span>
                                    <span className="flex-1 min-w-0">
                                        <span className="block text-sm text-white font-medium">{platform.label}</span>
                                        <span className="block text-xs text-white/60">
                                            {platform.key === 'googleSkills' && badgeCount ? `${badgeCount} badges earned` : 'View profile'}
                                        </span>
                                    </span>
                                    <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                                </a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </section>
    )
}
