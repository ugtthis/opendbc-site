import { createMemo } from 'solid-js'
import { useToggle } from '~/contexts/ToggleContext'
import DoubleChevronSvg from '~/lib/icons/double-chevron.svg?raw'

export default function MasterToggle() {
  const toggle = useToggle()

  // Check if any sections are open
  const anyOpen = createMemo(() => toggle.openSections().size > 0)

  const chevronRotation = createMemo(() => {
    return anyOpen() ? 'rotate-180' : 'rotate-0'
  })

  // Button text for accessibility and clarity
  const buttonText = createMemo(() => {
    return anyOpen() ? 'Collapse All' : 'Expand All'
  })

  return (
    <button
      onClick={toggle.toggleAll}
      class="flex w-14 flex-shrink-0 items-center justify-center bg-gray-500 transition-colors cursor-pointer hover:bg-gray-600"
      title={buttonText()}
    >
      {/* Double chevron SVG */}
      <div
        class={`${chevronRotation()}`}
        innerHTML={DoubleChevronSvg.replace('fill="#000000"', 'fill="currentColor"')}
        style="color: white;"
      />
    </button>
  )
}
