'use client'

import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Loader() {
    const [progress, setProgress] = useState(0)

    // Smooth progress animation
    const springProgress = useSpring(0, { stiffness: 50, damping: 20 })
    const progressText = useTransform(springProgress, (latest) => Math.round(latest))

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                // Random increments for "loading" feel
                return Math.min(prev + Math.random() * 10, 100)
            })
        }, 150)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        springProgress.set(progress)
    }, [progress, springProgress])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617] overflow-hidden">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

            <div className="relative flex flex-col items-center justify-center w-full max-w-md p-8">

                {/* Main HUD Container */}
                <div className="relative w-64 h-64 flex items-center justify-center mb-12">

                    {/* Outer Ring - Slow Rotation */}
                    <motion.div
                        className="absolute inset-0 border border-slate-800/50 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-slate-700" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-slate-700" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-1 bg-slate-700" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-1 bg-slate-700" />
                    </motion.div>

                    {/* Middle Ring - Counter Rotation */}
                    <motion.div
                        className="absolute inset-4 border-2 border-dashed border-primary/20 rounded-full"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Inner Tech Ring - Fast Rotation */}
                    <motion.div
                        className="absolute inset-8 border-t-2 border-r-2 border-primary rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Core Pulse */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="w-24 h-24 bg-primary/10 rounded-full backdrop-blur-md border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb),0.2)]"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="w-12 h-12 bg-primary rounded-full blur-xl opacity-50" />
                        </motion.div>
                    </div>

                    {/* Percentage Display */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <span className="text-4xl font-bold font-mono text-white tracking-tighter flex items-baseline">
                            <motion.span>{progressText}</motion.span>
                            <span className="text-lg text-primary">%</span>
                        </span>
                    </div>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full max-w-xs relative">
                    <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
                        <span>SYSTEM INITIALIZATION</span>
                        <span className="animate-pulse text-primary">LOADING_MODULES...</span>
                    </div>

                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary via-cyan-400 to-primary relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite]" />
                        </motion.div>
                    </div>

                    {/* Glitch Text Effect */}
                    <div className="mt-4 text-center">
                        <motion.p
                            className="text-xs font-mono text-slate-600 tracking-[0.3em]"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse", repeatDelay: Math.random() * 2 }}
                        >
                            ESTABLISHING_CONNECTION
                        </motion.p>
                    </div>
                </div>

            </div>
        </div>
    )
}
