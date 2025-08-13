import { type Component, onMount, onCleanup, For, Show } from 'solid-js'
import { isServer } from 'solid-js/web'
import { cn } from '~/lib/utils'

type CustomDropdownProps = {
  options: string[]
  value: string
  onChange: (value: string) => void
  label: string
  isOpen: boolean
  onToggle: () => void
}

const CustomDropdown: Component<CustomDropdownProps> = (props) => {
  let dropdownRef: HTMLDivElement | undefined

  const handleClickOutside = (e: MouseEvent) => {
    if (props.isOpen && dropdownRef && !dropdownRef.contains(e.target as Node)) {
      props.onToggle()
    }
  }

  onMount(() => {
    if (!isServer) {
      document.addEventListener('mousedown', handleClickOutside)
    }
  })

  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  })

  const handleSelect = (value: string) => {
    props.onChange(value)
    props.onToggle()
  }

  return (
    <div class="space-y-2" ref={dropdownRef}>
      <span class="block font-medium text-black">{props.label}</span>
      <div class="w-full">
        <button
          type="button"
          onClick={props.onToggle}
          class={cn(
            'w-full p-4 text-left border border-black bg-white flex justify-between items-center',
            'hover:bg-[#F3F3F3] transition-colors',
          )}
        >
          <span>{props.value || 'All'}</span>
          <svg
            class={`w-6 h-6 transition-transform ${props.isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <Show when={props.isOpen}>
          <div class="overflow-y-auto w-full bg-white border border-t-0 border-black max-h-[200px]">
            <button
              class={cn('w-full h-[40px] px-4 text-left hover:bg-gray-100', !props.value ? 'bg-gray-100' : '')}
              onClick={() => handleSelect('')}
            >
              All
            </button>
            <For each={props.options}>
              {(option) => (
                <button
                  class={cn('w-full h-[40px] px-4 text-left hover:bg-gray-100', props.value === option ? 'bg-gray-100' : '')}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  )
}

export default CustomDropdown
