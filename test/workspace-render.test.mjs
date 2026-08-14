import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'

const requireNode = createRequire(import.meta.url)
const React = requireNode('react')
const { renderToStaticMarkup } = requireNode('react-dom/server')

async function loadClient() {
  const source = await readFile(new URL('../lib/client.js', import.meta.url), 'utf8')
  let factory
  vm.runInNewContext(source, {
    window: {
      __ModuleLoader__: {
        load(handoff) {
          factory = handoff.factory
        },
      },
    },
  })
  assert.equal(typeof factory, 'function')
  const primitives = new Proxy({}, { get: () => () => null })
  return factory((specifier) => {
    if (specifier === 'react') return { ...React, useLayoutEffect: React.useEffect }
    if (specifier === 'react/jsx-runtime') return requireNode('react/jsx-runtime')
    if (specifier === '@deepseek-ai/dsh-client-ui-primitives') return primitives
    if (specifier === '@ch4acko3/dsh-ui-container/client') return {}
    throw new Error(`Unexpected client dependency: ${specifier}`)
  })
}

test('stops cyclic trees at the first repeated node id', async () => {
  const { TreeView } = await loadClient()
  const root = { id: 'root', children: [] }
  root.children.push(root)

  const markup = renderToStaticMarkup(React.createElement(TreeView, {
    nodes: [root],
    ariaLabel: 'Cyclic tree',
    getId: (node) => node.id,
    getLabel: (node) => node.id,
    getChildren: (node) => node.children,
    isExpanded: () => true,
    onExpandedChange() {},
    onActivate() {},
  }))

  assert.equal((markup.match(/role="treeitem"/g) ?? []).length, 1)
})

test('links the active tab and panel in rendered ARIA markup', async () => {
  const { TabbedEditor } = await loadClient()
  const markup = renderToStaticMarkup(React.createElement(TabbedEditor, {
    tabs: [{ id: 'memory:one', title: 'Memory', document: { uri: 'memory:one' } }],
    activeTabId: 'memory:one',
    tabsLabel: 'Open pages',
    closeTabLabel: 'Close',
    empty: null,
    renderDocument: () => React.createElement('p', null, 'Document'),
    onActivate() {},
    onClose() {},
  }))
  const tabId = markup.match(/role="tab" id="([^"]+)"/)?.[1]

  assert.ok(tabId)
  assert.match(markup, new RegExp(`role="tabpanel" aria-labelledby="${tabId}"`))
})
