import { createContext, useContext, createSignal, createEffect, type Accessor, type JSX } from 'solid-js'

export const HIGHLIGHT_STYLES = {
  bg: 'bg-blue-50',
  border: 'outline outline-4 outline-blue-500 outline-offset-[-8px] px-2',
  borderColor: 'border-blue-400',
  transition: 'transition-all duration-300',
} as const

type QuickNavContextType = {
  activeSpec: Accessor<string | null>
  isHighlighted: Accessor<boolean>
}

const QuickNavContext = createContext<QuickNavContextType>()

export function QuickNavProvider(props: {
  activeSpec: Accessor<string | null>
  children: JSX.Element
}) {
  return (
    <QuickNavContext.Provider
      value={{
        activeSpec: props.activeSpec,
        isHighlighted: () => false
      }}
    >
      {props.children}
    </QuickNavContext.Provider>
  )
}

export const useQuickNavScrollTarget = () => {
  const context = useContext(QuickNavContext)
  if (!context) return { isActive: () => false }

  return { isActive: context.isHighlighted }
}

// Wraps an element to track when it's the scroll target
export function QuickNavWrapper(props: {
  id: string
  class?: string
  children: JSX.Element
}) {
  const parentContext = useContext(QuickNavContext)
  const [foundByUser, setFoundByUser] = createSignal(false)

  // Reset highlight when this becomes the new target
  createEffect((prev) => {
    const current = parentContext?.activeSpec()
    if (current === props.id && current !== prev) {
      setFoundByUser(false)
    }
    return current
  })

  const shouldHighlight = () => {
    return parentContext?.activeSpec() === props.id && !foundByUser()
  }

  return (
    <QuickNavContext.Provider
      value={{
        activeSpec: parentContext?.activeSpec || (() => null),
        isHighlighted: shouldHighlight
      }}
    >
      <div
        id={props.id}
        class={props.class}
        onMouseEnter={() => setFoundByUser(true)}
        onClick={() => setFoundByUser(true)}
      >
        {props.children}
      </div>
    </QuickNavContext.Provider>
  )
}
