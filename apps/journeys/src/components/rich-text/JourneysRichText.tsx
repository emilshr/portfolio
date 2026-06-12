import { type DefaultTypedEditorState, type DefaultNodeTypes } from '@payloadcms/richtext-lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as RichTextConverter,
} from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/utils'

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref: () => '/' }),
})

type JourneysRichTextProps = {
  data: DefaultTypedEditorState
  className?: string
}

export function JourneysRichText({ data, className }: JourneysRichTextProps) {
  return (
    <RichTextConverter
      className={cn(
        'prose prose-lg max-w-none',
        'prose-p:text-foreground prose-li:text-foreground',
        'prose-strong:text-foreground prose-headings:font-display prose-headings:text-foreground prose-headings:tracking-tight',
        'prose-a:text-primary prose-a:underline-offset-2',
        className,
      )}
      converters={jsxConverters}
      data={data}
    />
  )
}
