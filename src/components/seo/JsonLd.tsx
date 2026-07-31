interface JsonLdProps {
  data?: Record<string, unknown>
  schema?: Record<string, unknown>
}

export function JsonLd({ data, schema }: JsonLdProps) {
  const content = schema || data
  if (!content) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(content) }}
    />
  )
}
