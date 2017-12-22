// @flow
import test from 'ava'
import html2markdown from '../lib/'

test('convert html', t => {
  const md = `
    <h1>title<h1>
  `
  const html = html2markdown(md)
  t.is(typeof html, 'string')
  t.is(html, '# title')
})

test('convert code', t => {
  const md = `
    <pre><code>code</code></pre>
  `
  const html = html2markdown(md)
  t.is(typeof html, 'string')
  t.is(html, '```\ncode\n```')
})

test('convert pre', t => {
  const md = `
    <pre>pre</pre>
  `
  const html = html2markdown(md)
  t.is(typeof html, 'string')
  t.is(html, 'pre')
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
