import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-brand-lime sm:text-5xl">
        404: Page not found
      </h1>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded px-4 py-2 text-base font-semibold text-brand-lime underline hover:opacity-80 sm:text-lg"
      >
        Back to home
      </Link>
    </section>
  )
}
