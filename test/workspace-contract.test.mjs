import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const sourceRoot = '../src/client/'

test('keeps editor tabs independent from document providers', async () => {
  const tabs = await readFile(new URL(`${sourceRoot}TabbedEditor.tsx`, import.meta.url), 'utf8')

  assert.match(tabs, /document: DocumentRef/)
  assert.match(tabs, /renderDocument: \(document: DocumentRef\)/)
  assert.doesNotMatch(tabs, /preview-data|PreviewDocument|DocumentDetail/)
})

test('publishes reusable panes and document actions', async () => {
  const panes = await readFile(new URL(`${sourceRoot}ExplorerPaneStack.tsx`, import.meta.url), 'utf8')
  const actions = await readFile(new URL(`${sourceRoot}DocumentActions.tsx`, import.meta.url), 'utf8')
  const entry = await readFile(new URL(`${sourceRoot}index.ts`, import.meta.url), 'utf8')

  assert.match(panes, /class ExplorerPaneRegistry/)
  assert.match(panes, /minimumBodyHeight\?: number/)
  assert.match(actions, /class DocumentActionRegistry/)
  assert.match(entry, /DocumentSurface/)
  assert.match(entry, /ExplorerPaneStack/)
  assert.doesNotMatch(entry, /conversation\.view|ctx\.provide/)
})

test('provides accessible tree, tab, and sash interactions', async () => {
  const tree = await readFile(new URL(`${sourceRoot}TreeView.tsx`, import.meta.url), 'utf8')
  const tabs = await readFile(new URL(`${sourceRoot}TabbedEditor.tsx`, import.meta.url), 'utf8')
  const sash = await readFile(new URL(`${sourceRoot}Sash.tsx`, import.meta.url), 'utf8')

  assert.match(tree, /role="treeitem"/)
  assert.match(tree, /event\.key === 'ArrowRight'/)
  assert.match(tree, /typeahead/)
  assert.match(tree, /dsh-workspace-tree-sticky-scroll/)
  assert.match(tree, /addEventListener\('scroll'/)
  assert.match(tabs, /data-preview/)
  assert.match(tabs, /scrollIntoView/)
  assert.match(tabs, /aria-labelledby/)
  assert.match(tree, /MAX_TREE_DEPTH/)
  assert.match(tree, /seenIds/)
  assert.match(sash, /setPointerCapture/)
  assert.match(sash, /role="separator"/)
})

test('ships an independently installable DSH client bundle over Container', async () => {
  const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
  const patch = await readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
  const host = await readFile(new URL('../src/index.ts', import.meta.url), 'utf8')
  const client = await readFile(new URL(`${sourceRoot}index.ts`, import.meta.url), 'utf8')

  assert.equal(packageJson.dsh.bundle.patch, './cordis.patch.yml')
  assert.equal(packageJson.dsh.client.immediately, true)
  assert.deepEqual(packageJson.dsh.client.inject, [
    '@deepseek-ai/dsh-client-runtime',
    '@deepseek-ai/dsh-client-ui-primitives',
    '@ch4acko3/dsh-ui-container',
  ])
  assert.equal(packageJson.exports['.'].default, './lib/index.js')
  assert.equal(packageJson.exports['./client'].default, './lib/client.js')
  assert.equal(packageJson.peerDependencies['@ch4acko3/dsh-ui-container'], '^0.1.0')
  assert.equal(packageJson.peerDependenciesMeta, undefined)
  assert.doesNotMatch(patch, /id: ch4acko3-ui-container/)
  assert.match(patch, /id: ch4acko3-ui-workspace/)
  assert.match(host, /export function apply\(\): void/)
  assert.match(client, /inject = \['uiContainer'\]/)
})
