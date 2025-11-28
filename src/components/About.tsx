'use client'

import { motion } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

interface AboutProps {
    data: any
}

export default function About({ data }: AboutProps) {
    if (!data) return null

    return (
        <section id="about" className="bg-black py-32">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-12 md:gap-24 items-center justify-center">

                    {/* Left Column: Image */}
                    <div className="w-full md:w-5/12 relative flex justify-center">
                        {data.heroImage && (
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: false, margin: "-100px" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="w-full max-w-[400px]"
                            >
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
                                >
                                    <Image
                                        src={urlFor(data.heroImage).url()}
                                        alt="About Me"
                                        fill
                                        priority
                                        sizes="(max-width: 768px) 100vw, 400px"
                                        className="object-cover hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                                </motion.div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Content */}
                    <div className="md:w-1/2 flex flex-col justify-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            className="font-syne text-sm font-bold text-white/40 uppercase tracking-widest mb-8"
                        >
                            About Me
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight font-syne">
                                {data.role} based in India, passionate about AI and Automation.
                            </h3>

                            <div className="text-white/60 text-lg leading-relaxed space-y-6 mb-12">
                                <p>{data.aboutText}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-white font-bold mb-2">Education</h4>
                                    <p className="text-white/60 text-sm">BTech CSE–AI</p>
                                    <p className="text-white/40 text-sm">Amrita Vishwa Vidyapeetham</p>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-2">Interests</h4>
                                    <p className="text-white/60 text-sm">AI, Automation, Web Dev</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
