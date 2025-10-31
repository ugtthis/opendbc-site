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
        class={cn(
          'flex items-center justify-between px-4 py-4',
          'bg-black text-white transition-colors touch-manipulation cursor-pointer hover:bg-zinc-900',
        )}
        onClick={() => toggle.toggleSection(props.id)}
      >
        <h3 class="text-sm font-medium uppercase tracking-wide">{props.title}</h3>
        <div
          class={cn('h-3 w-3', isExpanded() && 'rotate-180')}
          innerHTML={DownChevronSvg}
        />
      </div>

      {/* Content - flexible wrapper */}
      <div class={cn('overflow-hidden', isExpanded() ? 'block' : 'hidden')}>
        <div class={contentClass}>
          {props.children}
        </div>
      </div>
    </div>
  )
}
