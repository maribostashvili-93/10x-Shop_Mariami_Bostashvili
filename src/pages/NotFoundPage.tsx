import { Link } from "react-router";

function NotFoundPage() {
  return (
    <section className="mx-auto max-w-2xl py-16 text-center sm:py-24">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-900">404 error</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
        Page not found
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-slate-600">
        The page you are looking for does not exist or may have moved. Return to the shop to continue browsing.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-red-900 px-5 font-semibold text-white transition-colors hover:bg-red-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
      >
        Back to home
      </Link>
    </section>
  );
}

export default NotFoundPage;
