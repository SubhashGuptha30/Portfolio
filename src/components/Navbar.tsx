'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
    { name: 'Home', href: '#hero', desktop: false },
    { name: 'About', href: '#about', desktop: true },
    { name: 'Skills', href: '#skills', desktop: true },
    { name: 'Work', href: '#projects', desktop: true },
    { name: 'Achievements', href: '#achievements', desktop: true },
    { name: 'Experience', href: '#experience', desktop: true },
    { name: 'Certifications', href: '#certifications', desktop: false },
    { name: 'Contact', href: '#contact', desktop: true },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <>
            {/* Desktop Navigation Bar */}
            <header
                className={`hidden md:block fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/70 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}
            >
                <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="#hero" className="font-syne text-lg font-bold text-white tracking-tight">
                        Subhash Guptha
                    </Link>
                    <ul className="flex items-center gap-8">
                        {navLinks.filter((link) => link.desktop).map((link) => (
                            <li key={link.name}>
                                <Link
                                    href={link.href}
                                    className="text-sm text-white/70 hover:text-white transition-colors"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            {/* Floating Toggle Button (mobile) */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`md:hidden fixed top-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-300 mix-blend-difference ${isOpen ? 'bg-transparent text-white' : 'bg-white text-black hover:scale-110'
                    }`}
                aria-label="Toggle Menu"
            >
                <div className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5">
                    <motion.span
                        animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                        className="w-full h-0.5 bg-current origin-center transition-transform"
                    />
                    <motion.span
                        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                        className="w-full h-0.5 bg-current transition-opacity"
                    />
                    <motion.span
                        animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                        className="w-full h-0.5 bg-current origin-center transition-transform"
                    />
                </div>
            </motion.button>

            {/* Full Screen Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="md:hidden fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
                    >
                        <nav className="flex flex-col items-center gap-6">
                            {navLinks.map((link, index) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 50, opacity: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="font-syne text-3xl md:text-5xl font-bold text-transparent text-stroke hover:text-white transition-colors duration-300 uppercase tracking-tighter"
                                        data-text={link.name}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </nav>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-12 text-white/60 text-sm tracking-widest uppercase"
                        >
                            Subhash Guptha © {new Date().getFullYear()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
