import type { Plugin } from 'unified'
import type { Root } from 'hast'
import { visit } from 'unist-util-visit'

export const rehypeInsertBaseURI: Plugin<[string], Root, Root> = baseURI => {
  return function rehypeInsertTransformer(tree) {
    visit(tree, { type: 'element', tagName: 'head' }, headNode => {
      headNode.children = [
        ...headNode.children,
        {
          type: 'element',
          tagName: 'base',
          properties: {
            href: baseURI
          },
          children: []
        }
      ]
    })
  }
}
