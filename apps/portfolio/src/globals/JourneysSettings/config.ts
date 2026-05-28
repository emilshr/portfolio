import type { GlobalConfig } from 'payload'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateJourneysSettings } from './hooks/revalidateJourneysSettings'

export const JourneysSettings: GlobalConfig = {
  slug: 'journeys-settings',
  label: 'Journeys Settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Journeys',
  },
  hooks: {
    afterChange: [revalidateJourneysSettings],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Home',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Homepage hero background image.',
              },
            },
            {
              name: 'heroTitle',
              type: 'text',
              defaultValue: 'Journeys',
            },
            {
              name: 'heroSubtitle',
              type: 'text',
              defaultValue: 'Travel stories from the road.',
            },
            {
              name: 'featuredTravel',
              type: 'relationship',
              relationTo: 'travels',
              admin: {
                description: 'Optional fallback hero image when no homepage hero image is set.',
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
  ],
}
