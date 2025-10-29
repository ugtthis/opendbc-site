import { useNavigate } from '@solidjs/router'
import RightArrowSvg from '~/lib/icons/right-arrow.svg?raw'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div class="min-h-screen bg-gray-100">
      <header class="py-4 border-black md:py-6 gradient-dark-forrest border-b-[3px] shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
        <div class="px-4 mx-auto md:px-6 max-w-[2200px]">
          <nav class="flex items-center text-sm font-medium text-white">
            <button onClick={() => navigate('/')} class="flex gap-1.5 items-center transition-colors hover:text-gray-200 hover:cursor-pointer">
              <div class="flex-shrink-0 w-3 h-3 rotate-180" innerHTML={RightArrowSvg} />
              <span>Home</span>
            </button>
          </nav>
        </div>
      </header>

      <main class="flex justify-center items-center p-8 min-h-[calc(100vh-80px)]">
        <div class="max-w-2xl text-center">
          <h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">404 - Page Not Found</h1>
          <p class="mb-8 text-lg text-gray-600">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <button
            onClick={() => navigate('/')}
            class="inline-block py-3 px-8 text-white border-2 border-black transition-colors hover:cursor-pointer bg-accent hover:bg-[#727272]"
          >
            Go Back Home
          </button>
        </div>
      </main>
    </div>
  )
}
