import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Products } from '@/collections/Products'
import type { CollectionConfig } from 'payload'

describe('Products Collection', () => {
  let collection: CollectionConfig

  beforeEach(() => {
    collection = Products
  })

  it('has correct collection configuration', () => {
    expect(collection.slug).toBe('products')
    expect(collection.admin?.useAsTitle).toBe('title')
    expect(collection.admin?.defaultColumns).toEqual([
      'title',
      'collection',
      'price',
      'ecoScore',
      'updatedAt',
    ])
  })

  it('has correct access control', () => {
    expect(collection.access?.create).toBeDefined()
    expect(collection.access?.read).toBeDefined()
    expect(collection.access?.update).toBeDefined()
    expect(collection.access?.delete).toBeDefined()
  })

  describe('Fields validation', () => {
    it('has required title field', () => {
      const titleField = collection.fields.find(
        (field) => 'name' in field && field.name === 'title',
      )

      expect(titleField).toBeDefined()
      expect(titleField?.type).toBe('text')
      expect(titleField?.required).toBe(true)
    })

    it('has slug field with auto-generation hook', () => {
      const slugField = collection.fields.find((field) => 'name' in field && field.name === 'slug')

      expect(slugField).toBeDefined()
      expect(slugField?.type).toBe('text')
      expect(slugField?.required).toBe(true)
      expect(slugField?.unique).toBe(true)
      expect(slugField?.hooks?.beforeValidate).toBeDefined()
    })

    it('has collection field with correct options', () => {
      const collectionField = collection.fields.find(
        (field) => 'name' in field && field.name === 'collection',
      )

      expect(collectionField).toBeDefined()
      expect(collectionField?.type).toBe('select')
      expect(collectionField?.required).toBe(true)

      if (collectionField?.type === 'select') {
        expect(collectionField.options).toEqual([
          { label: 'TERRA Origin', value: 'origin' },
          { label: 'TERRA Move', value: 'move' },
          { label: 'TERRA Limited', value: 'limited' },
        ])
      }
    })

    it('has price field with correct validation', () => {
      const priceField = collection.fields.find(
        (field) => 'name' in field && field.name === 'price',
      )

      expect(priceField).toBeDefined()
      expect(priceField?.type).toBe('number')
      expect(priceField?.required).toBe(true)
    })

    it('has eco score field with validation', () => {
      const ecoScoreField = collection.fields.find(
        (field) => 'name' in field && field.name === 'ecoScore',
      )

      expect(ecoScoreField).toBeDefined()
      expect(ecoScoreField?.type).toBe('number')

      if (ecoScoreField?.type === 'number') {
        expect(ecoScoreField.min).toBe(0)
        expect(ecoScoreField.max).toBe(100)
      }
    })

    it('has colors array field', () => {
      const colorsField = collection.fields.find(
        (field) => 'name' in field && field.name === 'colors',
      )

      expect(colorsField).toBeDefined()
      expect(colorsField?.type).toBe('array')
      expect(colorsField?.required).toBe(true)

      if (colorsField?.type === 'array') {
        expect(colorsField.minRows).toBe(1)
        expect(colorsField.fields).toBeDefined()
      }
    })

    it('has sustainability group field', () => {
      const sustainabilityField = collection.fields.find(
        (field) => 'name' in field && field.name === 'sustainability',
      )

      expect(sustainabilityField).toBeDefined()
      expect(sustainabilityField?.type).toBe('group')

      if (sustainabilityField?.type === 'group') {
        expect(sustainabilityField.fields).toBeDefined()
        expect(sustainabilityField.fields.length).toBeGreaterThan(0)
      }
    })

    it('has gallery array field for images', () => {
      const galleryField = collection.fields.find(
        (field) => 'name' in field && field.name === 'gallery',
      )

      expect(galleryField).toBeDefined()
      expect(galleryField?.type).toBe('array')
      expect(galleryField?.required).toBe(true)

      if (galleryField?.type === 'array') {
        expect(galleryField.minRows).toBe(1)
      }
    })
  })

  describe('Slug generation hook', () => {
    it('generates slug from title when not provided', () => {
      const slugField = collection.fields.find(
        (field) => 'name' in field && field.name === 'slug',
      ) as any

      const hook = slugField?.hooks?.beforeValidate?.[0]

      expect(hook).toBeDefined()

      // Test hook function
      const result = hook({
        value: undefined,
        data: { title: 'TERRA Origin Stone White' },
      })

      expect(result).toBe('terra-origin-stone-white')
    })

    it('preserves existing slug value', () => {
      const slugField = collection.fields.find(
        (field) => 'name' in field && field.name === 'slug',
      ) as any

      const hook = slugField?.hooks?.beforeValidate?.[0]

      const result = hook({
        value: 'existing-slug',
        data: { title: 'TERRA Origin Stone White' },
      })

      expect(result).toBe('existing-slug')
    })

    it('handles special characters in title', () => {
      const slugField = collection.fields.find(
        (field) => 'name' in field && field.name === 'slug',
      ) as any

      const hook = slugField?.hooks?.beforeValidate?.[0]

      const result = hook({
        value: undefined,
        data: { title: 'TERRA Spécial & Unique!' },
      })

      expect(result).toBe('terra-special-unique')
    })

    it('handles empty title', () => {
      const slugField = collection.fields.find(
        (field) => 'name' in field && field.name === 'slug',
      ) as any

      const hook = slugField?.hooks?.beforeValidate?.[0]

      const result = hook({
        value: undefined,
        data: { title: '' },
      })

      expect(result).toBe('')
    })
  })

  describe('Field structure validation', () => {
    it('has correct colors array structure', () => {
      const colorsField = collection.fields.find(
        (field) => 'name' in field && field.name === 'colors',
      ) as any

      expect(colorsField?.fields).toBeDefined()

      const nameField = colorsField.fields.find((field: any) => field.name === 'name')
      const valueField = colorsField.fields.find((field: any) => field.name === 'value')
      const stockField = colorsField.fields.find((field: any) => field.name === 'stock')

      expect(nameField?.type).toBe('text')
      expect(nameField?.required).toBe(true)

      expect(valueField?.type).toBe('text')
      expect(valueField?.required).toBe(true)

      expect(stockField?.type).toBe('json')
    })

    it('has correct sustainability structure', () => {
      const sustainabilityField = collection.fields.find(
        (field) => 'name' in field && field.name === 'sustainability',
      ) as any

      const materialsField = sustainabilityField.fields.find(
        (field: any) => field.name === 'materials',
      )
      const carbonFootprintField = sustainabilityField.fields.find(
        (field: any) => field.name === 'carbonFootprint',
      )

      expect(materialsField?.type).toBe('array')
      expect(carbonFootprintField?.type).toBe('number')
    })

    it('has correct gallery structure', () => {
      const galleryField = collection.fields.find(
        (field) => 'name' in field && field.name === 'gallery',
      ) as any

      const imageField = galleryField.fields.find((field: any) => field.name === 'image')
      const altField = galleryField.fields.find((field: any) => field.name === 'alt')

      expect(imageField?.type).toBe('upload')
      expect(imageField?.relationTo).toBe('media')
      expect(altField?.type).toBe('text')
    })
  })

  describe('Validation rules', () => {
    it('validates eco score range', () => {
      const ecoScoreField = collection.fields.find(
        (field) => 'name' in field && field.name === 'ecoScore',
      ) as any

      expect(ecoScoreField?.min).toBe(0)
      expect(ecoScoreField?.max).toBe(100)
    })

    it('validates price is positive', () => {
      const priceField = collection.fields.find(
        (field) => 'name' in field && field.name === 'price',
      ) as any

      // Price should be positive (min 0)
      expect(priceField?.min).toBe(0)
    })

    it('requires minimum one color', () => {
      const colorsField = collection.fields.find(
        (field) => 'name' in field && field.name === 'colors',
      ) as any

      expect(colorsField?.minRows).toBe(1)
    })

    it('requires minimum one gallery image', () => {
      const galleryField = collection.fields.find(
        (field) => 'name' in field && field.name === 'gallery',
      ) as any

      expect(galleryField?.minRows).toBe(1)
    })
  })

  describe('Admin configuration', () => {
    it('groups fields correctly in admin', () => {
      // Check if sustainability field is in correct admin group
      const sustainabilityField = collection.fields.find(
        (field) => 'name' in field && field.name === 'sustainability',
      ) as any

      expect(sustainabilityField?.admin).toBeDefined()
    })

    it('has correct field descriptions', () => {
      const titleField = collection.fields.find(
        (field) => 'name' in field && field.name === 'title',
      ) as any

      const priceField = collection.fields.find(
        (field) => 'name' in field && field.name === 'price',
      ) as any

      expect(titleField?.admin?.description).toContain('produit')
      expect(priceField?.admin?.description).toContain('euros')
    })

    it('positions sidebar fields correctly', () => {
      const slugField = collection.fields.find(
        (field) => 'name' in field && field.name === 'slug',
      ) as any

      const collectionField = collection.fields.find(
        (field) => 'name' in field && field.name === 'collection',
      ) as any

      expect(slugField?.admin?.position).toBe('sidebar')
      expect(collectionField?.admin?.position).toBe('sidebar')
    })
  })
})
