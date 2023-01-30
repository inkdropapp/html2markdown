import { Handle } from 'mdast-util-to-markdown'
import { patternInScope } from 'mdast-util-to-markdown/lib/util/pattern-in-scope.js'

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
