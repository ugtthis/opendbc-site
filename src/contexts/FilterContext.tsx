import { createContext, useContext, type ParentProps } from 'solid-js'
import { createSignal, type Accessor, type Setter } from 'solid-js'
import type { FilterState } from '~/components/FilterModal'

type FilterContextValue = {
  filters: Accessor<FilterState>
  setFilters: Setter<FilterState>
  removeFilter: (key: keyof FilterState) => void
  clearAllFilters: () => void
  searchQuery: Accessor<string>
  setSearchQuery: Setter<string>
}

const FilterContext = createContext<FilterContextValue>()

export const FilterProvider = (props: ParentProps) => {
  const [filters, setFilters] = createSignal<FilterState>({
    year: '',
    make: '',
    supportType: '',
  })

  const [searchQuery, setSearchQuery] = createSignal('')

  const removeFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: '',
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      year: '',
      make: '',
      supportType: '',
    })
  }

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        removeFilter,
        clearAllFilters,
        searchQuery,
        setSearchQuery,
      }}
    >
      {props.children}
    </FilterContext.Provider>
  )
}

export const useFilter = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  return context
}
