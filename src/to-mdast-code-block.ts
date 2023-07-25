import { hasProperty } from 'hast-util-has-property'
import { isElement, convertElement } from 'hast-util-is-element'
import { toText } from 'hast-util-to-text'
import { trimTrailingLines } from 'trim-trailing-lines'
import { Element } from 'hast'
import { Code } from 'mdast'
import { Handle, State } from 'hast-util-to-mdast'

const prefixes = ['language-', 'lang-', 'highlight-source-']

const isPre = convertElement('pre')
const isCode = convertElement('code')

export const _code: Handle = (h, node, parent) => {
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
      if (
        isCode(children[index]) &&
        hasProperty(children[index], 'className')
      ) {
        classList = classList.concat(children[index].properties?.className)
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

  return h(
    node,
    'code',
    { lang: lang || null, meta: null },
    trimTrailingLines(toText(node))
  )
}

export const code = (state: State, node: Element) => {
  const children = node.children
  let index = -1
  let classList: string[] | undefined
  let lang: string | undefined

  if (node.tagName === 'pre') {
    while (++index < children.length) {
      const child = children[index]

      if (
        child.type === 'element' &&
        child.tagName === 'code' &&
        child.properties &&
        child.properties.className &&
        Array.isArray(child.properties.className)
      ) {
        classList = child.properties.className as string[]
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

  const result: Code = {
    type: 'code',
    lang: lang || null,
    meta: null,
    value: trimTrailingLines(toText(node))
  }
  state.patch(node, result)
  return result
}
