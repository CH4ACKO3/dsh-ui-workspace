# dsh-ui-workspace

Composable workspace primitives for DeepSeek Harness browser plugins. The
package provides draggable pane stacks, recursive tree views, tabbed document
editors, document renderers, actions, and VS Code-style explorer behavior.

`dsh-ui-workspace` builds on
[`dsh-ui-container`](https://github.com/CH4ACKO3/dsh-ui-container) and leaves
product-specific navigation, data providers, commands, and styling to the
consumer.

The dependency is intentional: Workspace document surfaces call the
container's `useUiSurface()` hook at runtime and share its `DocumentRef` and
`DocumentSnapshot` contracts. Container remains an independently installed
plugin and owns the single bundle row that provides the shared `uiContainer`
service; Workspace only consumes that service.

Install Container and Workspace as separate bundles in the same DeepSeek
Harness profile:

```sh
dsh plugin --profile web add github:CH4ACKO3/dsh-ui-container
dsh plugin --profile web add github:CH4ACKO3/dsh-ui-workspace
```

These commands are profile-scoped and can be run from any directory.

Git dependencies run both packages' `prepare` builds. With pnpm 10 or newer,
approve the exact package keys reported by the first install in the profile's
`pnpm-workspace.yaml`, then repeat the command. Registry releases and packed
artifacts do not require that approval. Container must remain installed while
Workspace is enabled.

```ts
import {
  DocumentSurface,
  ExplorerPaneStack,
  TabbedEditor,
  TreeView,
} from '@ch4acko3/dsh-ui-workspace/client'
```

The same package remains importable by browser plugins that compose these
primitives into product-specific pages.
