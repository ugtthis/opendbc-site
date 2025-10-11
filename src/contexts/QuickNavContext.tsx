import { createContext, useContext, type Accessor, type JSX } from 'solid-js'

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

export const useQuickNav = () => {
  const context = useContext(QuickNavContext)
  if (!context) {
    throw new Error('useQuickNav must be used within QuickNavProvider')
  }
  return context
}
