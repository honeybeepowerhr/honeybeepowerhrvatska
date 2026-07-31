import { defineType, defineField } from 'sanity'

/**
 * Reusable object type for the full nutritional values table of a product.
 * Contains servingSize, per100g (NutritionalRow) and perServing (NutritionalRow).
 */
export const nutritionalTableType = defineType({
  name: 'nutritionalTable',
  title: 'Nutritivna tablica',
  type: 'object',
  fields: [
    defineField({
      name: 'servingSize',
      title: 'Veličina porcije',
      type: 'string',
      description: 'npr. "40g" ili "1 gel (40g)"',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'per100g',
      title: 'Na 100g',
      type: 'nutritionalRow',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'perServing',
      title: 'Po porciji',
      type: 'nutritionalRow',
      validation: (r) => r.required(),
    }),
  ],
})
