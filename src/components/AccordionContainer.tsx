import type { JSX } from 'solid-js'
import { useToggle } from '~/contexts/ToggleContext'
import { cn } from '~/lib/utils'
import DownChevronSvg from '~/lib/icons/down-chevron.svg?raw'

type AccordionContainerProps = {
  title: string
  children: JSX.Element
  id: string
  contentClass?: string
  disableDefaultPadding?: boolean
}

export default function AccordionContainer(props: AccordionContainerProps) {
  const toggle = useToggle()

  // Check if this section is expanded
  const isExpanded = () => toggle.openSections().has(props.id)

  // Compute content wrapper classes
  const defaultPadding = props.disableDefaultPadding ? "" : "p-6"
  const defaultContentClass = `bg-white ${defaultPadding}`
  const contentClass = props.contentClass
    ? cn(defaultContentClass, props.contentClass)
    : defaultContentClass

  return (
    <div class="border border-black">
      {/* Header */}
      <div
        class="flex justify-between items-center py-4 px-4 text-white bg-black transition-colors cursor-pointer hover:bg-gray-800 touch-manipulation"
        onClick={() => toggle.toggleSection(props.id)}
      >
        <h3 class="text-sm font-medium tracking-wide uppercase">{props.title}</h3>
        <div
          class={`w-3 h-3 ${isExpanded() ? 'rotate-180' : ''}`}
          innerHTML={DownChevronSvg}
        />
      </div>

      {/* Content - flexible wrapper */}
      <div class={`overflow-hidden ${
        isExpanded() ? 'block' : 'hidden'
      }`}>
        <div class={contentClass}>
          {props.children}
        </div>
      </div>
    </div>
  )
}
