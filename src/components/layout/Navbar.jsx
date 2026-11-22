import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="w-full border-b border-brand-white/10">
      <nav className="mx-auto flex max-w-7xl items-center px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex min-h-[44px] min-w-[44px] items-center text-xl font-bold tracking-wider text-brand-lime hover:opacity-90 sm:text-2xl"
        >
          THE EXCHANGE
        </Link>
      </nav>
    </header>
  )
}
