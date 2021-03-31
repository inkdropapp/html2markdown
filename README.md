# html2markdown

It converts HTML to Markdown using [remark][] and [rehype][].

## install

```sh
npm install @craftzdog/html2markdown
```

## How to use

Say we have the following markdown file, `example.md`:

```markdown
<h1>Hello, world!</h1>
```

And our script, `example.js`, looks as follows:

```js
var fs = require("fs");
var html2markdown = require("@craftzdog/html2markdown");

var doc = fs.readFileSync("example.md");

var md = html2markdown(doc);

console.log(md);
```

Now, running `node example` yields:

```js
# Hello, world!
```

## API

### `html2markdown(html, options)`

Converts the given HTML to Markdown.

#### Options

- `options.toMdast` — The options for [hast-util-to-mdast][]
- `options.stringify` — The formatting options for [mdast-util-to-markdown][]

[remark]: https://github.com/remarkjs/remark
[rehype]: https://github.com/rehypejs/rehype
[hast-util-to-mdast]: https://github.com/syntax-tree/hast-util-to-mdast
[mdast-util-to-markdown]: https://github.com/syntax-tree/mdast-util-to-markdown#formatting-options
