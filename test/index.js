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
    <base href='https://www.craftz.dog/'>
    <a href='about'>link</a>
  `
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(md, '[link](https://www.craftz.dog/about)\n')
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
