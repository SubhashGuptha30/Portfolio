'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, RefreshCw, Trophy, AlertTriangle } from 'lucide-react'
import { Achievement } from '@/types/sanity'

// ─── Types ──────────────────────────────────────────────────────────────────────
interface PlatformData {
    platform: string
    lastUpdated: string
    profileUrl: string
    stats: Record<string, any>
    badges?: any[]
    charts?: any
    ratingHistory?: any[]
    _fallback?: boolean
}

interface AchievementsData {
    leetcode: PlatformData
    codechef: PlatformData
    hackerrank: PlatformData
    googleSkills: PlatformData
}

interface AchievementsProps {
    achievements: Achievement[]
}

// ─── Platform Configuration ─────────────────────────────────────────────────────
const PLATFORMS = [
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
]

// ─── Animated Counter Hook ──────────────────────────────────────────────────────
function useAnimatedCounter(target: number, duration = 1500) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const hasAnimated = useRef(false)

    useEffect(() => {
        if (hasAnimated.current || target === 0) {
            setCount(target)
            return
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true
                    const start = performance.now()
                    const animate = (now: number) => {
                        const elapsed = now - start
                        const progress = Math.min(elapsed / duration, 1)
                        const eased = 1 - Math.pow(1 - progress, 3)
                        setCount(Math.round(eased * target))
                        if (progress < 1) requestAnimationFrame(animate)
                    }
                    requestAnimationFrame(animate)
                }
            },
            { threshold: 0.3 }
        )

        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [target, duration])

    return { count, ref }
}

// ─── Animated Counter Component ─────────────────────────────────────────────────
function AnimatedStat({ value, label, suffix = '', color }: { value: number; label: string; suffix?: string; color?: string }) {
    const { count, ref } = useAnimatedCounter(value)

    return (
        <div ref={ref} className="text-center">
            <div className="text-3xl md:text-4xl font-bold font-syne" style={{ color: color || 'white' }}>
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{label}</div>
        </div>
    )
}

