// Run: node --experimental-strip-types scripts/test-maze-evolution.ts
import assert from 'node:assert/strict'
import { GENOME_FACTOR, DIRS, makeMaze, move, run, fitness, randomGenome, nextGeneration, seededRandom } from '../src/lib/mazeEvolution.ts'

for (const seed of [1, 2, 3, 42, 99]) {
  const rand = seededRandom(seed)
  const maze = makeMaze(36, 20, rand)
  const { cols, rows, walls } = maze

  // every cell reachable from the goal, start is not the goal
  assert.ok(maze.dist.every((d) => d >= 0), 'maze is fully connected')
  assert.ok(maze.dist[maze.start] > 0)

  // walls are symmetric and the border is closed
  for (let c = 0; c < cols * rows; c++) {
    const x = c % cols, y = (c / cols) | 0
    DIRS.forEach(([dx, dy, bit, opp]) => {
      const nx = x + dx, ny = y + dy
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) assert.ok(walls[c] & bit, 'border closed')
      else assert.equal(!!(walls[c] & bit), !!(walls[ny * cols + nx] & opp), 'walls symmetric')
      // moving into a wall keeps you in place
      if (walls[c] & bit) assert.equal(move(maze, c, DIRS.findIndex((d) => d[2] === bit)), c)
    })
  }

  // the GA improves and eventually solves the maze
  const L = Math.ceil(maze.dist[maze.start] * GENOME_FACTOR)
  let genomes = Array.from({ length: 40 }, () => randomGenome(L, rand))
  let firstBest = -1, solvedAt = -1
  for (let gen = 0; gen < 400 && solvedAt < 0; gen++) {
    const results = genomes.map((g) => run(maze, g))
    const best = Math.max(...results.map((r) => r.progress))
    if (gen === 0) firstBest = best
    if (results.some((r) => r.reachedAt > 0)) solvedAt = gen
    genomes = nextGeneration(genomes, results.map((r) => fitness(r, L)), rand)
  }
  assert.ok(solvedAt >= 0, `seed ${seed}: solved within 400 generations`)
  console.log(`seed ${seed}: path ${maze.dist[maze.start]} steps, gen-0 best ${(firstBest * 100).toFixed(0)}%, solved at gen ${solvedAt}`)
}
console.log('all maze-evolution checks passed')
