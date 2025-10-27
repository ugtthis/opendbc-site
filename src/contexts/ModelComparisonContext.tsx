import { createContext, useContext, type ParentProps } from 'solid-js'
import { createSignal, type Accessor, type Setter } from 'solid-js'

type ModelComparisonContextValue = {
  compareMode: Accessor<boolean>
  setCompareMode: Setter<boolean>
  selectedCars: Accessor<string[]>
  toggleCarSelection: (carName: string) => void
  clearSelectedCars: () => void
}

const ModelComparisonContext = createContext<ModelComparisonContextValue>()

export const ModelComparisonProvider = (props: ParentProps) => {
  const [compareMode, setCompareMode] = createSignal(false)
  const [selectedCars, setSelectedCars] = createSignal<string[]>([])

  const toggleCarSelection = (carName: string) => {
    setSelectedCars((prev) => {
      if (prev.includes(carName)) {
        return prev.filter((name) => name !== carName)
      } else if (prev.length < 6) {
        return [...prev, carName]
      }
      return prev
    })
  }

  const clearSelectedCars = () => {
    setSelectedCars([])
  }

  return (
    <ModelComparisonContext.Provider
      value={{
        compareMode,
        setCompareMode,
        selectedCars,
        toggleCarSelection,
        clearSelectedCars,
      }}
    >
      {props.children}
    </ModelComparisonContext.Provider>
  )
}

export const useModelComparison = () => {
  const context = useContext(ModelComparisonContext)
  if (!context) {
    throw new Error('useModelComparison must be used within a ModelComparisonProvider')
  }
  return context
}

