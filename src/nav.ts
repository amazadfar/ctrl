import { createContext, useContext } from 'react'
import type { ScaleKind } from './actions'

export type Route =
  | { name: 'modes' }
  | { name: 'mode'; id: string }
  | { name: 'edit'; id: string }
  | { name: 'active' }
  | { name: 'checkin' }
  | { name: 'history' }
  | { name: 'session'; id: string }
  | { name: 'settings' }
  | { name: 'scale'; kind: ScaleKind; id: string }

export interface Nav {
  push(route: Route): void
  back(): void
  /** Replace the whole stack, e.g. to land on Active after engaging. */
  reset(...routes: Route[]): void
}

export const NavContext = createContext<Nav | null>(null)

export function useNav(): Nav {
  const nav = useContext(NavContext)
  if (!nav) throw new Error('useNav must be used inside NavContext')
  return nav
}
