import {
  type DefaultTypedEditorState,
  type DefaultNodeTypes,
} from '@payloadcms/richtext-lexical'
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
        'prose prose-neutral dark:prose-invert max-w-none',
        'prose-headings:font-display prose-headings:tracking-tight',
        'prose-a:text-primary',
        className,
      )}
      converters={jsxConverters}
      data={data}
    />
  )
}
