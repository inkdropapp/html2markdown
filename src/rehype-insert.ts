// from: https://github.com/marekweb/rehype-insert
import { Plugin } from 'unified'
import { hastUtilInsert } from './hast-util-insert'
import { Root, Element } from 'hast'

type Options = {
  insertions?: Array<{
    selector: string
    insert: Element
    action?: string
  }>
}

/*
 * Rehype plugin to insert content into the HTML tree
 */
export const rehypeInsert: Plugin<[Options], Root, Root> = (options = {}) => {
  return function rehypeInsertTransformer(tree) {
    const { insertions = [] } = options
    insertions.forEach(function (i) {
      hastUtilInsert(tree, i.selector, i.insert, i.action)
    })
  }
}
