import { hardBreak } from './hard-break'
import { code as toMdastCodeBlock } from './to-mdast-code-block'
import { comment as toMdastComment } from './to-mdast-comment'

import { unified } from 'unified'
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

  let remark = unified()
    .data('toMarkdownExtensions', [gfmToMarkdown()])
    .use(rehypeParse)
  if (baseURI) remark = remark.use(rehypeInsertBaseURI, baseURI || '/')

  return (
    remark
      .use(rehype2remark, {
        handlers: {
          pre: toMdastCodeBlock,
          comment: toMdastComment,
          ...(toMdastOptions.handlers || {})
        },
        ...toMdastOptions
      })
      .use(squeezeLinks)
      // @ts-ignore
      .use(remarkStringify, {
        listItemIndent: 'one',
        bullet: '-',
        fences: true,
        handlers: {
          break: hardBreak,
          ...(stringifyOptions.handlers || {})
        },
        ...stringifyOptions
      })
  )
}

export function html2Markdown(html: string, opts?: Options): string {
  const c = getConverter(opts)
  return c
    .processSync(html)
    .toString() // unescape task list checkbox
    .replace(/\\\[(x| )\]/g, '[$1]')
}
