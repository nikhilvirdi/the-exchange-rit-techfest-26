import { Link } from 'react-router-dom'

export default function Navbar({ showPeopleLink = false }) {
  return (
    <header className="w-full border-b border-brand-white/10">
      <nav className="mx-auto flex max-w-7xl items-center gap-x-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center text-xl font-bold tracking-wider text-brand-lime hover:opacity-90 sm:text-2xl"
        >
          THE EXCHANGE
        </Link>
        <Link to={showPeopleLink ? '/people' : '/event-details'} className="ml-auto inline-flex min-h-[44px] min-w-0 items-center justify-end text-right text-xl font-bold text-brand-white hover:opacity-90 sm:text-2xl">
          {showPeopleLink ? 'FACES OF THE EXCHANGE' : 'Event Details'}
        </Link>
      </nav>
    </header>
  )
}
