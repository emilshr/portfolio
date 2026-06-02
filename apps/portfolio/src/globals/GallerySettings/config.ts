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
import { revalidateGallerySettings } from './hooks/revalidateGallerySettings'

export const GallerySettings: GlobalConfig = {
  slug: 'gallery-settings',
  label: 'Gallery Settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Journeys',
  },
  hooks: {
    afterChange: [revalidateGallerySettings],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Source',
          fields: [
            {
              name: 'folder',
              type: 'relationship',
              relationTo: 'payload-folders',
              filterOptions: {
                folderType: {
                  contains: 'media',
                },
              },
              admin: {
                description: 'Choose the Media folder used by the /gallery page.',
              },
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
  ],
}
