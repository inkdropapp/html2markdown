// from: https://github.com/marekweb/hast-util-insert
const hastUtilSelect = require('hast-util-select')
const toNodeArray = require('./to-node-array')

function hastUtilInsert(tree, selector, nodes, action = 'insert') {
  const foundNode = hastUtilSelect.select(selector, tree)
  if (foundNode) {
    if (typeof nodes === 'function') {
      nodes = nodes.call(tree, foundNode)
    }
    const nodeArray = toNodeArray(nodes)
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

module.exports = hastUtilInsert
