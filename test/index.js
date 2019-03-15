// @flow
import test from 'ava'
import html2markdown from '../lib/'
import fs from 'fs'

test('convert html', t => {
  const html = `
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
      <h1>title<h1>
    </body>
  </html>
  `
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(md, '# title')
})

test('convert code', t => {
  const html = `
    <pre><code>code</code></pre>
  `
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(md, '```\ncode\n```')
})

test('convert pre', t => {
  const html = `<pre>pre</pre>`
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(md, '```\npre\n```')
})

test('convert github code block', t => {
  const html = `<pre style="word-break:normal;font-family:SFMono-Regular, Consolas, &quot;Liberation Mono&quot;, Menlo, Courier, monospace;box-sizing:border-box;margin-top:0px;word-wrap:normal;margin-bottom:0px;font-size:85%;padding:16px;overflow:auto;line-height:1.45;background-color:rgb(246, 248, 250);border-radius:3px;"><span style="box-sizing:border-box;color:rgb(215, 58, 73);">var</span> gpio <span style="box-sizing:border-box;color:rgb(215, 58, 73);">=</span> <span style="box-sizing:border-box;color:rgb(0, 92, 197);">require</span>(<span style="box-sizing:border-box;color:rgb(3, 47, 98);"><span style="box-sizing:border-box;color:rgb(3, 47, 98);">"</span><span style="box-sizing:border-box;"><a style="box-sizing:border-box;background-color:transparent;cursor:pointer;color:inherit;text-decoration:none;"><span style="box-sizing:border-box;">pi-gpio</span><span style="color:inherit;cursor:pointer;position:absolute;left:-4px;top:inherit;width:3px;transition:color 0.2s ease-out, color 450ms ease-in;"></span></a></span><span style="box-sizing:border-box;color:rgb(3, 47, 98);">"</span></span>);
<span style="box-sizing:border-box;color:rgb(36, 41, 46);">gpio</span>.<span style="box-sizing:border-box;color:rgb(0, 92, 197);">open</span>(<span style="box-sizing:border-box;color:rgb(0, 92, 197);">16</span>, <span style="box-sizing:border-box;color:rgb(3, 47, 98);"><span style="box-sizing:border-box;color:rgb(3, 47, 98);">"</span>output<span style="box-sizing:border-box;color:rgb(3, 47, 98);">"</span></span>, <span style="box-sizing:border-box;color:rgb(215, 58, 73);">function</span>(<span style="box-sizing:border-box;color:rgb(36, 41, 46);">err</span>) {    <span style="box-sizing:border-box;color:rgb(106, 115, 125);"><span style="box-sizing:border-box;color:rgb(106, 115, 125);">//</span> Open pin 16 for output</span>
  <span style="box-sizing:border-box;color:rgb(36, 41, 46);">gpio</span>.<span style="box-sizing:border-box;color:rgb(0, 92, 197);">write</span>(<span style="box-sizing:border-box;color:rgb(0, 92, 197);">16</span>, <span style="box-sizing:border-box;color:rgb(0, 92, 197);">1</span>, <span style="box-sizing:border-box;color:rgb(215, 58, 73);">function</span>() {    <span style="box-sizing:border-box;color:rgb(106, 115, 125);"><span style="box-sizing:border-box;color:rgb(106, 115, 125);">//</span> Set pin 16 high (1)</span>
    <span style="box-sizing:border-box;color:rgb(36, 41, 46);">gpio</span>.<span style="box-sizing:border-box;color:rgb(0, 92, 197);">close</span>(<span style="box-sizing:border-box;color:rgb(0, 92, 197);">16</span>);            <span style="box-sizing:border-box;color:rgb(106, 115, 125);"><span style="box-sizing:border-box;color:rgb(106, 115, 125);">//</span> Close pin 16</span>
  });
});</pre>`
  const md = html2markdown(html)
  t.is(typeof md, 'string')
  t.is(
    md,
    `\`\`\`
var gpio \\= require("pi-gpio");
gpio.open(16, "output", function(err) {    // Open pin 16 for output
  gpio.write(16, 1, function() {    // Set pin 16 high (1)
    gpio.close(16);            // Close pin 16
  });
});
\`\`\``
  )
})

test('convert list', t => {
  const md = `
    <ul>
      <li>list 1</li>
      <li>list 2</li>
    </ul>
  `
  const html = html2markdown(md)
  t.is(typeof html, 'string')
  t.is(html, '* list 1\n* list 2')
})

test('file 1', t => {
  const md = fs.readFileSync(__dirname + '/test1.html', 'utf-8')
  const html = html2markdown(md)
  t.is(typeof html, 'string')
  t.is(
    html,
    `# TOC test

## Table of Contents

## 日本語セクション

あああ

## foo

\`\`\`
function  hello  ()  {
  console.log('hi');
} 
\`\`\`

## bar

\`\`\`
function  hello  ()  {
  console.log('wow');
} 
\`\`\`

## pika

\`\`\`
function  hello  ()  {
  console.log('pika!');
} 
\`\`\``
  )
})
