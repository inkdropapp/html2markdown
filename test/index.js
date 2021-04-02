// @flow
import test from 'ava'
import html2markdown from '../lib/'
import fs from 'fs'
import dedent from 'dedent'

test('convert html', t => {
  const html = dedent`
  <!doctype html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <style>h1 { font-weight: bold; }</style>
      <script type="text/javascript">
        alert('hoge')
      </script>
      <title>page title</title>
    </head>
    <body>
      <h1>title</h1>
    </body>
  </html>`
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(md, '# title\n')
})

test('convert code', t => {
  const html = `
    <pre><code>code\ncode</code></pre>
  `
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(md, '```\ncode\ncode\n```\n')
})

test('convert pre', t => {
  const html = `<pre>pre</pre>`
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(md, '```\npre\n```\n')
})

test('newlines', t => {
  const html = `line1<br />line2<br />line3`
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(md, 'line1  \nline2  \nline3\n')
})

test('convert github code block', t => {
  const html = dedent`<div class="highlight highlight-source-shell"><pre>npm install mdast-squeeze-links</pre></div>`
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(
    md,
    dedent`\`\`\`shell
    npm install mdast-squeeze-links
    \`\`\`\n`
  )
})

test('convert gitlab code block', t => {
  const html = dedent`<pre class="code highlight js-syntax-highlight shell white" lang="shell" v-pre="true"><code><span id="LC1" class="line" lang="shell"><span class="nb">mkdir </span>build</span>
    <span id="LC2" class="line" lang="shell"><span class="nb">cd </span>build</span>
    <span id="LC3" class="line" lang="shell">cmake ..</span>
    <span id="LC4" class="line" lang="shell">make</span>
    <span id="LC5" class="line" lang="shell">make <span class="nb">install</span></span></code></pre>`
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(
    md,
    dedent`\`\`\`shell
    mkdir build
    cd build
    cmake ..
    make
    make install
    \`\`\`\n`
  )
})

test('convert highlightjs code block', t => {
  const html = dedent`<pre class="lang-html s-code-block hljs xml"><code><span class="hljs-meta">&lt;!doctype <span class="hljs-meta-keyword">html</span>&gt;</span>
<span class="hljs-tag">&lt;<span class="hljs-name">html</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">head</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">title</span>&gt;</span>Title<span class="hljs-tag">&lt;/<span class="hljs-name">title</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">style</span>&gt;</span><span class="css">
            <span class="hljs-selector-tag">body</span> {
                <span class="hljs-attribute">font-family</span>: <span class="hljs-string">"Segoe UI"</span>, <span class="hljs-string">"Lucida Grande"</span>, Tahoma, sans-serif;
                <span class="hljs-attribute">font-size</span>: <span class="hljs-number">100%</span>;
            }
            <span class="hljs-selector-id">#status</span> {
                <span class="hljs-attribute">white-space</span>: pre;
                <span class="hljs-attribute">text-overflow</span>: ellipsis;
                <span class="hljs-attribute">overflow</span>: hidden;
                <span class="hljs-attribute">max-width</span>: <span class="hljs-number">400px</span>;
            }
        </span><span class="hljs-tag">&lt;/<span class="hljs-name">style</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">script</span> <span class="hljs-attr">src</span>=<span class="hljs-string">"popup.js"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">script</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">head</span>&gt;</span>
    <span class="hljs-tag">&lt;<span class="hljs-name">body</span>&gt;</span>
        <span class="hljs-tag">&lt;<span class="hljs-name">p</span> <span class="hljs-attr">id</span>=<span class="hljs-string">"text"</span>&gt;</span><span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
    <span class="hljs-tag">&lt;/<span class="hljs-name">body</span>&gt;</span>
<span class="hljs-tag">&lt;/<span class="hljs-name">html</span>&gt;</span>
</code></pre>`
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(
    md,
    dedent`\`\`\`html
    <!doctype html>
    <html>
    <head>
        <title>Title</title>
        <style>
            body {
                font-family: "Segoe UI", "Lucida Grande", Tahoma, sans-serif;
                font-size: 100%;
            }
            #status {
                white-space: pre;
                text-overflow: ellipsis;
                overflow: hidden;
                max-width: 400px;
            }
        </style>
        <script src="popup.js"></script>
    </head>
    <body>
        <p id="text"></p>
    </body>
    </html>
    \`\`\`\n`
  )
})

test('convert list', t => {
  const html = dedent`
    <ul>
      <li>list 1</li>
      <li>list 2</li>
    </ul>`
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(md, '* list 1\n* list 2\n')
})

test('file 1', t => {
  const md = fs.readFileSync(__dirname + '/test1.html', 'utf-8')
  const html = html2markdown(md)
  t.is(typeof html, 'string')
  t.is(
    html,
    dedent`# TOC test

    ## Table of Contents

    ## 日本語セクション

    あああ

    ## foo

    \`\`\`
    function hello () {
      console.log('hi');
    }
    \`\`\`

    ## bar

    \`\`\`
    function hello () {
      console.log('wow');
    }
    \`\`\`

    ## pika

    \`\`\`
    function hello () {
      console.log('pika!');
    }
    \`\`\`\n`
  )
})

test('file 2', t => {
  const html = fs.readFileSync(__dirname + '/test2.html', 'utf-8')
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(
    md,
    dedent`hoge

    # 2019-08-29

    ## 今日やったこと

    * [x] Bash on Windowsを触る

      * Windowsを最新版 1903 にアップデート

    ## 明日どうするか\n`
  )
})

test('relative link', t => {
  const html = `
    <a href='about'>link</a>
    <img src='me.jpg' />
  `
  const md = html2markdown(html, { baseURI: 'https://www.craftz.dog/' })
  t.is(typeof md, 'string')
  t.is(
    md,
    '[link](https://www.craftz.dog/about) ![](https://www.craftz.dog/me.jpg)\n'
  )
})

test('table', t => {
  const html = dedent`
    <table>
      <thead>
        <tr>
          <td>header 1</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>column 1</td>
        </tr>
      </tbdoy>
    </table>
  `
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(
    md,
    dedent`| header 1 |
    | -------- |
    | column 1 |\n
  `
  )
})