// ─── SVG Radial Chart (LeetCode) ────────────────────────────────────────────────
function RadialChart({ data }: { data: { label: string; solved: number; total: number; color: string }[] }) {
    const totalSolved = data.reduce((sum, d) => sum + d.solved, 0)
    const totalProblems = data.reduce((sum, d) => sum + d.total, 0)
    const size = 200
    const center = size / 2
    const strokeWidth = 12

    return (
        <div className="flex flex-col items-center gap-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
                {data.map((item, i) => {
                    const radius = center - strokeWidth * (i + 1) - i * 6
                    const circumference = 2 * Math.PI * radius
                    const progress = item.total > 0 ? item.solved / item.total : 0
                    const dashOffset = circumference * (1 - progress)

                    return (
                        <g key={item.label}>
                            <circle
                                cx={center} cy={center} r={radius}
                                fill="none" stroke="rgba(255,255,255,0.06)"
                                strokeWidth={strokeWidth} strokeLinecap="round"
                            />
                            <motion.circle
                                cx={center} cy={center} r={radius}
                                fill="none" stroke={item.color}
                                strokeWidth={strokeWidth} strokeLinecap="round"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                whileInView={{ strokeDashoffset: dashOffset }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: i * 0.2, ease: 'easeOut' }}
                                style={{ filter: `drop-shadow(0 0 6px ${item.color}40)` }}
                            />
                        </g>
                    )
                })}
                <text
                    x={center} y={center - 8}
                    textAnchor="middle" dominantBaseline="central"
                    className="fill-white font-bold text-3xl font-syne"
                    transform={`rotate(90, ${center}, ${center})`}
                >
                    {totalSolved}
                </text>
                <text
                    x={center} y={center + 16}
                    textAnchor="middle" dominantBaseline="central"
                    className="fill-white/40 text-xs"
                    transform={`rotate(90, ${center}, ${center})`}
                >
                    / {totalProblems}
                </text>
            </svg>
            <div className="flex gap-4 flex-wrap justify-center">
                {data.map(item => (
                    <div key={item.label} className="flex items-center gap-2 text-xs">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-white/60">{item.label}</span>
                        <span className="text-white font-medium">{item.solved}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Star Rating (CodeChef) ─────────────────────────────────────────────────────
function StarRating({ count, max = 7 }: { count: number; max?: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: max }, (_, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                    className={`text-xl ${i < count ? 'text-amber-400' : 'text-white/10'}`}
                >
                    ★
                </motion.span>
            ))}
        </div>
    )
}

// ─── Radar Chart (HackerRank) ───────────────────────────────────────────────────
function RadarChart({ skills }: { skills: { label: string; value: number; max: number }[] }) {
    if (!skills || skills.length === 0) {
        return (
            <div className="flex items-center justify-center h-48 text-white/30 text-sm">
                No skill data available yet
            </div>
        )
    }

    const size = 200
    const center = size / 2
    const maxRadius = 70
    const levels = 5

    // Generate points for the web
    const getPoint = (index: number, radius: number) => {
        const angle = (Math.PI * 2 * index) / Math.max(skills.length, 3) - Math.PI / 2
        return {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
        }
    }

    const pointCount = Math.max(skills.length, 3)

    return (
        <div className="flex flex-col items-center gap-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Web rings */}
                {Array.from({ length: levels }, (_, i) => {
                    const r = (maxRadius * (i + 1)) / levels
                    const points = Array.from({ length: pointCount }, (_, j) => {
                        const p = getPoint(j, r)
                        return `${p.x},${p.y}`
                    }).join(' ')
                    return (
                        <polygon
                            key={i} points={points}
                            fill="none" stroke="rgba(255,255,255,0.06)"
                            strokeWidth="1"
                        />
                    )
                })}

                {/* Axis lines */}
                {Array.from({ length: pointCount }, (_, i) => {
                    const p = getPoint(i, maxRadius)
                    return (
                        <line
                            key={i}
                            x1={center} y1={center} x2={p.x} y2={p.y}
                            stroke="rgba(255,255,255,0.06)" strokeWidth="1"
                        />
                    )
                })}

                {/* Data polygon */}
                {skills.length > 0 && (
                    <motion.polygon
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        points={skills.map((s, i) => {
                            const r = (s.value / s.max) * maxRadius
                            const p = getPoint(i, r)
                            return `${p.x},${p.y}`
                        }).join(' ')}
                        fill="rgba(0, 234, 100, 0.15)"
                        stroke="#00EA64"
                        strokeWidth="2"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(0, 234, 100, 0.3))' }}
                    />
                )}

                {/* Data points */}
                {skills.map((s, i) => {
                    const r = (s.value / s.max) * maxRadius
                    const p = getPoint(i, r)
                    return (
                        <motion.circle
                            key={i}
                            cx={p.x} cy={p.y} r="4"
                            fill="#00EA64"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15, type: 'spring' }}
                        />
                    )
                })}

                {/* Labels */}
                {skills.map((s, i) => {
                    const p = getPoint(i, maxRadius + 18)
                    return (
                        <text
                            key={i}
                            x={p.x} y={p.y}
                            textAnchor="middle" dominantBaseline="central"
                            className="fill-white/50 text-[10px]"
                        >
                            {s.label}
                        </text>
                    )
                })}
            </svg>
        </div>
    )
}

// ─── Badge Grid ─────────────────────────────────────────────────────────────────
function BadgeGrid({ badges, platformColor }: { badges: any[]; platformColor: string }) {
    if (!badges || badges.length === 0) {
        return (
            <div className="flex items-center justify-center py-8 text-white/30 text-sm">
                No badges earned yet — keep coding! 🚀
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {badges.slice(0, 12).map((badge, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.06] transition-all duration-300"
                >
                    {badge.imageUrl && (
                        <img
                            src={badge.imageUrl}
                            alt={badge.title || badge.name || 'Badge'}
                            className="w-12 h-12 rounded-lg object-contain group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                        />
                    )}
                    <span className="text-[10px] text-white/50 text-center leading-tight line-clamp-2">
                        {badge.title || badge.name}
                    </span>
                    {badge.date && (
                        <span className="text-[9px] text-white/25">{badge.date}</span>
                    )}

                    {/* Glow on hover */}
                    <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ boxShadow: `inset 0 0 20px ${platformColor}15, 0 0 15px ${platformColor}08` }}
                    />
                </motion.div>
            ))}
            {badges.length > 12 && (
                <div className="flex items-center justify-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white/30 text-xs">
                    +{badges.length - 12} more
                </div>
            )}
        </div>
    )
}

