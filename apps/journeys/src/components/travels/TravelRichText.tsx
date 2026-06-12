import {
  type DefaultTypedEditorState,
  type DefaultNodeTypes,
  type SerializedBlockNode,
} from '@payloadcms/richtext-lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as RichTextConverter,
} from '@payloadcms/richtext-lexical/react'

import type {
  BannerBlock as BannerBlockProps,
  CodeBlock as CodeBlockProps,
  MediaBlock as MediaBlockProps,
  MediaPlayerBlock as MediaPlayerBlockProps,
} from '@repo/payload-types'

import { MediaPlayerBlockComponent } from '@/components/travels/MediaPlayerBlock'
import { RichTextImagePreview } from '@/components/travels/RichTextImagePreview'

import { getMediaAlt, getMediaUrl, isMedia } from '@/lib/media'
import { cn } from '@/lib/utils'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<BannerBlockProps | MediaBlockProps | MediaPlayerBlockProps | CodeBlockProps>

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref: () => '/' }),
  blocks: {
    banner: ({ node }) => {
      const { content, style } = node.fields
      return (
        <div
          className={cn(
            'my-8 rounded-lg border px-6 py-4',
            style === 'error' && 'border-danger/30 bg-danger/10',
            style === 'info' && 'border-primary/30 bg-primary/10',
            style === 'success' && 'border-success/30 bg-success/10',
            style === 'warning' && 'border-warning/30 bg-warning/10',
          )}
        >
          <TravelRichText data={content} />
        </div>
      )
    },
    mediaBlock: ({ node }) => {
      const { media } = node.fields
      if (!isMedia(media)) return null
      const src = getMediaUrl(media, 'large')
      if (!src) return null
      return (
        <figure className="my-10 overflow-hidden rounded-xl">
          <RichTextImagePreview
            src={src}
            alt={getMediaAlt(media)}
            width={media.width ?? 1400}
            height={media.height ?? 900}
          />
        </figure>
      )
    },
    mediaPlayer: ({ node }) => <MediaPlayerBlockComponent {...node.fields} />,
    code: ({ node }) => {
      const { code, language } = node.fields
      return (
        <pre className="my-8 overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-sm">
          <code className={`language-${language || 'text'}`}>{code}</code>
        </pre>
      )
    },
  },
})

type TravelRichTextProps = {
  data: DefaultTypedEditorState
  className?: string
}

export function TravelRichText({ data, className }: TravelRichTextProps) {
  return (
    <RichTextConverter
      className={cn(
        'prose prose-lg max-w-none',
        'prose-p:text-foreground prose-li:text-foreground',
        'prose-strong:text-foreground prose-headings:font-display prose-headings:text-foreground prose-headings:tracking-tight',
        'prose-a:text-primary prose-a:underline-offset-2 prose-img:rounded-xl',
        className,
      )}
      converters={jsxConverters}
      data={data}
    />
  )
}
