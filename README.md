# dsh-ui-workbench

Composable workbench primitives for DeepSeek Harness browser plugins. The
package provides draggable pane stacks, recursive tree views, tabbed document
editors, document renderers, actions, and VS Code-style explorer behavior.

`dsh-ui-workbench` builds on
[`dsh-ui-container`](https://github.com/CH4ACKO3/dsh-ui-container) and leaves
product-specific navigation, data providers, commands, and styling to the
consumer.

The dependency is intentional: Workbench document surfaces call the
container's `useUiSurface()` hook at runtime and share its `DocumentRef` and
`DocumentSnapshot` contracts. The container is declared as a peer so the host
owns one surface context instead of Workbench installing a second copy.

```ts
import {
  DocumentSurface,
  ExplorerPaneStack,
  TabbedEditor,
  TreeView,
} from '@ch4acko3/dsh-ui-workbench/client'
```

This is a library package rather than a directly installable DSH bundle.
