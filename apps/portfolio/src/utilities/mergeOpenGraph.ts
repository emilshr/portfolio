import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

type MergeOpenGraphDefaults = {
  siteName?: string
  description?: string
}

const getDefaultOpenGraph = (defaults?: MergeOpenGraphDefaults): Metadata['openGraph'] => ({
  type: 'website',
  description: defaults?.description ?? 'I specialize in building things for the web.',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: defaults?.siteName ?? 'Emil',
  title: defaults?.siteName ?? 'Emil',
})

export const mergeOpenGraph = (
  og?: Metadata['openGraph'],
  defaults?: MergeOpenGraphDefaults,
): Metadata['openGraph'] => {
  const defaultOpenGraph = getDefaultOpenGraph(defaults)

  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph?.images,
  }
}
