import { createContext, useContext, createSignal, createEffect, type Accessor, type JSX } from 'solid-js'

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
  const [foundByUser, setFoundByUser] = createSignal(false)

  createEffect((prev) => {
    const current = activeSpec()
    if (current === props.id && current !== prev) {
      setFoundByUser(false)
    }
    return current
  })

  const shouldHighlight = () => activeSpec() === props.id && !foundByUser()

  const blueHighlight = variant === 'border'
    ? 'border-2 border-blue-500 px-2 -mx-2'
    : 'outline outline-3 outline-blue-500 outline-offset-[-8px] px-2'

  const classes = () => {
    if (!shouldHighlight()) {
      return props.class || ''
    }

    const transition = 'transition-all duration-300'
    // Override child backgrounds to match highlight background
    const childBg = '[&_*]:!bg-[var(--color-highlight-bg)]'

    return `${transition} ${blueHighlight} ${childBg} ${props.class || ''}`
  }

  return (
    <div
      id={props.id}
      class={classes()}
      style={shouldHighlight() ? { 'background-color': 'var(--color-highlight-bg)' } : {}}
      onMouseEnter={() => setFoundByUser(true)}
      onClick={() => setFoundByUser(true)}
    >
      {props.children}
    </div>
  )
}
