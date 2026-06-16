import type { CollectionConfig } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { MediaPlayerBlock } from '../../blocks/MediaPlayer/config'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generateJourneysPreviewPath } from '../../utilities/generateJourneysPreviewPath'
import { revalidateDelete, revalidateVehicle } from './hooks/revalidateVehicle'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

const vehicleRichTextEditor = lexicalEditor({
  features: ({ rootFeatures }) => {
    return [
      ...rootFeatures,
      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
      BlocksFeature({
        blocks: [Banner, Code, MediaBlock, MediaPlayerBlock],
      }),
      FixedToolbarFeature(),
      InlineToolbarFeature(),
    ]
  },
})

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    name: true,
    slug: true,
    odometer: true,
    publishedAt: true,
    coverImage: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['name', 'odometer', 'publishedAt', 'updatedAt'],
    group: 'Journeys',
    livePreview: {
      url: ({ data }) =>
        generateJourneysPreviewPath({
          path: data?.slug ? `/vehicles#${encodeURIComponent(data.slug)}` : '/vehicles',
        }),
    },
    preview: (data) =>
      generateJourneysPreviewPath({
        path: data?.slug ? `/vehicles#${encodeURIComponent(data.slug as string)}` : '/vehicles',
      }),
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Primary thumbnail/cover image for this vehicle.',
      },
    },
    {
      name: 'odometer',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Current odometer reading in kilometers.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      labels: { singular: 'Media Item', plural: 'Gallery Media' },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
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
      name: 'details',
      type: 'richText',
      editor: vehicleRichTextEditor,
      required: true,
    },
    {
      name: 'mods',
      type: 'array',
      labels: { singular: 'Mod', plural: 'Mods' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'productURL',
          type: 'text',
          admin: {
            description: 'Product URL for this mod.',
          },
          validate: (value: string | null | undefined) => {
            if (!value) return true
            try {
              const parsed = new URL(value)
              if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return true
              return 'Use a valid URL starting with http:// or https://'
            } catch {
              return 'Use a valid URL starting with http:// or https://'
            }
          },
        },
        {
          name: 'rating',
          type: 'number',
          min: 0,
          max: 5,
          admin: {
            step: 0.5,
            description: 'Rating out of 5 stars (supports 0.5 increments).',
          },
        },
        {
          name: 'pictures',
          type: 'array',
          labels: { singular: 'Picture', plural: 'Pictures' },
          fields: [
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'alt',
              type: 'text',
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
        {
          name: 'review',
          type: 'richText',
          editor: vehicleRichTextEditor,
        },
      ],
    },
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
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
    {
      name: 'lastUpdatedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayOnly' },
        position: 'sidebar',
      },
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
    afterChange: [revalidateVehicle],
    beforeChange: [populatePublishedAt],
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
