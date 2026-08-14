import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'

export const name = '@ch4acko3/dsh-ui-workspace'
export const inject = ['uiContainer'] as const

/** Activate the Workspace layer after the Container service is available. */
export function apply(_ctx: ClientContext): void {}

export * from './DocumentActions.js'
export * from './DocumentSurface.js'
export * from './ExplorerPaneStack.js'
export * from './ExplorerScrollPane.js'
export * from './Sash.js'
export * from './TabbedEditor.js'
export * from './TreeView.js'
export * from './document-rendering.js'
