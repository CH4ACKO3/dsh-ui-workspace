# dsh-ui-workbench

Composable workbench primitives for DeepSeek Harness browser plugins. The
package provides draggable pane stacks, recursive tree views, tabbed document
editors, document renderers, actions, and VS Code-style explorer behavior.

`dsh-ui-workbench` builds on
[`dsh-ui-container`](https://github.com/CH4ACKO3/dsh-ui-container) and leaves
product-specific navigation, data providers, commands, and styling to the
consumer.

```ts
import {
  DocumentSurface,
  ExplorerPaneStack,
  TabbedEditor,
  TreeView,
} from '@memorax-agent/dsh-ui-workbench/client'
```

This is a library package rather than a directly installable DSH bundle.
