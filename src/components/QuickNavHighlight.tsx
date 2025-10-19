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
  variant?: 'border' | 'outline'
  class?: string
  children: JSX.Element
}

export function QuickNavWrapper(props: QuickNavWrapperProps) {
  const { activeSpec } = useQuickNav()
  const variant = props.variant || 'border'
  const isActive = () => activeSpec() === props.id

  const getClasses = () => {
    if (!isActive()) return props.class || ''

    const highlight =
      variant === 'border'
        ? 'border-2 border-blue-500 rounded px-2 -mx-2'
        : 'outline outline-3 outline-blue-500 outline-offset-[-8px]'

    const childOverrides = '[&_*]:!bg-[var(--color-highlight-bg)]'

    return `${highlight} ${childOverrides} ${props.class || ''}`
  }

  return (
    <div
      id={props.id}
      class={`transition-all duration-300 ${getClasses()}`}
      style={isActive() ? { 'background-color': 'var(--color-highlight-bg)' } : {}}
    >
      {props.children}
    </div>
  )
}
