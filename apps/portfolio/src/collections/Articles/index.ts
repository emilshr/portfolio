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
import { AlertBanner } from '../../blocks/AlertBanner/config'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { GitHubEmbed } from '../../blocks/GitHubEmbed/config'
import { LinkCard } from '../../blocks/LinkCard/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { MediaPlayerBlock } from '../../blocks/MediaPlayer/config'
import { NeoDBEmbed } from '../../blocks/NeoDBEmbed/config'
import { XPostEmbed } from '../../blocks/XPostEmbed/config'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { featuredArticleIndexes, publishedAtStatusIndexes } from '../shared/indexes'
import { generateJourneysPreviewPath } from '../../utilities/generateJourneysPreviewPath'
import { revalidateArticle, revalidateDelete } from './hooks/revalidateArticle'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    publishedAt: true,
    heroImage: true,
    coverImage: true,
    excerpt: true,
    subtitle: true,
    location: true,
    tripDates: true,
    tags: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'publishedAt', 'updatedAt'],
    group: 'Journeys',
    livePreview: {
      url: ({ data }) => {
        if (!data?.slug) return null
        return generateJourneysPreviewPath({
          path: `/articles/${encodeURIComponent(data.slug)}`,
        })
      },
    },
    preview: (data) => {
      const slug = data?.slug as string | undefined
      if (!slug) return null
      return generateJourneysPreviewPath({
        path: `/articles/${encodeURIComponent(slug)}`,
      })
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'text',
      admin: {
        description: 'Displayed under the title on the article detail hero.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 180,
      admin: {
        description: 'Short teaser used in article lists and metadata fallback.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Full-width hero image on the article detail page.',
              },
            },
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Thumbnail for grids and cards (can differ from hero).',
              },
            },
            {
              name: 'location',
              type: 'group',
              fields: [
                { name: 'city', type: 'text' },
                { name: 'country', type: 'text' },
              ],
            },
            {
              name: 'tripDates',
              type: 'group',
              fields: [
                {
                  name: 'start',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayOnly' } },
                },
                {
                  name: 'end',
                  type: 'date',
                  admin: { date: { pickerAppearance: 'dayOnly' } },
                },
              ],
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
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({
                      blocks: [
                        AlertBanner,
                        Banner,
                        Code,
                        MediaBlock,
                        MediaPlayerBlock,
                        GitHubEmbed,
                        XPostEmbed,
                        NeoDBEmbed,
                        LinkCard,
                      ],
                    }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
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
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      maxDepth: 0,
      admin: {
        position: 'sidebar',
        description: 'Add or create tags to categorize this article.',
      },
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
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show in the Featured journeys homepage block when that block is added.',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateArticle],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  indexes: [...publishedAtStatusIndexes, ...featuredArticleIndexes],
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
