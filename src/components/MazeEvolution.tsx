'use client'

import { useEffect, useRef, useState } from 'react'
import {
  makeMaze, run, fitness, randomGenome, nextGeneration, GENOME_FACTOR,
  type Maze, type RunResult,
} from '@/lib/mazeEvolution'

const POPULATION = 40
const STEPS_PER_SEC = 45
const PAUSE_SEC = 0.6 // hold the finished generation briefly before evolving
const MAX_GENERATIONS = 40
const GENERATIONS_AFTER_SOLVE = 3 // keep evolving (shorter paths) before a new maze
const ACCENT = 'rgba(96, 165, 250, '

type Status = { gen: number; best: number; solved: boolean }

// Hero background: a population of agents evolving (genetic algorithm) through a maze.
// Decorative only: hidden from assistive tech, paused off-screen, static for reduced motion.
export default function MazeEvolution() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [status, setStatus] = useState<Status>({ gen: 1, best: 0, solved: false })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const rand = Math.random

    let w = 0, h = 0, cell = 0, oy = 0
    let maze: Maze, genomeLength = 0, genomes: Uint8Array[] = [], results: RunResult[] = []
    let gen = 0, solvedGen = -1, longest = 0, bestPath: number[] | null = null
    let elapsed = 0, last = 0, raf = 0, onScreen = true

    const center = (c: number) => [((c % maze.cols) + 0.5) * cell, oy + (((c / maze.cols) | 0) + 0.5) * cell]

    function evaluate() {
      results = genomes.map((g) => run(maze, g))
      longest = Math.max(...results.map((r) => r.path.length))
      elapsed = 0
    }

    function setup() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas!.clientWidth
      h = canvas!.clientHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.max(12, Math.min(40, Math.round(w / 40)))
      cell = w / cols
      const rows = Math.max(8, Math.floor(h / cell))
      oy = (h - rows * cell) / 2
      maze = makeMaze(cols, rows, rand)
      genomeLength = Math.ceil(maze.dist[maze.start] * GENOME_FACTOR)
      genomes = Array.from({ length: POPULATION }, () => randomGenome(genomeLength, rand))
      gen = 0
      solvedGen = -1
      bestPath = null
      evaluate()
    }

    // Score the generation that just ran, then breed the next one (or start a new maze).
    function advance() {
      const scores = results.map((r) => fitness(r, genomeLength))
      const best = results[scores.indexOf(Math.max(...scores))]
      bestPath = best.path
      const solved = best.reachedAt > 0
      if (solved && solvedGen < 0) solvedGen = gen
      setStatus({ gen: gen + 1, best: Math.round(best.progress * 100), solved })
      if ((solvedGen >= 0 && gen - solvedGen >= GENERATIONS_AFTER_SOLVE) || gen >= MAX_GENERATIONS) {
        setup()
        return
      }
      genomes = nextGeneration(genomes, scores, rand)
      gen++
      evaluate()
    }

    function drawPath(path: number[], style: string, width: number) {
      ctx!.strokeStyle = style
      ctx!.lineWidth = width
      ctx!.beginPath()
      path.forEach((c, i) => {
        const [x, y] = center(c)
        if (i) ctx!.lineTo(x, y)
        else ctx!.moveTo(x, y)
      })
      ctx!.stroke()
    }

    function draw(steps: number) {
      ctx!.clearRect(0, 0, w, h)
      // walls: each cell's north/west sides, plus the outer south/east border
      ctx!.strokeStyle = 'rgba(255, 255, 255, 0.10)'
      ctx!.lineWidth = 1
      ctx!.beginPath()
      for (let c = 0; c < maze.cols * maze.rows; c++) {
        const col = c % maze.cols, row = (c / maze.cols) | 0
        const x = col * cell, y = oy + row * cell
        const wl = maze.walls[c]
        if (wl & 1) { ctx!.moveTo(x, y); ctx!.lineTo(x + cell, y) }
        if (wl & 8) { ctx!.moveTo(x, y); ctx!.lineTo(x, y + cell) }
        if (wl & 4 && row === maze.rows - 1) { ctx!.moveTo(x, y + cell); ctx!.lineTo(x + cell, y + cell) }
        if (wl & 2 && col === maze.cols - 1) { ctx!.moveTo(x + cell, y); ctx!.lineTo(x + cell, y + cell) }
      }
      ctx!.stroke()

      if (bestPath) drawPath(bestPath, ACCENT + '0.5)', 2)

      const [gx, gy] = center(maze.goal)
      ctx!.strokeStyle = ACCENT + '0.8)'
      ctx!.lineWidth = 1.5
      ctx!.beginPath()
      ctx!.arc(gx, gy, cell * 0.28, 0, Math.PI * 2)
      ctx!.stroke()

      for (const r of results) {
        const i = Math.min(steps, r.path.length - 1)
        const a = Math.floor(i), f = i - a
        const [x1, y1] = center(r.path[a])
        const [x2, y2] = center(r.path[Math.min(a + 1, r.path.length - 1)])
        const reached = r.reachedAt > 0 && i >= r.path.length - 1
        ctx!.fillStyle = reached ? ACCENT + '0.95)' : 'rgba(255, 255, 255, 0.55)'
        ctx!.beginPath()
        ctx!.arc(x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, reached ? 3 : 2, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function frame(now: number) {
      elapsed += Math.min(now - last, 50) / 1000 // clamp so a stalled tab doesn't skip a generation
      last = now
      const steps = elapsed * STEPS_PER_SEC
      draw(steps)
      if (steps > longest + PAUSE_SEC * STEPS_PER_SEC) advance()
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (raf || reduceMotion || !onScreen || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }

    function staticFrame() {
      // Reduced motion: evolve off-screen until solved (bounded) and show the result once.
      setup()
      for (let i = 0; i < MAX_GENERATIONS && solvedGen < 0; i++) advance()
      draw(Infinity)
    }

    if (reduceMotion) staticFrame()
    else setup()
    start()

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      if (onScreen) start()
      else stop()
    })
    io.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)

    let resizeTimer: ReturnType<typeof setTimeout>
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => (reduceMotion ? staticFrame() : setup()), 200)
    })
    ro.observe(canvas)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      clearTimeout(resizeTimer)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          maskImage: 'radial-gradient(ellipse 50% 42% at 50% 45%, rgba(0,0,0,0.12), #000 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 50% 42% at 50% 45%, rgba(0,0,0,0.12), #000 80%)',
        }}
      />
      <p className="hidden md:block absolute z-20 bottom-8 left-6 md:left-12 font-mono text-[11px] tracking-wider text-white/50">
        genetic algorithm · gen {status.gen} · {status.solved ? 'maze solved' : status.best ? `best ${status.best}%` : 'exploring'}
      </p>
    </div>
  )
}
