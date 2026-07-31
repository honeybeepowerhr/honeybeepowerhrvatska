import { defineField, defineType } from 'sanity'

/**
 * FAQ schema (standalone document)
 * Requirements: 15.6
 *
 * Multilingual fields: question, answer
 */
export const faqType = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    // ── Question (multilingual) ─────────────────────────────────────────────
    defineField({
      name: 'question',
      title: 'Question',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'HR', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'en', title: 'EN', type: 'string' }),
        defineField({ name: 'de', title: 'DE', type: 'string' }),
        defineField({ name: 'sl', title: 'SL', type: 'string' }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ── Answer (multilingual) ───────────────────────────────────────────────
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'object',
      fields: [
        defineField({ name: 'hr', title: 'HR', type: 'text', rows: 4, validation: (Rule) => Rule.required() }),
        defineField({ name: 'en', title: 'EN', type: 'text', rows: 4 }),
        defineField({ name: 'de', title: 'DE', type: 'text', rows: 4 }),
        defineField({ name: 'sl', title: 'SL', type: 'text', rows: 4 }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ── Category ────────────────────────────────────────────────────────────
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      description: 'Optional grouping label (e.g. "shipping", "product", "payment")',
    }),
  ],

  preview: {
    select: {
      title: 'question.hr',
      subtitle: 'category',
    },
  },
})
