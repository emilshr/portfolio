import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'
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
  NeoDBEmbedBlock as NeoDBEmbedBlockProps,
  XPostEmbedBlock as XPostEmbedBlockProps,
} from '@repo/payload-types'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | AlertBannerBlockProps
      | BannerBlockProps
      | MediaBlockProps
      | CodeBlockProps
      | GitHubEmbedBlockProps
      | XPostEmbedBlockProps
      | NeoDBEmbedBlockProps
      | LinkCardBlockProps
      | ContentBlockProps
    >

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/${slug}` : `/${slug === 'home' ? '' : slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    alertBanner: ({ node }) => <AlertBannerBlockComponent {...node.fields} />,
    banner: ({ node }) => <BannerBlock {...node.fields} />,
    content: ({ node }) => <ContentBlock {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock {...node.fields} enableGutter={false} disableInnerContainer />
    ),
    code: ({ node }) => <CodeBlock {...node.fields} />,
    githubEmbed: ({ node }) => (
      <div className="github-embed" data-repo={node.fields.repo}>
        <a href={`https://github.com/${node.fields.repo}`} target="_blank" rel="noopener noreferrer">
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
  const { className, enableProse = true, enableGutter = false, ...rest } = props
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={[enableProse ? 'prose' : '', className].filter(Boolean).join(' ')}
      {...rest}
    />
  )
}
