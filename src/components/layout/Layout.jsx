import { matchPath, Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Layout() {
  const { pathname } = useLocation()
  if (pathname === '/') {
    return (
      <main className="grid h-dvh grid-rows-1 place-items-center overflow-clip bg-brand-blue">
        <Outlet />
      </main>
    )
  }

  const isEventDetails = Boolean(matchPath('/event-details', pathname))
  const isEventPage = isEventDetails || Boolean(matchPath('/people', pathname))

  return (
    <div className={`flex min-h-screen flex-col ${isEventPage ? 'isolate' : ''}`}>
      <Navbar showPeopleLink={isEventDetails} />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <footer className={`w-full border-t border-brand-white/10 px-4 py-6 text-center sm:px-6 lg:px-8 ${isEventPage ? 'text-base' : 'text-sm'}`}>
        <p className="text-brand-white/70">The Exchange &copy; 2026</p>
      </footer>
    </div>
  )
}
