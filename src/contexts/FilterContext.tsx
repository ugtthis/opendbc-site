import { createContext, useContext, type ParentProps } from 'solid-js'
import { createSignal, type Accessor, type Setter, createMemo } from 'solid-js'
import type { Car } from '~/types/CarDataTypes'
import { normalize } from '~/lib/utils'
import carData from '~/data/metadata.json'

const searchAttributes = (car: Car, query: string): boolean => {
  const searchFields = [
    car.name,
    car.make,
    car.model,
    car.support_type,
    car.package,
    ...(car.year_list as string[])
  ]

  const searchText = normalize(searchFields.join(' '))
  const queryWords = normalize(query).trim().split(/\s+/)

  return queryWords.every(word => searchText.includes(word))
}

export type FilterState = {
  supportLevel: string
  make: string
  year: string
  hasUserVideo: string
  hasSetupVideo: string
}

export const filterLabels = {
  year: 'Year',
  make: 'Make',
  supportLevel: 'Support',
  hasUserVideo: 'Has Video',
  hasSetupVideo: 'Has Install Video'
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
    hasSetupVideo: '',
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
    if (currentFilters.hasSetupVideo) {
      if (currentFilters.hasSetupVideo === 'Yes') {
        result = result.filter((car) => car.setup_video !== null && car.setup_video !== '')
      } else if (currentFilters.hasSetupVideo === 'No') {
        result = result.filter((car) => car.setup_video === null || car.setup_video === '')
      }
    }

    const query = searchQuery().trim()
    if (query) {
      result = result.filter((car) => searchAttributes(car, query))
    }

    const sort = sortConfig()
    result.sort((a, b) => {
      if (query) {
        const normalizedQuery = normalize(query)
        // Sort priority: make prefix > make contains > model prefix > model contains
        const getScore = (car: Car) => {
          const make = normalize(car.make)
          const model = normalize(car.model)
          if (make.startsWith(normalizedQuery)) return 4
          if (make.includes(normalizedQuery)) return 3
          if (model.startsWith(normalizedQuery)) return 2
          if (model.includes(normalizedQuery)) return 1
          return 0
        }

        const scoreA = getScore(a)
        const scoreB = getScore(b)
        if (scoreA !== scoreB) return scoreB - scoreA
      }

      // Regular sorting
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
      hasSetupVideo: '',
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
