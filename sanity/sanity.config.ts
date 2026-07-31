import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  name: 'honey-bee-power-webshop',
  title: 'Honey Bee Power Webshop',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    // @sanity/vision can be added as a dev plugin once installed:
    // visionTool()
  ],
  schema: {
    types: schemaTypes,
  },
})
