import { defineArrayMember, defineField, defineType } from 'sanity'

/**
 * BlogPost schema
 * Requirements: 15.4
 *
 * Multilingual fields: title, seoTitle, seoDescription
 * Body: Portable Text (blocks + images)
 */
export const blogPostType = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    // ── Title (multilingual) ────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'HR', type: 'string' }),
        defineField({ name: 'en', title: 'EN', type: 'string' }),
        defineField({ name: 'de', title: 'DE', type: 'string' }),
        defineField({ name: 'sl', title: 'SL', type: 'string' }),
      ],
    }),

    // ── Slug ────────────────────────────────────────────────────────────────
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title.hr',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // ── Author ──────────────────────────────────────────────────────────────
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // ── Published At ────────────────────────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),

    // ── Category ────────────────────────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
    }),

    // ── Featured Image ──────────────────────────────────────────────────────
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
      ],
    }),

    // ── Body (Portable Text) ────────────────────────────────────────────────
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'URL',
                fields: [
                  defineField({ name: 'href', type: 'url', title: 'URL' }),
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }),
          ],
        }),
      ],
    }),

    // ── SEO Title (multilingual) ────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'HR', type: 'string', validation: (Rule) => Rule.max(60) }),
        defineField({ name: 'en', title: 'EN', type: 'string', validation: (Rule) => Rule.max(60) }),
        defineField({ name: 'de', title: 'DE', type: 'string', validation: (Rule) => Rule.max(60) }),
        defineField({ name: 'sl', title: 'SL', type: 'string', validation: (Rule) => Rule.max(60) }),
      ],
    }),

    // ── SEO Description (multilingual) ─────────────────────────────────────
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'HR', type: 'string', validation: (Rule) => Rule.max(155) }),
        defineField({ name: 'en', title: 'EN', type: 'string', validation: (Rule) => Rule.max(155) }),
        defineField({ name: 'de', title: 'DE', type: 'string', validation: (Rule) => Rule.max(155) }),
        defineField({ name: 'sl', title: 'SL', type: 'string', validation: (Rule) => Rule.max(155) }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title.hr',
      media: 'featuredImage',
      subtitle: 'publishedAt',
    },
  },
})
