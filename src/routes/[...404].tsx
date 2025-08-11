import { A } from '@solidjs/router'

export default function NotFound() {
  return (
    <main class="p-4 mx-auto text-center text-gray-700">
      <h1 class="my-16 text-6xl font-thin uppercase max-6-xs text-sky-700">
        Not Found
      </h1>
      <p class="mt-8">
        Visit{' '}
        <a
          href="https://solidjs.com"
          target="_blank"
          class="hover:underline text-sky-600"
          rel="noopener"
        >
          solidjs.com
        </a>{' '}
        to learn how to build Solid apps.
      </p>
      <p class="my-4">
        <A href="/" class="hover:underline text-sky-600">
          Home
        </A>
        {' - '}
        <A href="/about" class="hover:underline text-sky-600">
          About Page
        </A>
      </p>
    </main>
  )
}
