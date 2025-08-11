import { A } from '@solidjs/router'
import Counter from '~/components/Counter'

export default function About() {
  return (
    <main class="p-4 mx-auto text-center text-gray-700">
      <h1 class="my-16 text-6xl font-thin uppercase max-6-xs text-sky-700">
        About Page
      </h1>
      <Counter />
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
        <span>About Page</span>
      </p>
    </main>
  )
}
