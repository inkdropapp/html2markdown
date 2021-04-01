export default code

var has = require('hast-util-has-property')
var convert = require('hast-util-is-element/convert')
var toText = require('hast-util-to-text')
var trim = require('trim-trailing-lines')
var wrapText = require('hast-util-to-mdast/lib/util/wrap-text')

var prefixes = ['language-', 'highlight-source-']

var isPre = convert('pre')
var isCode = convert('code')

function code(h, node, parent) {
  var children = node.children
  var index = -1
  var classList = parent.properties.className || []
  var lang

  if (isPre(node)) {
    lang = node.properties.lang || null
    while (++index < children.length) {
      if (isCode(children[index]) && has(children[index], 'className')) {
        classList = classList.concat(children[index].properties.className)
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
    trim(wrapText(h, toText(node)))
  )
}
