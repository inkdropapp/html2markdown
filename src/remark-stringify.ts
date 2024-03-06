import type { Plugin, Compiler } from 'unified'
import { Options as ToMarkdownOptions } from 'mdast-util-to-markdown'
import type { Root } from 'mdast'
import { toMarkdown } from 'mdast-util-to-markdown'

export type Options = Omit<ToMarkdownOptions, 'extensions'>

export const remarkStringify: Plugin<
  [(Readonly<Options> | null | undefined)?],
  Root,
  string
> = function (options: Readonly<Options> | null = {}) {
  const compiler: Compiler<Root, string> = tree => {
    // Assume options.
    const settings = this.data('settings') as Options

    return toMarkdown(
      tree,
      Object.assign({}, settings, options, {
        // Note: this option is not in the readme.
        // The goal is for it to be set by plugins on `data` instead of being
        // passed by users.
        // https://github.com/remarkjs/remark/blob/618a9ad1d44aa106bd2a8c61ebf8589cfe97fa16/packages/remark-stringify/lib/index.js#L32
        //
        // @ts-ignore
        extensions: (this.data('toMarkdownExtensions') ||
          []) as ToMarkdownOptions['extensions']
      })
    )
  }

  this.compiler = compiler as any
}
