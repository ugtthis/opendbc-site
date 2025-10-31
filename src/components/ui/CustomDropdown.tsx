import {
  type Component,
  onMount,
  onCleanup,
  For,
  Show,
  createSignal,
} from 'solid-js'
import { isServer } from 'solid-js/web'
import { cn } from '~/lib/utils'
import downChevronIcon from '~/lib/icons/down-chevron.svg?url'

type CustomDropdownProps = {
  options: string[]
  value: string
  onChange: (value: string) => void
  label: string
}

const CustomDropdown: Component<CustomDropdownProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false)
  let dropdownRef: HTMLDivElement | undefined

  const handleClickOutside = (e: MouseEvent) => {
    if (isOpen() && dropdownRef && !dropdownRef.contains(e.target as Node)) {
      setIsOpen(false)
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
    setIsOpen(false)
  }

  return (
    <div class="space-y-2" ref={dropdownRef}>
      <span class="block font-medium text-black">{props.label}</span>
      <div class="w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen())}
          class={cn(
            'flex w-full items-center justify-between border border-black bg-white',
            'p-4 text-left transition-colors cursor-pointer hover:bg-surface',
          )}
        >
          <span>{props.value || 'All'}</span>
          <img
            src={downChevronIcon}
            alt=""
            width="24"
            height="24"
            class={cn(
              'opacity-60 transition-transform',
              isOpen() && 'rotate-180',
            )}
          />
        </button>

        <Show when={isOpen()}>
          <div class="max-h-[200px] w-full overflow-y-auto border border-t-0 border-black bg-white">
            <button
              class={cn(
                'h-[40px] w-full px-4 text-left cursor-pointer hover:bg-gray-100',
                !props.value && 'bg-gray-100',
              )}
              onClick={() => handleSelect('')}
            >
              All
            </button>
            <For each={props.options}>
              {(option) => (
                <button
                  class={cn(
                    'h-[40px] w-full px-4 text-left cursor-pointer hover:bg-gray-100',
                    props.value === option && 'bg-gray-100',
                  )}
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
