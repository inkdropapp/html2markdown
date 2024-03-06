import { hardBreak } from './hard-break'
import { code as toMdastCodeBlock } from './to-mdast-code-block'
import { comment as toMdastComment } from './to-mdast-comment'

import { Processor, unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehype2remark from 'rehype-remark'
import { rehypeInsertBaseURI } from './rehype-insert-base-uri'
import {
  remarkStringify,
  Options as RemarkStringifyOptions
} from './remark-stringify'
import { squeezeLinks } from 'remark-squeeze-links'
import { gfmToMarkdown } from 'mdast-util-gfm'
import { Options as ToMdastOptions } from 'hast-util-to-mdast'
import type { Root as HastRoot } from 'hast'

export type Options = {
  toMdast?: ToMdastOptions
  stringify?: RemarkStringifyOptions
  baseURI?: string
}

function getConverter(opts?: Options) {
  const {
    toMdast: toMdastOptions = {},
    stringify: stringifyOptions = {},
    baseURI = null
  } = opts || {}

  const remarkInit: Processor<HastRoot> = unified()
    // @ts-ignore
    .data('toMarkdownExtensions', [gfmToMarkdown()])
    .use(rehypeParse)
  const remark = baseURI
    ? remarkInit.use(rehypeInsertBaseURI, baseURI || '/')
    : remarkInit

  const remarkParser = remark
    // @ts-ignore
    .use(rehype2remark, {
      handlers: {
        pre: toMdastCodeBlock,
        ...(toMdastOptions.handlers || {})
      },
      nodeHandlers: {
        comment: toMdastComment,
        ...(toMdastOptions.nodeHandlers || {})
      },
      ...toMdastOptions
    })
    .use(squeezeLinks)
  return remarkParser.use(remarkStringify, {
    listItemIndent: 'one',
    bullet: '-',
    fences: true,
    handlers: {
      break: hardBreak,
      ...(stringifyOptions.handlers || {})
    },
    ...stringifyOptions
  })
}

export function html2Markdown(html: string, opts?: Options): string {
  const c = getConverter(opts)
  return c
    .processSync(html)
    .toString() // unescape task list checkbox
    .replace(/\\\[(x| )\]/g, '[$1]')
}

export function parseMarkdown(html: string): HastRoot {
  const c = getConverter()
  return c.parse(html)
}
