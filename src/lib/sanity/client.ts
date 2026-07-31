import { createClient, type QueryParams } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'honeybeepower'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const apiVersion = '2024-01-01'

/**
 * Read-only client — uses CDN for fast, cached reads.
 * Use this for all data fetching in Server Components.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

/**
 * Server-only client — uses the API token for authenticated requests
 * (e.g. creating reviews, reading draft content, mutations).
 * Never expose this to the browser.
 */
export const sanityServerClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'published',
})

/**
 * ISR-aware fetch helper for Server Components.
 * Wraps `sanityClient.fetch` with `next.revalidate` support so
 * Next.js can cache and revalidate responses at the segment level.
 *
 * @param query  - GROQ query string
 * @param params - GROQ parameters (optional)
 * @param revalidate - seconds until revalidation (default 60)
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  revalidate: number = 60,
): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: { revalidate },
  })
}
