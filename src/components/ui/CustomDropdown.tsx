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
            'w-full p-4 text-left border border-black bg-white flex justify-between items-center',
            'hover:bg-[#F3F3F3] transition-colors cursor-pointer',
          )}
        >
          <span>{props.value || 'All'}</span>
          <img
            src={downChevronIcon}
            alt=""
            width="24"
            height="24"
            class={`transition-transform ${isOpen() ? 'rotate-180' : ''} opacity-60`}
          />
        </button>

        <Show when={isOpen()}>
          <div class="overflow-y-auto w-full bg-white border border-t-0 border-black max-h-[200px]">
            <button
              class={cn(
                'w-full h-[40px] px-4 text-left hover:bg-gray-100 cursor-pointer',
                !props.value ? 'bg-gray-100' : '',
              )}
              onClick={() => handleSelect('')}
            >
              All
            </button>
            <For each={props.options}>
              {(option) => (
                <button
                  class={cn(
                    'w-full h-[40px] px-4 text-left hover:bg-gray-100 cursor-pointer',
                    props.value === option ? 'bg-gray-100' : '',
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
