// Genetic algorithm that evolves move sequences through a grid maze.
// Pure logic (no DOM) so it can be tested; drawn by components/MazeEvolution.tsx.

export type Maze = {
  cols: number
  rows: number
  walls: Uint8Array // per cell, bit set = wall on that side (see DIRS)
  start: number
  goal: number
  dist: Int32Array // BFS steps from each cell to the goal
}

export type RunResult = { path: number[]; progress: number; reachedAt: number }

// [dx, dy, wall bit, opposite wall bit] for N, E, S, W
export const DIRS = [
  [0, -1, 1, 4],
  [1, 0, 2, 8],
  [0, 1, 4, 1],
  [-1, 0, 8, 2],
] as const

export function seededRandom(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Tuned so a 36x20 maze is usually solved in ~2-20 generations: slow enough to watch it learn.
export const LOOP_FRACTION = 0.08
export const GENOME_FACTOR = 1.3 // move budget relative to the shortest path

export function makeMaze(cols: number, rows: number, rand: () => number, loopFraction = LOOP_FRACTION): Maze {
  const n = cols * rows
  const walls = new Uint8Array(n).fill(15)
  const seen = new Uint8Array(n)
  const stack = [0]
  seen[0] = 1
  // Recursive-backtracker carving gives a perfect maze...
  while (stack.length) {
    const c = stack[stack.length - 1]
    const x = c % cols, y = (c / cols) | 0
    const options = DIRS.map((d, i) => [x + d[0], y + d[1], i] as const)
      .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < cols && ny < rows && !seen[ny * cols + nx])
    if (!options.length) { stack.pop(); continue }
    const [nx, ny, i] = options[(rand() * options.length) | 0]
    const nc = ny * cols + nx
    walls[c] &= ~DIRS[i][2]
    walls[nc] &= ~DIRS[i][3]
    seen[nc] = 1
    stack.push(nc)
  }
  // ...then knocking out a few extra walls adds loops, so paths are shorter and less linear.
  for (let k = 0; k < n * loopFraction; k++) {
    const c = (rand() * n) | 0
    const i = (rand() * 4) | 0
    const nx = (c % cols) + DIRS[i][0], ny = ((c / cols) | 0) + DIRS[i][1]
    if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
    walls[c] &= ~DIRS[i][2]
    walls[ny * cols + nx] &= ~DIRS[i][3]
  }
  const mid = rows >> 1
  const start = mid * cols
  const goal = mid * cols + cols - 1
  return { cols, rows, walls, start, goal, dist: distancesTo(goal, cols, rows, walls) }
}

function distancesTo(goal: number, cols: number, rows: number, walls: Uint8Array) {
  const dist = new Int32Array(cols * rows).fill(-1)
  const queue = [goal]
  dist[goal] = 0
  for (let q = 0; q < queue.length; q++) {
    const c = queue[q]
    for (let i = 0; i < 4; i++) {
      if (walls[c] & DIRS[i][2]) continue
      const nc = c + DIRS[i][0] + DIRS[i][1] * cols
      if (dist[nc] === -1) { dist[nc] = dist[c] + 1; queue.push(nc) }
    }
  }
  return dist
}

export function move(maze: Maze, cell: number, dir: number) {
  return maze.walls[cell] & DIRS[dir][2] ? cell : cell + DIRS[dir][0] + DIRS[dir][1] * maze.cols
}

// A gene is a preferred direction. If it is blocked (or would turn straight back),
// the walker tries the next directions clockwise and only reverses at a dead end,
// so every gene moves the agent and evolution only has to learn the junctions.
export function chooseDir(maze: Maze, cell: number, gene: number, lastDir: number) {
  const back = lastDir < 0 ? -1 : (lastDir + 2) % 4
  for (let k = 0; k < 4; k++) {
    const d = (gene + k) % 4
    if (d !== back && !(maze.walls[cell] & DIRS[d][2])) return d
  }
  return back
}

export function run(maze: Maze, genome: Uint8Array): RunResult {
  const path = [maze.start]
  let cell = maze.start, best = maze.dist[cell], reachedAt = -1, lastDir = -1
  for (let t = 0; t < genome.length && reachedAt < 0; t++) {
    lastDir = chooseDir(maze, cell, genome[t], lastDir)
    cell = move(maze, cell, lastDir)
    path.push(cell)
    best = Math.min(best, maze.dist[cell])
    if (cell === maze.goal) reachedAt = t + 1
  }
  return { path, progress: 1 - best / maze.dist[maze.start], reachedAt }
}

export function fitness(r: RunResult, genomeLength: number) {
  // Reaching the goal beats any partial run; faster arrivals score higher.
  return r.reachedAt > 0 ? 2 + (genomeLength - r.reachedAt) / genomeLength : r.progress ** 4
}

export function randomGenome(length: number, rand: () => number) {
  return Uint8Array.from({ length }, () => (rand() * 4) | 0)
}

export function nextGeneration(genomes: Uint8Array[], scores: number[], rand: () => number, mutation = 0.03) {
  const order = scores.map((s, i) => [s, i]).sort((a, b) => b[0] - a[0]).map(([, i]) => i)
  const pick = () => { // tournament of 3
    let best = (rand() * genomes.length) | 0
    for (let k = 0; k < 2; k++) {
      const c = (rand() * genomes.length) | 0
      if (scores[c] > scores[best]) best = c
    }
    return genomes[best]
  }
  const next = [genomes[order[0]], genomes[order[1]]] // elitism keeps the best two unchanged
  while (next.length < genomes.length) {
    const a = pick(), b = pick()
    const cut = (rand() * a.length) | 0
    const child = new Uint8Array(a.length)
    for (let g = 0; g < a.length; g++) {
      child[g] = rand() < mutation ? (rand() * 4) | 0 : g < cut ? a[g] : b[g]
    }
    next.push(child)
  }
  return next
}
