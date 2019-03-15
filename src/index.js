// @flow
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'

const turndownService = new TurndownService()
turndownService.use(gfm)
turndownService.addRule('block', {
  filter: ['div', 'p', 'dt', 'dd', 'summary'],
  replacement(innerHTML) {
    return '\n' + innerHTML + '\n'
  }
})
turndownService.addRule('inline-block', {
  filter: [
    'font',
    'span',
    'article',
    'section',
    'nav',
    'button',
    'main',
    'footer',
    'header',
    'aside',
    'details',
    'u',
    'samp',
    'var',
    'kbd',
    'legend',
    'mark',
    'output',
    'small',
    'sub',
    'sup'
  ],
  replacement(innerHTML) {
    return innerHTML
  }
})
turndownService.addRule('ignore', {
  filter: [
    'input',
    'form',
    'iframe',
    'canvas',
    'embed',
    'select',
    'rt',
    'wbr',
    'style',
    'script',
    'title',
    'head'
  ],
  replacement(_innerHTML) {
    return ''
  }
})
turndownService.addRule('code-block', {
  filter: ['pre'],
  replacement(innerHTML) {
    return '```\n' + stripTags(innerHTML) + '\n```\n'
  }
})

export default function HTML2Markdown(html: string): string {
  const md = turndownService.turndown(html)
  return stripHTMLTagsFromMarkdown(md)
}

function stripHTMLTagsFromMarkdown(value: string): string {
  const remark = require('unified')()
    .use(require('remark-parse'))
    .use(require('remark-stringify'), {
      bullet: '*',
      emphasis: '*',
      listItemIndent: '1',
      fences: true
    })
    .use(require('remark-strip-html'))
  return remark()
    .processSync(value)
    .toString()
    .trimRight()
}

function stripTags(v: string): string {
  return v.replace(/<(?:.|\n)*?>/gm, '')
}
