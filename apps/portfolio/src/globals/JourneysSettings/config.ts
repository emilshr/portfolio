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
import { ContentSplitBlock } from '@/blocks/ContentSplit/config'
import { FeaturedTravelsBlock } from '@/blocks/FeaturedTravels/config'
import { ImageMarqueeBlock } from '@/blocks/ImageMarquee/config'
import { MediaPlayerBlock } from '@/blocks/MediaPlayer/config'
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
              blocks: [
                ContentSplitBlock,
                ImageMarqueeBlock,
                FeaturedTravelsBlock,
                SeparatorBlock,
                MediaPlayerBlock,
              ],
              admin: {
                description: 'Sections below the hero. Order controls display order.',
              },
            },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'headerMenu',
              type: 'array',
              admin: {
                description:
                  'Fullscreen hamburger menu links shown in the Journeys header overlay.',
                initCollapsed: true,
              },
              labels: {
                singular: 'Menu item',
                plural: 'Menu items',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'linkType',
                      type: 'radio',
                      required: true,
                      defaultValue: 'internal',
                      options: [
                        {
                          label: 'Internal link',
                          value: 'internal',
                        },
                        {
                          label: 'External URL',
                          value: 'external',
                        },
                      ],
                      admin: {
                        layout: 'horizontal',
                        width: '50%',
                      },
                    },
                    {
                      name: 'openInNewTab',
                      type: 'checkbox',
                      defaultValue: false,
                      admin: {
                        width: '50%',
                        style: {
                          alignSelf: 'flex-end',
                        },
                      },
                    },
                  ],
                },
                {
                  name: 'internalDestinationType',
                  type: 'radio',
                  defaultValue: 'static',
                  options: [
                    {
                      label: 'Static route',
                      value: 'static',
                    },
                    {
                      label: 'Travel page',
                      value: 'travel',
                    },
                  ],
                  admin: {
                    condition: (_, siblingData) => siblingData?.linkType !== 'external',
                    layout: 'horizontal',
                  },
                },
                {
                  name: 'internalPath',
                  type: 'select',
                  options: [
                    { label: 'Home', value: '/' },
                    { label: 'Gallery', value: '/gallery' },
                    { label: 'Posts', value: '/posts' },
                    { label: 'Articles', value: '/articles' },
                    { label: 'Vehicles', value: '/vehicles' },
                  ],
                  defaultValue: '/',
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData?.linkType !== 'external' &&
                      siblingData?.internalDestinationType !== 'travel',
                    description: 'Choose a built-in route.',
                  },
                },
                {
                  name: 'travel',
                  type: 'relationship',
                  relationTo: 'travels',
                  admin: {
                    condition: (_, siblingData) =>
                      siblingData?.linkType !== 'external' &&
                      siblingData?.internalDestinationType === 'travel',
                    description: 'Choose a travel entry. Link resolves to /{slug}.',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: false,
                  admin: {
                    condition: (_, siblingData) => siblingData?.linkType === 'external',
                    description:
                      'External URL like https://example.com. (Legacy internal URLs still supported.)',
                  },
                },
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
