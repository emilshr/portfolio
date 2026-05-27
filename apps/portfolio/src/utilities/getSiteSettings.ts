import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

export type SiteSettingsData = {
  site: {
    website: string
    title: string
    author: string
    description: string
    language: string
  }
  general: {
    contentWidth: string
    centeredLayout: boolean
    themeToggle: boolean
    postListDottedDivider: boolean
    footer: boolean
    fadeAnimation: boolean
  }
  date: {
    dateFormat: string
    dateSeparator: string
    dateOnRight: boolean
  }
  post: {
    readingTime: boolean
    toc: boolean
    imageViewer: boolean
    copyCode: boolean
    linkCard: boolean
  }
  contactLinks: {
    calCom?: string | null
    linkedin?: string | null
    github?: string | null
  }
}

export const defaultSiteSettings: SiteSettingsData = {
  site: {
    website: 'https://emilshr.com/',
    title: 'Emil',
    author: 'Emil',
    description: 'I specialize in building things for the web.',
    language: 'en-US',
  },
  general: {
    contentWidth: '35rem',
    centeredLayout: true,
    themeToggle: true,
    postListDottedDivider: false,
    footer: true,
    fadeAnimation: true,
  },
  date: {
    dateFormat: 'DAY MONTH YYYY',
    dateSeparator: '.',
    dateOnRight: true,
  },
  post: {
    readingTime: true,
    toc: true,
    imageViewer: true,
    copyCode: true,
    linkCard: true,
  },
  contactLinks: {
    calCom: 'https://cal.eu/emil-sharier',
    linkedin: 'https://www.linkedin.com/in/emilsharier',
    github: 'https://github.com/emilshr',
  },
}

const getSiteSettingsUncached = async (): Promise<SiteSettingsData> => {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({
    slug: 'site-settings',
    depth: 0,
  })

  if (!settings) return defaultSiteSettings

  return {
    site: {
      website: settings.site?.website ?? defaultSiteSettings.site.website,
      title: settings.site?.title ?? defaultSiteSettings.site.title,
      author: settings.site?.author ?? defaultSiteSettings.site.author,
      description: settings.site?.description ?? defaultSiteSettings.site.description,
      language: settings.site?.language ?? defaultSiteSettings.site.language,
    },
    general: {
      contentWidth: settings.general?.contentWidth ?? defaultSiteSettings.general.contentWidth,
      centeredLayout:
        settings.general?.centeredLayout ?? defaultSiteSettings.general.centeredLayout,
      themeToggle: settings.general?.themeToggle ?? defaultSiteSettings.general.themeToggle,
      postListDottedDivider:
        settings.general?.postListDottedDivider ??
        defaultSiteSettings.general.postListDottedDivider,
      footer: settings.general?.footer ?? defaultSiteSettings.general.footer,
      fadeAnimation: settings.general?.fadeAnimation ?? defaultSiteSettings.general.fadeAnimation,
    },
    date: {
      dateFormat: settings.date?.dateFormat ?? defaultSiteSettings.date.dateFormat,
      dateSeparator: settings.date?.dateSeparator ?? defaultSiteSettings.date.dateSeparator,
      dateOnRight: settings.date?.dateOnRight ?? defaultSiteSettings.date.dateOnRight,
    },
    post: {
      readingTime: settings.post?.readingTime ?? defaultSiteSettings.post.readingTime,
      toc: settings.post?.toc ?? defaultSiteSettings.post.toc,
      imageViewer: settings.post?.imageViewer ?? defaultSiteSettings.post.imageViewer,
      copyCode: settings.post?.copyCode ?? defaultSiteSettings.post.copyCode,
      linkCard: settings.post?.linkCard ?? defaultSiteSettings.post.linkCard,
    },
    contactLinks: {
      calCom: settings.contactLinks?.calCom ?? defaultSiteSettings.contactLinks.calCom,
      linkedin: settings.contactLinks?.linkedin ?? defaultSiteSettings.contactLinks.linkedin,
      github: settings.contactLinks?.github ?? defaultSiteSettings.contactLinks.github,
    },
  }
}

export const getSiteSettings = unstable_cache(getSiteSettingsUncached, ['site-settings'], {
  tags: ['global_site-settings'],
})
