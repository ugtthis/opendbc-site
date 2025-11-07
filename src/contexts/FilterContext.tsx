import { createContext, useContext, type ParentProps } from 'solid-js'
import { createSignal, type Accessor, type Setter, createMemo } from 'solid-js'
import type { Car } from '~/types/CarDataTypes'
import { normalize } from '~/lib/utils'
import carData from '~/data/metadata.json'
import longitudinalReports from '~/data/longitudinal_reports.json'

type SearchableCar = Car & {
  searchText: string
}

function buildSearchText(car: Car): string {
  return [
    car.name,
    car.make,
    car.model,
    car.support_type,
    car.package,
    ...car.year_list
  ].join(' ')
}

function matchesQuery(car: SearchableCar, query: string): boolean {
  const words = normalize(query).trim().split(/\s+/)
  return words.every(word => car.searchText.includes(word))
}

function getRelevanceScore(car: Car, normalizedQuery: string): number {
  const make = normalize(car.make)
  const model = normalize(car.model)

  if (make.startsWith(normalizedQuery)) return 4
  if (make.includes(normalizedQuery)) return 3
  if (model.startsWith(normalizedQuery)) return 2
  if (model.includes(normalizedQuery)) return 1
  return 0
}

export type FilterState = {
  supportLevel: string
  make: string
  year: string
  hasUserVideo: string
  hasSetupVideo: string
  hasLongitudinalReport: string
}

export const filterLabels = {
  year: 'Year',
  make: 'Make',
  supportLevel: 'Support',
  hasUserVideo: 'Has Video',
  hasSetupVideo: 'Has Install Video',
  hasLongitudinalReport: 'Has Report'
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
  filteredResults: Accessor<SearchableCar[]>
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
    hasLongitudinalReport: '',
  })

  const [searchQuery, setSearchQuery] = createSignal('')

  const [sortConfig, setSortConfig] = createSignal<SortConfig>({
    field: 'make',
    order: 'ASC',
  })

  const searchableCars: SearchableCar[] = (carData as Car[]).map(car => ({
    ...car,
    searchText: normalize(buildSearchText(car))
  }))

  const filteredResults = createMemo(() => {
    let result = [...searchableCars]
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
    if (currentFilters.hasLongitudinalReport) {
      const shouldHaveReport = currentFilters.hasLongitudinalReport === 'Yes'

      result = result.filter((car) => {
        const isHybrid = car.name.toLowerCase().includes('hybrid')
        const key = isHybrid ? `${car.car_fingerprint} (hybrid)` : car.car_fingerprint
        const hasReport = (longitudinalReports as Record<string, unknown>)[key] !== undefined
        return shouldHaveReport === hasReport
      })
    }

    const query = searchQuery().trim()
    if (query) {
      result = result.filter((car) => matchesQuery(car, query))
    }

    const sort = sortConfig()
    result.sort((a, b) => {
      if (query) {
        const normalizedQuery = normalize(query)
        const scoreA = getRelevanceScore(a, normalizedQuery)
        const scoreB = getRelevanceScore(b, normalizedQuery)
        if (scoreA !== scoreB) return scoreB - scoreA
      }
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
      hasLongitudinalReport: '',
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
