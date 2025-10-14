import { createContext, useContext, type Accessor, type JSX } from 'solid-js'

/*
 * Quick Navigation Highlighting System
 * Provides context for sharing the currently active spec across the page
 * and a wrapper component that automatically highlights when active.
 */

type QuickNavContextType = {
  activeSpec: Accessor<string | null>
}

const QuickNavContext = createContext<QuickNavContextType>()

export function QuickNavProvider(props: {
  activeSpec: Accessor<string | null>
  children: JSX.Element
}) {
  return (
    <QuickNavContext.Provider value={{ activeSpec: props.activeSpec }}>
      {props.children}
    </QuickNavContext.Provider>
  )
}

const useQuickNav = () => {
  const context = useContext(QuickNavContext)
  if (!context) {
    throw new Error('useQuickNav must be used within QuickNavProvider')
  }
  return context
}

// Wrapper component that highlights when its id matches activeSpec
type QuickNavWrapperProps = {
  id: string
  variant?: 'border' | 'ring'
  class?: string
  children: JSX.Element
}

export function QuickNavWrapper(props: QuickNavWrapperProps) {
  const { activeSpec } = useQuickNav()
  const variant = props.variant || 'border'

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
