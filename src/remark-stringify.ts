import { Processor, Plugin, Compiler } from 'unified'
import { Options as ToMarkdownOptions } from 'mdast-util-to-markdown'
import { Root, RootContent } from 'mdast'
import { toMarkdown } from 'mdast-util-to-markdown'

type Node = Root | RootContent
export type Options = Omit<ToMarkdownOptions, 'extensions'>

export function remarkStringify(
  this: Processor,
  options: Plugin<[Options?] | void[], Node, string>
) {
  const compiler: Compiler<Node, string> = tree => {
    // Assume options.
    const settings = this.data('settings') as Options

    return toMarkdown(
      tree,
      Object.assign({}, settings, options, {
        // Note: this option is not in the readme.
        // The goal is for it to be set by plugins on `data` instead of being
        // passed by users.
        // @ts-ignore
        extensions: (this.data('toMarkdownExtensions') ||
          []) as ToMarkdownOptions['extensions']
      })
    )
  }

  Object.assign(this, { Compiler: compiler })
}
