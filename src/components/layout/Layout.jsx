import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <footer className="w-full border-t border-brand-white/10 px-4 py-6 text-center text-sm sm:px-6 lg:px-8">
        <p className="text-brand-white/70">The Exchange &copy; 2026</p>
      </footer>
    </div>
  )
}
