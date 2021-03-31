// @flow
import hardBreak from './hard-break'

function getConverter(opts?: Object) {
  const { toMdast: toMdastOptions = {}, stringify: stringifyOptions = {} } =
    opts || {}
  var unified = require('unified')
  var parse = require('rehype-parse')
  var rehype2remark = require('rehype-remark')
  var stringify = require('remark-stringify')

  return unified()
    .use(parse)
    .use(rehype2remark, toMdastOptions)
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

export default function HTML2Markdown(html: string, opts?: Object): string {
  const c = getConverter(opts)
  return (
    c
      .processSync(html)
      .toString()
      // unescape task list checkbox
      .replace(/\\\[(x| )\]/g, '[$1]')
  )
}
