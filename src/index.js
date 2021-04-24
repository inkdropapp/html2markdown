// @flow
import hardBreak from './hard-break'
import toMdastCodeBlock from './to-mdast-code-block'
import toMdastComment from './to-mdast-comment'

type Options = {
  toMdast?: Object,
  stringify?: Object,
  baseURI?: string
}

function getConverter(opts?: Options) {
  const {
    toMdast: toMdastOptions = {},
    stringify: stringifyOptions = {},
    baseURI = null
  } = opts || {}

  const unified = require('unified')
  const rehypeParse = require('rehype-parse')
  const rehype2remark = require('rehype-remark')
  const rehypeInsert = require('./rehype-insert')
  const stringify = require('remark-stringify')
  const squeezeLinks = require('remark-squeeze-links')
  const gfm = require('mdast-util-gfm/to-markdown')

  const remark = unified()
    .data('toMarkdownExtensions', [gfm()])
    .use(rehypeParse)
    .use(rehypeInsert, {
      insertions: baseURI
        ? [
            {
              selector: 'head',
              insert: {
                type: 'element',
                tagName: 'base',
                properties: { href: baseURI },
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
  return remark.use(squeezeLinks).use(stringify, {
    listItemIndent: '1',
    bullet: '*',
    commonmark: true,
    fences: true,
    handlers: {
      break: hardBreak,
      ...(stringifyOptions.handlers || {})
    },
    ...stringifyOptions
  })
}

export default function HTML2Markdown(html: string, opts?: Options): string {
  const c = getConverter(opts)
  return (
    c
      .processSync(html)
      .toString()
      // unescape task list checkbox
      .replace(/\\\[(x| )\]/g, '[$1]')
  )
}
