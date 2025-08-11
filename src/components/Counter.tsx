import { createSignal } from 'solid-js'

export default function Counter() {
  const [count, setCount] = createSignal(0)
  return (
    <button
      type="button"
      class="bg-gray-100 rounded-full border-2 border-gray-300 focus:border-gray-400 active:border-gray-400 w-[200px] px-[2rem] py-[1rem]"
      onClick={() => setCount(count() + 1)}
    >
      Clicks: {count()}
    </button>
  )
}
