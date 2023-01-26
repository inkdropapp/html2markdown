import { Root, Element, Content, Text } from 'hast'

/**
 * Wrap into a node list.
 *
 * Allowed values:
 * - string: wrap it in a text node
 * - node: wrap it in an array as [node]
 * - root: extract the children
 * - array: keep it as-is (assuming it's an array of nodes)
 */
export function toNodeArray(
  input: string | Element | Root | Element[]
): Content[] {
  if (typeof input === 'string') {
    return [{ type: 'text', value: input } as Text]
  } else if (Array.isArray(input)) {
    return input
  } else if (!input) {
    return [] as Element[]
  } else if (input.type === 'root') {
    return input.children
  }
  return [input]
}
