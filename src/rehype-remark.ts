import type { Root } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import type { Plugin } from 'unified'
import { toMdast, Options } from 'hast-util-to-mdast'

export const rehype2remark: Plugin<
  [(Options | undefined)?],
  Root,
  MdastRoot
> = options => {
  return (hast: Root) => {
    return toMdast(hast, options || undefined) as MdastRoot
  }
}
