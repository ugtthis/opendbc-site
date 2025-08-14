import { createContext, useContext, type ParentProps } from 'solid-js'
import { createSignal, type Accessor, type Setter, createMemo } from 'solid-js'
import type { Car } from '~/types/CarDataTypes'
import carData from '~/data/metadata.json'

const searchAttributes = (car: Car, query: string): boolean => {
  const searchFields = [
    car.make,
    car.model,
    car.support_type,
    car.package,
    car.year_list,
  ]

  return searchFields.some((field) =>
    String(field || '').toLowerCase().includes(query),
  )
}

export type FilterState = {
  supportLevel: string
  make: string
  year: string
  hasUserVideo: string
}

export const filterLabels = {
  year: 'Year',
  make: 'Make',
  supportLevel: 'Support',
  hasUserVideo: 'Has Video'
} as const

export type SortField = keyof Pick<Car, 'make' | 'support_type' | 'year_list'>

export type SortConfig = {
  field: SortField
  order: 'ASC' | 'DESC'
}

type FilterContextValue = {
  filters: Accessor<FilterState>
  setFilters: Setter<FilterState>
  removeFilter: (key: keyof FilterState) => void
  clearAllFilters: () => void
  searchQuery: Accessor<string>
  setSearchQuery: Setter<string>
  sortConfig: Accessor<SortConfig>
  setSortConfig: Setter<SortConfig>
  filteredResults: Accessor<Car[]>
  resultCount: Accessor<number>
  hasActiveFilters: Accessor<boolean>
}

const FilterContext = createContext<FilterContextValue>()

export const FilterProvider = (props: ParentProps) => {
  const [filters, setFilters] = createSignal<FilterState>({
    supportLevel: '',
    make: '',
    year: '',
    hasUserVideo: '',
  })

  const [searchQuery, setSearchQuery] = createSignal('')

  const [sortConfig, setSortConfig] = createSignal<SortConfig>({
    field: 'make',
    order: 'ASC',
  })

  const typedCarData = carData as Car[]

  const filteredResults = createMemo(() => {
    let result = [...typedCarData]
    const currentFilters = filters()

    if (currentFilters.supportLevel) {
      result = result.filter(
        (car) => car.support_type === currentFilters.supportLevel,
      )
    }
    if (currentFilters.make) {
      result = result.filter((car) => car.make === currentFilters.make)
    }
    if (currentFilters.year) {
      result = result.filter((car) =>
        (car.year_list as string[]).includes(currentFilters.year),
      )
    }
    if (currentFilters.hasUserVideo) {
      if (currentFilters.hasUserVideo === 'Yes') {
        result = result.filter((car) => car.video !== null && car.video !== '')
      } else if (currentFilters.hasUserVideo === 'No') {
        result = result.filter((car) => car.video === null || car.video === '')
      }
    }

    // Apply search query
    const query = searchQuery().toLowerCase().trim()
    if (query) {
      result = result.filter((car) => searchAttributes(car, query))
    }

    // Apply sorting
    const sort = sortConfig()
    result.sort((a, b) => {
      const field: SortField = sort.field
      let aVal: string | number | string[] = a[field]
      let bVal: string | number | string[] = b[field]

      if (field === 'year_list') {
        aVal = parseInt((aVal as string[])[0] || '0', 10)
        bVal = parseInt((bVal as string[])[0] || '0', 10)
      }

      if (sort.order === 'ASC') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
      }
    })

    return result
  })

  const resultCount = createMemo(() => filteredResults().length)

  const hasActiveFilters = createMemo(() => {
    const currentFilters = filters()
    return (
      Object.values(currentFilters).some((value) => value !== '') ||
      searchQuery().trim().length > 0
    )
  })

  const removeFilter = (key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: '',
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      supportLevel: '',
      make: '',
      year: '',
      hasUserVideo: '',
    })
    setSearchQuery('')
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
        sortConfig,
        setSortConfig,
        filteredResults,
        resultCount,
        hasActiveFilters,
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
