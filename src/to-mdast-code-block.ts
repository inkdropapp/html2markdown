import { hasProperty } from 'hast-util-has-property'
import { isElement, convertElement } from 'hast-util-is-element'
import { toText } from 'hast-util-to-text'
import { trimTrailingLines } from 'trim-trailing-lines'
import type { Handle } from 'hast-util-to-mdast'
import type { Code } from 'mdast'

const prefixes = ['language-', 'lang-', 'highlight-source-']

const isPre = convertElement('pre')
const isCode = convertElement('code')

export const code: Handle = (state, node, parent) => {
  const children = node.children
  let index = -1
  let classList: string[] = []
  let lang: string | null = null

  if (isPre(node) && isElement(parent)) {
    lang = (node.properties?.lang as string) || null
    classList = [
      ...((parent.properties?.className as string[]) || []),
      ...((node.properties?.className as string[]) || [])
    ]
    while (++index < children.length) {
      const child = children[index]
      if (isCode(child) && hasProperty(child, 'className')) {
        classList = classList.concat(child.properties?.className as string)
        break
      }
    }
  }

  if (classList) {
    index = -1

    while (++index < classList.length) {
      if (lang) break
      for (const prefix of prefixes) {
        if (classList[index].slice(0, prefix.length) === prefix) {
          lang = classList[index].slice(prefix.length)
          break
        }
      }
    }
  }

  const result = {
    type: 'code',
    lang: lang || null,
    meta: null,
    value: trimTrailingLines(toText(node))
  } as Code
  state.patch(node, result)
  return result
}
