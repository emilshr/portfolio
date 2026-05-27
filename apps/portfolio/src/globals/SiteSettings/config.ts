import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateSiteSettings],
  },
  fields: [
    {
      name: 'site',
      type: 'group',
      fields: [
        { name: 'website', type: 'text', required: true, defaultValue: 'https://emilshr.com/' },
        { name: 'title', type: 'text', required: true, defaultValue: 'Emil' },
        { name: 'author', type: 'text', required: true, defaultValue: 'Emil' },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          defaultValue: 'I specialize in building things for the web.',
        },
        { name: 'language', type: 'text', defaultValue: 'en-US' },
      ],
    },
    {
      name: 'general',
      type: 'group',
      fields: [
        { name: 'contentWidth', type: 'text', defaultValue: '35rem' },
        { name: 'centeredLayout', type: 'checkbox', defaultValue: true },
        { name: 'themeToggle', type: 'checkbox', defaultValue: true },
        { name: 'postListDottedDivider', type: 'checkbox', defaultValue: false },
        { name: 'footer', type: 'checkbox', defaultValue: true },
        { name: 'fadeAnimation', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'date',
      type: 'group',
      fields: [
        {
          name: 'dateFormat',
          type: 'select',
          defaultValue: 'DAY MONTH YYYY',
          options: [
            { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
            { label: 'MM-DD-YYYY', value: 'MM-DD-YYYY' },
            { label: 'DD-MM-YYYY', value: 'DD-MM-YYYY' },
            { label: 'MONTH DAY YYYY', value: 'MONTH DAY YYYY' },
            { label: 'DAY MONTH YYYY', value: 'DAY MONTH YYYY' },
          ],
        },
        { name: 'dateSeparator', type: 'text', defaultValue: '.' },
        { name: 'dateOnRight', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'post',
      type: 'group',
      fields: [
        { name: 'readingTime', type: 'checkbox', defaultValue: true },
        { name: 'toc', type: 'checkbox', defaultValue: true },
        { name: 'imageViewer', type: 'checkbox', defaultValue: true },
        { name: 'copyCode', type: 'checkbox', defaultValue: true },
        { name: 'linkCard', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'contactLinks',
      type: 'group',
      fields: [
        { name: 'calCom', type: 'text' },
        { name: 'linkedin', type: 'text' },
        { name: 'github', type: 'text' },
      ],
    },
  ],
}
