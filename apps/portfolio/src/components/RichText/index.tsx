import dynamic from 'next/dynamic'

import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MediaPlayerBlockComponent } from '@/blocks/MediaPlayer/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import { PreviewableLink } from '@repo/ui/previewable-link'

import type { CodeBlockProps } from '@/blocks/Code/Component'

const CodeBlock = dynamic(() =>
  import('@/blocks/Code/Component').then((mod) => mod.CodeBlock),
)
import { AlertBannerBlockComponent } from '@/blocks/AlertBanner/Component'
import { BannerBlock } from '@/blocks/Banner/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import type {
  AlertBannerBlock as AlertBannerBlockProps,
  BannerBlock as BannerBlockProps,
  ContentBlock as ContentBlockProps,
  GitHubEmbedBlock as GitHubEmbedBlockProps,
  LinkCardBlock as LinkCardBlockProps,
  MediaBlock as MediaBlockProps,
  MediaPlayerBlock as MediaPlayerBlockProps,
  NeoDBEmbedBlock as NeoDBEmbedBlockProps,
  XPostEmbedBlock as XPostEmbedBlockProps,
} from '@repo/payload-types'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | AlertBannerBlockProps
      | BannerBlockProps
      | MediaBlockProps
      | MediaPlayerBlockProps
      | CodeBlockProps
      | GitHubEmbedBlockProps
      | XPostEmbedBlockProps
      | NeoDBEmbedBlockProps
      | LinkCardBlockProps
      | ContentBlockProps
    >

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const doc = linkNode.fields.doc
  if (!doc || typeof doc.value !== 'object' || doc.value === null) {
    return '#'
  }
  const slug = 'slug' in doc.value && typeof doc.value.slug === 'string' ? doc.value.slug : ''
  if (!slug) return '#'
  return doc.relationTo === 'posts' ? `/${slug}` : `/${slug === 'home' ? '' : slug}`
}

const linkFields = (newTab: boolean | null | undefined) => ({
  rel: newTab ? ('noopener noreferrer' as const) : undefined,
  target: newTab ? ('_blank' as const) : undefined,
})

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  autolink: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const { rel, target } = linkFields(node.fields.newTab)
    return (
      <PreviewableLink href={node.fields.url ?? '#'} rel={rel} target={target}>
        {children}
      </PreviewableLink>
    )
  },
  link: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children })
    const { rel, target } = linkFields(node.fields.newTab)
    const href =
      node.fields.linkType === 'internal'
        ? internalDocToHref({ linkNode: node })
        : (node.fields.url ?? '#')
    return (
      <PreviewableLink href={href} rel={rel} target={target}>
        {children}
      </PreviewableLink>
    )
  },
  blocks: {
    alertBanner: ({ node }) => <AlertBannerBlockComponent {...node.fields} />,
    banner: ({ node }) => <BannerBlock {...node.fields} />,
    content: ({ node }) => <ContentBlock {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock {...node.fields} enableGutter={false} disableInnerContainer />
    ),
    mediaPlayer: ({ node }) => (
      <MediaPlayerBlockComponent {...node.fields} enableGutter={false} disableInnerContainer />
    ),
    code: ({ node }) => <CodeBlock {...node.fields} />,
    githubEmbed: ({ node }) => (
      <div className="github-embed" data-repo={node.fields.repo}>
        <a
          href={`https://github.com/${node.fields.repo}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {node.fields.repo}
        </a>
      </div>
    ),
    xPostEmbed: ({ node }) => (
      <blockquote className="twitter-tweet">
        <a href={node.fields.url}>{node.fields.url}</a>
      </blockquote>
    ),
    neodbEmbed: ({ node }) => (
      <div className="neodb-embed">
        <a href={node.fields.url} target="_blank" rel="noopener noreferrer">
          {node.fields.url}
        </a>
      </div>
    ),
    linkCard: ({ node }) => (
      <div className="link-card" data-url={node.fields.url}>
        <a href={node.fields.url}>{node.fields.url}</a>
      </div>
    ),
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, enableProse = true, enableGutter: _enableGutter = false, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={[enableProse ? 'prose' : '', className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}
