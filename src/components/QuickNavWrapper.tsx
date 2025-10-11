import type { JSX } from 'solid-js'
import { useQuickNav } from '~/contexts/QuickNavContext'

type QuickNavWrapperProps = {
  id: string
  variant?: 'border' | 'ring'
  class?: string
  children: JSX.Element
}

/**
 * Wrapper component for Quick Navigation highlighting.
 * Automatically highlights when id matches the active spec from context.
 * Handles both border and ring highlight styles with smooth transitions.
 *
 * Uses SolidJS fine-grained reactivity - only re-renders when highlight state changes.
 */
export default function QuickNavWrapper(props: QuickNavWrapperProps) {
  const { activeSpec } = useQuickNav()
  const variant = props.variant || 'border'

  // Fine-grained reactive computation - only this specific wrapper checks its highlight state
  const isActive = () => activeSpec() === props.id

  const highlightClasses = () => {
    if (!isActive()) return ''

    return variant === 'border'
      ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2'
      : 'ring-2 ring-blue-500 bg-blue-50'
  }

  return (
    <div
      id={props.id}
      class={`transition-all duration-300 ${highlightClasses()} ${props.class || ''}`}
    >
      {props.children}
    </div>
  )
}
