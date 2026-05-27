// Lexical seed conversion — loose typing for migration content
/* oxlint-disable typescript/no-explicit-any */

type TextNode = {
  type: 'text'
  detail: number
  format: number
  mode: 'normal'
  style: string
  text: string
  version: number
}

type LexicalNode = {
  type: string
  children?: LexicalNode[]
  direction?: 'ltr'
  format?: string
  indent?: number
  version: number
  tag?: string
  language?: string
  fields?: Record<string, unknown>
  listType?: string
  start?: number
  value?: number
}

function textNode(text: string, format = 0): LexicalNode {
  return {
    type: 'text',
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  } as any
}

function paragraph(children: LexicalNode[]): LexicalNode {
  return {
    type: 'paragraph',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

function heading(text: string, tag: 'h1' | 'h2' | 'h3' | 'h4'): LexicalNode {
  return {
    type: 'heading',
    children: [textNode(text)],
    direction: 'ltr',
    format: '',
    indent: 0,
    tag,
    version: 1,
  }
}

function codeBlock(code: string, language = ''): LexicalNode {
  return {
    type: 'block',
    fields: {
      blockType: 'code',
      code,
      language,
    },
    format: '',
    version: 2,
  }
}

function blockquote(text: string): LexicalNode {
  return {
    type: 'quote',
    children: [paragraph([textNode(text)])],
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

export function markdownToLexical(markdown: string) {
  const children: LexicalNode[] = []
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  let i = 0
  let inCode = false
  let codeLang = ''
  let codeLines: string[] = []

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      if (!inCode) {
        inCode = true
        codeLang = line.slice(3).trim()
        codeLines = []
      } else {
        inCode = false
        children.push(codeBlock(codeLines.join('\n'), codeLang))
        codeLang = ''
        codeLines = []
      }
      i++
      continue
    }

    if (inCode) {
      codeLines.push(line)
      i++
      continue
    }

    if (line.startsWith('> ')) {
      children.push(blockquote(line.slice(2)))
      i++
      continue
    }

    if (line.startsWith('#### ')) {
      children.push(heading(line.slice(5), 'h4'))
      i++
      continue
    }
    if (line.startsWith('### ')) {
      children.push(heading(line.slice(4), 'h3'))
      i++
      continue
    }
    if (line.startsWith('## ')) {
      children.push(heading(line.slice(3), 'h2'))
      i++
      continue
    }
    if (line.startsWith('# ')) {
      children.push(heading(line.slice(2), 'h1'))
      i++
      continue
    }

    if (line.trim() === '') {
      i++
      continue
    }

    if (line.startsWith('- ')) {
      const listItems: LexicalNode[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        listItems.push({
          type: 'listitem',
          children: [paragraph([textNode(lines[i].slice(2))])],
          direction: 'ltr',
          format: '',
          indent: 0,
          value: 1,
          version: 1,
        })
        i++
      }
      children.push({
        type: 'list',
        children: listItems,
        direction: 'ltr',
        format: '',
        indent: 0,
        listType: 'bullet',
        start: 1,
        tag: 'ul',
        version: 1,
      })
      continue
    }

    const paraLines: string[] = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('- ') &&
      !lines[i].startsWith('> ') &&
      !lines[i].startsWith('```')
    ) {
      paraLines.push(lines[i])
      i++
    }
    children.push(paragraph([textNode(paraLines.join(' '))]))
  }

  if (inCode && codeLines.length) {
    children.push(codeBlock(codeLines.join('\n'), codeLang))
  }

  return {
    root: {
      type: 'root',
      children: children.length ? children : [paragraph([textNode('')])],
      direction: 'ltr' as const,
      format: '',
      indent: 0,
      version: 1,
    },
  } as const
}
