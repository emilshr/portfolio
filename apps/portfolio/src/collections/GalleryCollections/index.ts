import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidateDelete, revalidateGalleryCollection } from './hooks/revalidateGalleryCollection'
import { validateGalleryFolder } from './hooks/validateGalleryFolder'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const GalleryCollections: CollectionConfig = {
  slug: 'gallery-collections',
  labels: {
    singular: 'Gallery Collection',
    plural: 'Gallery Collections',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    excerpt: true,
    coverImage: true,
    publishedAt: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'publishedAt', 'updatedAt'],
    group: 'Journeys',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 200,
      admin: {
        description: 'Short description shown on the gallery listing card.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Optional cover for listing cards and detail hero. Leave empty to use the first image in the collection.',
              },
              filterOptions: async ({ req }) => {
                const settings = await req.payload.findGlobal({
                  slug: 'gallery-settings',
                  depth: 0,
                  overrideAccess: true,
                })
                const folder = settings?.folder
                const folderId = typeof folder === 'object' ? folder?.id : folder
                if (!folderId) return false
                return { folder: { equals: folderId } }
              },
            },
            {
              name: 'images',
              type: 'array',
              labels: { singular: 'Image', plural: 'Images' },
              admin: {
                description:
                  'Images must belong to the gallery folder configured in Gallery Settings.',
              },
              fields: [
                {
                  name: 'media',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  filterOptions: async ({ req }) => {
                    const settings = await req.payload.findGlobal({
                      slug: 'gallery-settings',
                      depth: 0,
                      overrideAccess: true,
                    })
                    const folder = settings?.folder
                    const folderId = typeof folder === 'object' ? folder?.id : folder
                    if (!folderId) return false
                    return { folder: { equals: folderId } }
                  },
                },
                {
                  name: 'alt',
                  type: 'text',
                  admin: {
                    description: 'Optional override; defaults to media alt text.',
                  },
                },
                { name: 'caption', type: 'text' },
              ],
            },
            {
              name: 'description',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
              admin: {
                description: 'Full description shown on the gallery collection detail page.',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateGalleryCollection],
    beforeChange: [populatePublishedAt, validateGalleryFolder],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
