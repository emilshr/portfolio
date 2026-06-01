import type { GlobalConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { FeaturedTravelsBlock } from '@/blocks/FeaturedTravels/config'
import { ImageMarqueeBlock } from '@/blocks/ImageMarquee/config'
import { SeparatorBlock } from '@/blocks/Separator/config'
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
              defaultValue: 'BurntClutchProject',
              admin: {
                description: 'Large headline shown below the cover image on the homepage.',
              },
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
          label: 'Home sections',
          fields: [
            {
              name: 'homeLayout',
              type: 'blocks',
              blocks: [ImageMarqueeBlock, FeaturedTravelsBlock, SeparatorBlock],
              admin: {
                description:
                  'Optional sections rendered after About. Order controls display order.',
              },
            },
          ],
        },
        {
          label: 'About',
          fields: [
            {
              name: 'aboutHeading',
              type: 'text',
              defaultValue: 'About me',
            },
            {
              name: 'aboutLead',
              type: 'textarea',
            },
            {
              name: 'aboutImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Portrait shown in the about section.',
              },
            },
            {
              name: 'aboutContent',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
            },
            {
              name: 'aboutImagePosition',
              type: 'select',
              defaultValue: 'left',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
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
