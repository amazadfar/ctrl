import { useEffect, useMemo, useState } from 'react'
import { NavContext, type Nav, type Route } from './nav'
import { ActiveScreen } from './screens/Active'
import { CheckInScreen } from './screens/CheckIn'
import { HistoryScreen } from './screens/History'
import { ModeScreen } from './screens/Mode'
import { ModeEditorScreen } from './screens/ModeEditor'
import { ModesScreen } from './screens/Modes'
import { ScaleScreen } from './screens/Scale'
import { SessionScreen } from './screens/Session'
import { SettingsScreen } from './screens/Settings'
import { getData } from './store'

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case 'modes':
      return <ModesScreen />
    case 'mode':
      return <ModeScreen id={route.id} />
    case 'edit':
      return <ModeEditorScreen id={route.id} />
    case 'active':
      return <ActiveScreen />
    case 'checkin':
      return <CheckInScreen />
    case 'history':
      return <HistoryScreen />
    case 'session':
      return <SessionScreen id={route.id} />
    case 'settings':
      return <SettingsScreen />
    case 'scale':
      return <ScaleScreen kind={route.kind} id={route.id} />
  }
}

export function App() {
  // Reopening the app mid-session lands straight on the engaged mode.
  const [stack, setStack] = useState<Route[]>(() =>
    getData().active ? [{ name: 'modes' }, { name: 'active' }] : [{ name: 'modes' }],
  )

  const nav = useMemo<Nav>(
    () => ({
      push: (route) => setStack((s) => [...s, route]),
      back: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
      reset: (...routes) => setStack(routes),
    }),
    [],
  )

  const route = stack[stack.length - 1]
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [route])

  return (
    <NavContext.Provider value={nav}>
      <div className="app">
        <Screen key={stack.length} route={route} />
      </div>
    </NavContext.Provider>
  )
}
