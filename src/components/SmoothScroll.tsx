'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from 'lenis'
import { usePathname } from 'next/navigation'

export default function SmoothScroll({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const isStudio = pathname?.startsWith('/studio')

    useEffect(() => {
        if (isStudio) return

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [isStudio])

    return <>{children}</>
}