// ─── Loading Skeleton ───────────────────────────────────────────────────────────
function DashboardSkeleton() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Tabs skeleton */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-14 w-40 rounded-xl bg-white/[0.04] flex-shrink-0" />
                ))}
            </div>
            {/* Content skeleton */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="h-6 w-32 bg-white/[0.06] rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-white/[0.04] rounded-xl" />
                        ))}
                    </div>
                </div>
                <div className="h-64 bg-white/[0.04] rounded-xl flex items-center justify-center">
                    <div className="w-44 h-44 rounded-full bg-white/[0.03]" />
                </div>
            </div>
            {/* Badges skeleton */}
            <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="h-24 bg-white/[0.03] rounded-xl" />
                ))}
            </div>
        </div>
    )
}

// ─── Platform-Specific Dashboard Content ────────────────────────────────────────
function LeetCodeDashboard({ data }: { data: PlatformData }) {
    const s = data.stats
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatedStat value={s.totalSolved || 0} label="Total Solved" color="#FFA116" />
                <AnimatedStat value={s.easySolved || 0} label="Easy" color="#00b8a3" />
                <AnimatedStat value={s.mediumSolved || 0} label="Medium" color="#ffc01e" />
                <AnimatedStat value={s.hardSolved || 0} label="Hard" color="#ff375f" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="flex justify-center">
                    <RadialChart data={data.charts?.difficulty || []} />
                </div>
                <div className="space-y-4">
                    {s.contestRating && (
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Contest Rating</div>
                            <div className="text-2xl font-bold font-syne text-amber-400">{s.contestRating}</div>
                        </div>
                    )}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Submissions</div>
                        <div className="text-2xl font-bold font-syne text-white">{s.totalSubmissions || 0}</div>
                    </div>
                    {s.contestsAttended > 0 && (
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Contests</div>
                            <div className="text-2xl font-bold font-syne text-white">{s.contestsAttended}</div>
                        </div>
                    )}
                    {s.ranking && s.ranking < 5000000 && (
                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">Global Ranking</div>
                            <div className="text-2xl font-bold font-syne text-white">#{s.ranking?.toLocaleString()}</div>
                        </div>
                    )}
                </div>
            </div>

            {data.badges && data.badges.length > 0 && (
                <div>
                    <h4 className="text-xs text-white/40 uppercase tracking-wider mb-4">Badges</h4>
                    <BadgeGrid badges={data.badges} platformColor="#FFA116" />
                </div>
            )}
        </div>
    )
}

