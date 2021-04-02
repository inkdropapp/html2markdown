// from: https://github.com/marekweb/rehype-insert

const hastUtilInsert = require('./hast-util-insert')

function rehypeInsert(options = {}) {
  return function rehypeInsertTransformer(tree) {
    const { insertions = [] } = options
    insertions.forEach(function (i) {
      hastUtilInsert(tree, i.selector, i.insert, i.action)
    })
  }
}

module.exports = rehypeInsert
