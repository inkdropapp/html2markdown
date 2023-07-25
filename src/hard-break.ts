import { Handle } from 'mdast-util-to-markdown'
import type { ConstructName, Unsafe } from 'mdast-util-to-markdown'

export const hardBreak: Handle = (_node, _, context, safe) => {
  let index = -1

  while (++index < context.unsafe.length) {
    // If we can't put eols in this construct (setext headings, tables), use a
    // space instead.
    if (
      context.unsafe[index].character === '\n' &&
      patternInScope(context.stack, context.unsafe[index])
    ) {
      return /[ \t]/.test(safe.before) ? '' : ' '
    }
  }

  return '  \n'
}

export function patternInScope(
  stack: Array<ConstructName>,
  pattern: Unsafe
): boolean {
  return (
    listInScope(stack, pattern.inConstruct, true) &&
    !listInScope(stack, pattern.notInConstruct, false)
  )
}

function listInScope(
  stack: Array<ConstructName>,
  list: Unsafe['inConstruct'],
  none: boolean
): boolean {
  if (typeof list === 'string') {
    list = [list]
  }

  if (!list || list.length === 0) {
    return none
  }

  let index = -1

  while (++index < list.length) {
    if (stack.includes(list[index])) {
      return true
    }
  }

  return false
}
