'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, X } from 'lucide-react'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import { Certification } from '@/types/sanity'

interface CertificationsProps {
    certifications: Certification[]
}

export default function Certifications({ certifications }: CertificationsProps) {
    const [selectedCert, setSelectedCert] = useState<Certification | null>(null)

    if (!certifications || certifications.length === 0) return null

    return (
        <section id="certifications" className="bg-black py-32 border-t border-white/10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-16 md:gap-32 mb-20">
                    <div className="md:w-1/3">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            className="font-syne text-sm font-bold text-white/40 uppercase tracking-widest mb-4"
                        >
                            Certifications
                        </motion.h2>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certifications.map((cert, index) => (
                        <motion.div
                            key={cert._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{ delay: index * 0.1 }}
                            className="group cursor-pointer relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-[1.02]"
                            onClick={() => setSelectedCert(cert)}
                        >
                            <div className="relative aspect-[4/3] overflow-hidden">
                                {cert.certificateImage && (
                                    <Image
                                        src={urlFor(cert.certificateImage).url()}
                                        alt={cert.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                                <div className="absolute top-4 right-4 w-10 h-10 bg-white text-black flex items-center justify-center rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-white mb-3 font-syne leading-tight group-hover:text-white/90 transition-colors">
                                    {cert.title}
                                </h3>
                                <div className="flex items-center justify-between text-white/40 text-sm font-mono">
                                    <span>{cert.provider}</span>
                                    <span>{new Date(cert.issueDate).getFullYear()}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Certificate Modal */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
                        onClick={() => setSelectedCert(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start p-6 border-b border-white/5">
                                <div>
                                    <h3 className="text-2xl font-bold text-white font-syne mb-1">{selectedCert.title}</h3>
                                    <p className="text-white/40 font-mono text-sm">{selectedCert.provider} • {new Date(selectedCert.issueDate).getFullYear()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedCert(null)}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all duration-300"
                                    aria-label="Close Certification Details"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="relative flex-1 bg-black/50 p-4 md:p-6 overflow-y-auto">
                                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/5">
                                    {selectedCert.certificateImage && (
                                        <Image
                                            src={urlFor(selectedCert.certificateImage).url()}
                                            alt={selectedCert.title}
                                            fill
                                            sizes="100vw"
                                            className="object-contain"
                                        />
                                    )}
                                </div>

                                {selectedCert.verificationUrl && (
                                    <div className="mt-6 text-center pb-2">
                                        <a
                                            href={selectedCert.verificationUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm rounded-full hover:scale-105 transition-transform duration-300"
                                        >
                                            Verify Credential <ArrowUpRight size={16} />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
