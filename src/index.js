// @flow
import hardBreak from './hard-break'

type Options = {
  toMdast?: Object,
  stringify?: Object
}

function getConverter(opts?: Options) {
  const { toMdast: toMdastOptions = {}, stringify: stringifyOptions = {} } =
    opts || {}
  var unified = require('unified')
  var parse = require('rehype-parse')
  var rehype2remark = require('rehype-remark')
  var stringify = require('remark-stringify')
  var squeezeLinks = require('remark-squeeze-links')

  return unified()
    .use(parse)
    .use(rehype2remark, toMdastOptions)
    .use(squeezeLinks)
    .use(stringify, {
      listItemIndent: '1',
      bullet: '*',
      commonmark: true,
      fences: true,
      handlers: {
        break: hardBreak
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
