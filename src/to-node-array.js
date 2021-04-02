/**
 * Wrap into a node list.
 *
 * Allowed values:
 * - string: wrap it in a text node
 * - node: wrap it in an array as [node]
 * - root: extract the children
 * - array: keep it as-is (assuming it's an array of nodes)
 */
function toNodeArray(input) {
  if (typeof input === 'string') {
    return [{ type: 'text', value: input }]
  } else if (Array.isArray(input)) {
    return input
  } else if (!input) {
    return []
  } else if (input.type === 'root') {
    return input.children
  }
  return [input]
}

module.exports = toNodeArray
