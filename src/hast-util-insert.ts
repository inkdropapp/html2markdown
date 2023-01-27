// from: https://github.com/marekweb/hast-util-insert
import { select } from 'hast-util-select'
import { toNodeArray } from './to-node-array'
import { Root, Element, ElementContent } from 'hast'

type GetNodeToInsertCallback = (foundNode: Element | null) => Element

export const hastUtilInsert = (
  tree: Root,
  selector: string,
  nodes: string | Element | Element[] | GetNodeToInsertCallback,
  action = 'insert'
): Element | null => {
  const foundNode = select(selector, tree)
  if (foundNode) {
    if (typeof nodes === 'function') {
      nodes = nodes.call(tree, foundNode)
    }
    const nodeArray = toNodeArray(nodes) as ElementContent[]
    if (action === 'append') {
      foundNode.children = foundNode.children.concat(nodeArray)
    } else if (action === 'prepend') {
      foundNode.children = nodeArray.concat(foundNode.children)
    } else if (action === 'insert') {
      // make a copy of the source array.
      foundNode.children = nodeArray.slice()
    }
  }
  return foundNode
}
