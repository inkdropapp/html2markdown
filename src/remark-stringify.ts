import { Processor, Plugin, CompilerFunction } from 'unified'
import { Options as ToMarkdownOptions } from 'mdast-util-to-markdown'
import { Root, Content } from 'mdast'
import { toMarkdown } from 'mdast-util-to-markdown'

type Node = Root | Content
export type Options = Omit<ToMarkdownOptions, 'extensions'>

export function remarkStringify(
  this: Processor,
  options: Plugin<[Options?] | void[], Node, string>
) {
  // @ts-ignore
  const compiler: CompilerFunction<Node, string> = tree => {
    // Assume options.
    const settings = this.data('settings') as Options

    return toMarkdown(
      tree,
      Object.assign({}, settings, options, {
        // Note: this option is not in the readme.
        // The goal is for it to be set by plugins on `data` instead of being
        // passed by users.
        extensions: (this.data('toMarkdownExtensions') ||
          []) as ToMarkdownOptions['extensions']
      })
    )
  }

  Object.assign(this, { Compiler: compiler })
}
