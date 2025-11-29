import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schema'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '41nqleq3'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
    basePath: '/studio',
    name: 'Portfolio_Studio',
    title: 'Portfolio Studio',
    projectId,
    dataset,
    plugins: [structureTool(), visionTool()],
    schema: {
        types: schemaTypes,
    },
})