function CodeChefDashboard({ data }: { data: PlatformData }) {
    const s = data.stats
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="col-span-2 md:col-span-1 flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-xs text-white/40 uppercase tracking-wider">Current Rating</div>
                    <div className="text-5xl font-bold font-syne text-amber-400">{s.currentRating || 1000}</div>
                    <StarRating count={s.stars || 1} />
                    {s.division && (
                        <span className="text-xs text-white/30 bg-white/[0.04] px-3 py-1 rounded-full">{s.division}</span>
                    )}
                </div>
                <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-xs text-white/40 uppercase tracking-wider">Highest Rating</div>
                    <div className="text-3xl font-bold font-syne text-white">{s.highestRating || 1000}</div>
                </div>
                <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-xs text-white/40 uppercase tracking-wider">Global Rank</div>
                    <div className="text-xl font-bold font-syne text-white">{s.globalRank || 'N/A'}</div>
                    <div className="text-xs text-white/30">Country: {s.countryRank || 'N/A'}</div>
                </div>
            </div>

            {data.ratingHistory && data.ratingHistory.length > 0 && (
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <h4 className="text-xs text-white/40 uppercase tracking-wider mb-4">Rating Progress</h4>
                    <div className="h-40 flex items-end gap-1">
                        {data.ratingHistory.slice(-20).map((entry: any, i: number) => {
                            const max = Math.max(...data.ratingHistory!.map((e: any) => e.rating), 1500)
                            const height = ((entry.rating || 0) / max) * 100
                            return (
                                <motion.div
                                    key={i}
                                    className="flex-1 rounded-t bg-amber-500/60 hover:bg-amber-400/80 transition-colors relative group"
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${height}%` }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.03, duration: 0.5 }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        {entry.rating}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

function HackerRankDashboard({ data }: { data: PlatformData }) {
    const s = data.stats
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Level</div>
                    <div className="text-4xl font-bold font-syne text-emerald-400">{s.level || 1}</div>
                </div>
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Country</div>
                    <div className="text-lg font-bold font-syne text-white">{s.country || 'N/A'}</div>
                </div>
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Followers</div>
                    <div className="text-2xl font-bold font-syne text-white">{s.followersCount || 0}</div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                    <h4 className="text-xs text-white/40 uppercase tracking-wider mb-4">Skill Breakdown</h4>
                    <RadarChart skills={data.charts?.skills || []} />
                </div>
                <div>
                    <h4 className="text-xs text-white/40 uppercase tracking-wider mb-4">Badges</h4>
                    {data.badges && data.badges.length > 0 ? (
                        <div className="space-y-3">
                            {data.badges.map((badge: any, i: number) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: badge.stars || 0 }, (_, j) => (
                                                <span key={j} className="text-emerald-400 text-sm">★</span>
                                            ))}
                                            {Array.from({ length: (badge.totalChallenges ? 5 : 5) - (badge.stars || 0) }, (_, j) => (
                                                <span key={j} className="text-white/10 text-sm">★</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-white">{badge.name}</div>
                                        <div className="text-xs text-white/30">{badge.categoryName}</div>
                                    </div>
                                    <div className="text-xs text-white/40">
                                        {badge.solved}/{badge.totalChallenges}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-white/30 text-sm py-8 text-center">No badges yet</div>
                    )}
                </div>
            </div>
        </div>
    )
}

function GoogleSkillsDashboard({ data }: { data: PlatformData }) {
    const s = data.stats
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Total Badges</div>
                    <AnimatedStat value={s.totalBadges || 0} label="" color="#4285F4" />
                </div>
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Points</div>
                    <AnimatedStat value={s.points || 0} label="" color="#FBBC04" />
                </div>
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">League</div>
                    <div className="text-lg font-bold font-syne text-white">{s.league || 'N/A'}</div>
                </div>
                <div className="p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
                    <div className="text-xs text-white/40 uppercase tracking-wider mb-2">Member Since</div>
                    <div className="text-2xl font-bold font-syne text-white">{s.memberSince || 'N/A'}</div>
                </div>
            </div>

            <div>
                <h4 className="text-xs text-white/40 uppercase tracking-wider mb-4">Earned Badges</h4>
                <BadgeGrid badges={data.badges || []} platformColor="#4285F4" />
            </div>
        </div>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function Achievements({ achievements }: AchievementsProps) {
    const [activePlatform, setActivePlatform] = useState<typeof PLATFORMS[number]['key']>('leetcode')
    const [data, setData] = useState<AchievementsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/achievements')
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const json = await res.json()
            setData(json)
        } catch (err) {
            console.error('[achievements] Fetch failed:', err)
            setError('Failed to load live stats. Showing cached data.')
            // Try to load from seed data as last resort
            try {
                const fallback = await import('@/data/achievements-fallback.json')
                setData(fallback.default as any)
            } catch {
                setError('Failed to load statistics.')
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const activePlatformConfig = PLATFORMS.find(p => p.key === activePlatform)!
    const platformData = data ? data[activePlatform] : null

    return (
        <section id="achievements" className="bg-black py-32 border-t border-white/[0.06] relative overflow-hidden">
            {/* Background glow effect */}
            <div
                className="absolute inset-0 pointer-events-none transition-all duration-1000"
                style={{
                    background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${activePlatformConfig.glowColor}08 0%, transparent 70%)`,
                }}
            />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: '-100px' }}
                        className="font-syne text-sm font-bold text-white/40 uppercase tracking-widest mb-4"
                    >
                        Coding Profiles
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, margin: '-100px' }}
                        transition={{ delay: 0.1 }}
                        className="text-white/30 text-sm max-w-lg"
                    >
                        Live statistics from competitive programming platforms, updated daily.
                    </motion.p>
                </div>

                {/* Platform Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: '-100px' }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-3 mb-12 overflow-x-auto pb-2 scrollbar-none -mx-6 px-6"
                >
                    {PLATFORMS.map(platform => {
                        const isActive = activePlatform === platform.key
                        return (
                            <motion.button
                                key={platform.key}
                                onClick={() => setActivePlatform(platform.key)}
                                className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl font-syne text-sm font-medium transition-all duration-300 flex-shrink-0 border ${
                                    isActive
                                        ? 'bg-white/[0.08] border-white/15 text-white'
                                        : 'bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:bg-white/[0.04]'
                                }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <span style={{ color: isActive ? platform.color : undefined }}>
                                    {platform.icon}
                                </span>
                                <span>{platform.label}</span>

                                {/* Active indicator glow */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 rounded-2xl pointer-events-none"
                                        style={{
                                            boxShadow: `0 0 20px ${platform.glowColor}, inset 0 0 20px ${platform.glowColor}15`,
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}
                            </motion.button>
                        )
                    })}
                </motion.div>

                {/* Dashboard Content */}
                <div className="min-h-[400px]">
                    {loading ? (
                        <DashboardSkeleton />
                    ) : error && !data ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 gap-4"
                        >
                            <AlertTriangle className="w-10 h-10 text-amber-500/60" />
                            <p className="text-white/40 text-sm text-center max-w-sm">{error}</p>
                            <button
                                onClick={fetchData}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-colors"
                            >
                                <RefreshCw className="w-3.5 h-3.5" /> Try Again
                            </button>
                        </motion.div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activePlatform}
                                initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
                                transition={{ duration: 0.35 }}
                            >
                                {/* Top bar: Last Updated + Profile Link */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-2 text-xs text-white/25">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
                                        Last updated: {platformData?.lastUpdated
                                            ? new Date(platformData.lastUpdated).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })
                                            : 'N/A'
                                        }
                                        {platformData?._fallback && (
                                            <span className="text-amber-500/50 ml-1">(cached)</span>
                                        )}
                                    </div>
                                    {platformData?.profileUrl && (
                                        <a
                                            href={platformData.profileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors group"
                                        >
                                            View Profile
                                            <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    )}
                                </div>

                                {/* Platform-specific dashboard */}
                                {platformData && activePlatform === 'leetcode' && <LeetCodeDashboard data={platformData} />}
                                {platformData && activePlatform === 'codechef' && <CodeChefDashboard data={platformData} />}
                                {platformData && activePlatform === 'hackerrank' && <HackerRankDashboard data={platformData} />}
                                {platformData && activePlatform === 'googleSkills' && <GoogleSkillsDashboard data={platformData} />}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Original Sanity Achievements (Honors & Key Recognitions) */}
                {achievements && achievements.length > 0 && (
                    <div className="mt-32 border-t border-white/[0.06] pt-16">
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: '-100px' }}
                            className="font-syne text-sm font-bold text-white/40 uppercase tracking-widest mb-12"
                        >
                            Honors & Key Recognitions
                        </motion.h3>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {achievements.map((achievement, index) => (
                                <motion.div
                                    key={achievement._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: false, margin: '-100px' }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative p-8 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden hover:bg-white/[0.06] transition-all duration-500 hover:scale-[1.02]"
                                >
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                                        <Trophy className="w-16 h-16 text-white" />
                                    </div>

                                    <div className="relative z-10">
                                        <span className="inline-block px-3 py-1 mb-6 text-xs font-mono text-white/60 border border-white/10 rounded-full bg-black/20">
                                            {new Date(achievement.date).getFullYear()}
                                        </span>

                                        <h4 className="text-xl font-bold text-white mb-3 font-syne leading-tight group-hover:text-white/90 transition-colors">
                                            {achievement.title}
                                        </h4>

                                        <p className="text-white/40 text-sm leading-relaxed group-hover:text-white/60 transition-colors duration-500">
                                            {achievement.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}
