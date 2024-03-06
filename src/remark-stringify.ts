import { Plugin, Compiler } from 'unified'
import { Options as ToMarkdownOptions } from 'mdast-util-to-markdown'
import { Root } from 'mdast'
import { toMarkdown } from 'mdast-util-to-markdown'

type Processor = import('unified').Processor<
  undefined,
  undefined,
  undefined,
  Root,
  string
>

export type Options = Omit<ToMarkdownOptions, 'extensions'>

export function remarkStringify(
  this: Processor,
  options: Plugin<[Options?] | void[], Root, string>
) {
  const compiler: Compiler<Root, string> = tree => {
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

  this.compiler = compiler
}
