import { hardBreak } from './hard-break'
import { code as toMdastCodeBlock } from './to-mdast-code-block'
import { comment as toMdastComment } from './to-mdast-comment'

import { unified } from 'unified'
import rehypeParse from 'rehype-parse'
import rehype2remark from 'rehype-remark'
import { rehypeInsert } from './rehype-insert'
import stringify, { Options as RemarkStringifyOptions } from 'remark-stringify'
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

  const remark = unified()
    .data('toMarkdownExtensions', [gfmToMarkdown()])
    .use(rehypeParse)
    .use(rehypeInsert, {
      insertions: baseURI
        ? [
            {
              selector: 'head',
              insert: {
                type: 'element',
                tagName: 'base',
                properties: {
                  href: baseURI
                },
                children: []
              }
            }
          ]
        : []
    })
    .use(rehype2remark, {
      handlers: {
        pre: toMdastCodeBlock,
        comment: toMdastComment,
        ...(toMdastOptions.handlers || {})
      },
      ...toMdastOptions
    })
  // @ts-ignore
  return remark.use(squeezeLinks).use(stringify, {
    listItemIndent: 'one',
    bullet: '*',
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
