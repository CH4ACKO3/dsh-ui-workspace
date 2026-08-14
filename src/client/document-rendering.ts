import type { ReactNode } from 'react'
import type { DocumentRef, DocumentSnapshot } from '@memorax-agent/dsh-ui-container/client'

export type RenderDocumentPart = (document: DocumentSnapshot) => ReactNode

export type DocumentRenderRequest = {
  surfaceId: string
  sessionId: string
  mode?: string
  context: Readonly<Record<string, unknown>>
  document: DocumentSnapshot
  openDocument: (document: DocumentRef) => void
  renderPart: RenderDocumentPart
}
