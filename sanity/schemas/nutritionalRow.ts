import { defineType, defineField } from 'sanity'

/**
 * Reusable object type for a single row in a nutritional values table.
 * Used within NutritionalTable (per100g and perServing).
 */
export const nutritionalRowType = defineType({
  name: 'nutritionalRow',
  title: 'Nutritivni red',
  type: 'object',
  fields: [
    defineField({ name: 'energyKj',      title: 'Energija (kJ)',           type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'energyKcal',    title: 'Energija (kcal)',         type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'carbohydrates', title: 'Ugljikohidrati (g)',      type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'sugars',        title: 'Šećeri (g)',              type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'protein',       title: 'Proteini (g)',            type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'fat',           title: 'Masti (g)',               type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'saturatedFat',  title: 'Zasićene masti (g)',      type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'salt',          title: 'Sol (g)',                 type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'sodium',        title: 'Natrij (mg)',             type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'caffeine',      title: 'Kofein (mg)',             type: 'number' }), // nullable
  ],
})
