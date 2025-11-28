'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ArrowUpRight, X, Github, ExternalLink } from 'lucide-react'
import { Project } from '@/types/sanity'

interface ProjectsProps {
    projects: Project[]
}

const ProjectItem = ({ project, index, onSelect }: { project: Project; index: number; onSelect: (project: Project) => void }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: false, margin: "-100px" }}
            className="group relative border-t border-white/10 py-12 md:py-24 transition-colors hover:bg-white/5"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex-1">
                    <h3 className="font-syne text-4xl md:text-6xl font-bold text-white mb-4 group-hover:translate-x-4 transition-transform duration-500">
                        {project.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies?.map((tech) => (
                            <span key={tech} className="text-sm text-white/40 uppercase tracking-wider">
                                {tech}
                            </span>
                        ))}
                    </div>
                    <p className="text-white/60 max-w-xl text-lg font-light">
                        {project.shortDescription}
                    </p>
                </div>

                <div className="relative w-full md:w-[400px] aspect-video overflow-hidden rounded-lg cursor-pointer" onClick={() => onSelect(project)}>
                    <div className="absolute inset-0 bg-white/10 z-10 group-hover:opacity-0 transition-opacity duration-500" />
                    {project.thumbnailImage && (
                        <Image
                            src={urlFor(project.thumbnailImage).url()}
                            alt={project.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 400px"
                            className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <span className="px-6 py-3 bg-white text-black rounded-full font-bold text-sm tracking-widest uppercase">View Details</span>
                    </div>
                </div>

                <div className="md:w-24 flex justify-end">
                    <button
                        onClick={() => onSelect(project)}
                        className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500"
                        aria-label="View Project Details"
                    >
                        <ArrowUpRight size={24} className="transform group-hover:rotate-45 transition-transform duration-500" />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default function Projects({ projects }: ProjectsProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedProject) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [selectedProject])

    return (
        <section id="projects" className="bg-black py-32">
            <div className="container mx-auto px-6 mb-20">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: false, margin: "-100px" }}
                    className="font-syne text-sm font-bold text-white/40 uppercase tracking-widest mb-4"
                >
                    Selected Works
                </motion.h2>
            </div>

            <div className="flex flex-col">
                {projects?.map((project, index) => (
                    <ProjectItem
                        key={project._id}
                        project={project}
                        index={index}
                        onSelect={setSelectedProject}
                    />
                ))}
            </div>

            {/* Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-[#0a0a0a] w-full max-w-6xl h-[90vh] rounded-2xl overflow-hidden flex flex-col border border-white/10 shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-start bg-[#0a0a0a] z-10">
                                <div>
                                    <h3 className="font-syne text-3xl md:text-5xl font-bold text-white mb-2">
                                        {selectedProject.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.technologies?.map((tech) => (
                                            <span key={tech} className="text-xs text-white/40 border border-white/10 px-2 py-1 rounded-full uppercase tracking-wider">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="p-3 rounded-full bg-white/5 hover:bg-white hover:text-black transition-colors"
                                    aria-label="Close Project Details"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar" data-lenis-prevent>
                                <div className="p-6 md:p-8 space-y-12">

                                    {/* Description & Links */}
                                    <div className="grid md:grid-cols-3 gap-12">
                                        <div className="md:col-span-2">
                                            <h4 className="text-xl font-bold text-white mb-4 font-syne">About the Project</h4>
                                            <div className="prose prose-invert prose-lg text-white/70 leading-relaxed">
                                                <p>{selectedProject.longDescription || selectedProject.shortDescription}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <h4 className="text-xl font-bold text-white mb-4 font-syne">Links</h4>
                                            <div className="flex flex-col gap-4">
                                                {selectedProject.demoUrl && (
                                                    <a
                                                        href={selectedProject.demoUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-4 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform"
                                                    >
                                                        <span>Live Demo</span>
                                                        <ExternalLink size={20} />
                                                    </a>
                                                )}
                                                {selectedProject.codeUrl && (
                                                    <a
                                                        href={selectedProject.codeUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-4 rounded-xl bg-white/10 text-white border border-white/10 hover:bg-white hover:text-black transition-all"
                                                    >
                                                        <span>View Code</span>
                                                        <Github size={20} />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Media Gallery */}
                                    {selectedProject.demoMedia && selectedProject.demoMedia.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-8">
                                            <h4 className="text-xl font-bold text-white mb-4 font-syne">Gallery</h4>
                                            {selectedProject.demoMedia.map((media, idx) => (
                                                <div key={idx} className="rounded-xl overflow-hidden border border-white/5 bg-white/5 relative">
                                                    {media._type === 'image' ? (
                                                        <img
                                                            src={media.url}
                                                            alt={`${selectedProject.title} demo ${idx + 1}`}
                                                            className="w-full h-auto block"
                                                        />
                                                    ) : (
                                                        <video
                                                            src={media.url}
                                                            controls
                                                            className="w-full h-auto block"
                                                            poster={selectedProject.thumbnailImage ? urlFor(selectedProject.thumbnailImage).url() : undefined}
                                                        >
                                                            Your browser does not support the video tag.
                                                        </video>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // Fallback if no demo media, show thumbnail
                                        selectedProject.thumbnailImage && (
                                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/5">
                                                <Image
                                                    src={urlFor(selectedProject.thumbnailImage).url()}
                                                    alt={selectedProject.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
