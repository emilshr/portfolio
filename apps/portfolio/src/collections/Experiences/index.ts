import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { revalidateDelete, revalidateExperience } from './hooks/revalidateExperience'
import { slugField } from 'payload'

export const Experiences: CollectionConfig<'experiences'> = {
  slug: 'experiences',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'order', 'updatedAt'],
  },
  defaultPopulate: {
    title: true,
    company: true,
    slug: true,
    from: true,
    to: true,
    order: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'from',
      type: 'text',
      required: true,
    },
    {
      name: 'to',
      type: 'text',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
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
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateExperience],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: false,
    },
    maxPerDoc: 20,
  },
}
