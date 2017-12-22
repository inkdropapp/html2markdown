// @flow
import toMarkdown from 'to-markdown'

export default function HTML2Markdown (html: string): string {
  let md = toMarkdown(html, {
    gfm: true,
    converters: [
      {
        filter: ['div', 'p', 'dt', 'dd', 'summary'],
        replacement (innerHTML) {
          return '\n' + innerHTML + '\n'
        }
      },
      {
        filter: ['font', 'span', 'article', 'section', 'nav', 'button', 'main', 'footer', 'header', 'aside', 'details', 'u', 'samp', 'var', 'kbd', 'legend', 'mark', 'output', 'small', 'sub', 'sup'],
        replacement (innerHTML) {
          return innerHTML
        }
      },
      {
        filter: ['input', 'form', 'iframe', 'canvas', 'embed', 'select', 'rt', 'wbr'],
        replacement (innerHTML) {
          return ''
        }
      }
    ]
  })
  return stripHTMLTagsFromMarkdown(md)
}

function stripHTMLTagsFromMarkdown (value: string): string {
  const remark = require('unified')()
    .use(require('remark-parse'))
    .use(require('remark-stringify'), {
      bullet: '*',
      emphasis: '*',
      listItemIndent: '1',
      fences: true
    })
    .use(require('remark-strip-html'))
  return remark().processSync(value).toString().trimRight()
}
