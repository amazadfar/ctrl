import { useEffect, useMemo, useState } from 'react'
import { NavContext, type Nav, type Route } from './nav'
import { ActiveScreen } from './screens/Active'
import { CheckInScreen } from './screens/CheckIn'
import { DriverScreen } from './screens/Driver'
import { HistoryScreen } from './screens/History'
import { HomeScreen } from './screens/Home'
import { ModeScreen } from './screens/Mode'
import { ModeEditorScreen } from './screens/ModeEditor'
import { ScaleScreen } from './screens/Scale'
import { SessionScreen } from './screens/Session'
import { SettingsScreen } from './screens/Settings'

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case 'home':
      return <HomeScreen />
    case 'driver':
      return <DriverScreen id={route.id} />
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
  // The desk is always the first page; an engaged mode shows in its status bar.
  const [stack, setStack] = useState<Route[]>([{ name: 'home' }])

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
