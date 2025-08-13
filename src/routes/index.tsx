import { For, createMemo } from 'solid-js'
import FileCard from '~/components/FileCard'
import FilterChips from '~/components/FilterChips'
import type { Car } from '~/types/CarDataTypes'
import { useFilter } from '~/contexts/FilterContext'

import metadata from '~/data/metadata.json'

export default function Home() {
  const { filters, searchQuery, setSearchQuery, removeFilter, clearAllFilters } = useFilter()

  const filteredCars = createMemo(() => {
    let cars = metadata as Car[]

    // Apply search filter
    if (searchQuery().trim()) {
      const query = searchQuery().toLowerCase()
      cars = cars.filter(
        (car) =>
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.name.toLowerCase().includes(query) ||
          car.support_type.toLowerCase().includes(query),
      )
    }

    // Apply filters
    const currentFilters = filters()

    if (currentFilters.year) {
      cars = cars.filter((car) => car.year_list.includes(currentFilters.year))
    }

    if (currentFilters.make) {
      cars = cars.filter((car) => car.make === currentFilters.make)
    }

    if (currentFilters.supportType) {
      cars = cars.filter((car) => car.support_type === currentFilters.supportType)
    }

    return cars
  })

  return (
    <main class="p-4 mx-auto max-w-7xl">
      <div class="mb-4 text-sm text-gray-600">
        Showing {filteredCars().length} of {(metadata as Car[]).length} cars
      </div>
      <FilterChips
        filters={filters()}
        searchQuery={searchQuery()}
        onFilterRemove={removeFilter}
        onSearchClear={() => setSearchQuery('')}
        onClearAll={() => {
          clearAllFilters()
          setSearchQuery('')
        }}
      />

      <div class="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        <For each={filteredCars()}>
          {(vehicle) => (
            <div class="vehicle-card">
              <FileCard car={vehicle} searchQuery={searchQuery()} />
            </div>
          )}
        </For>
      </div>
    </main>
  )
}
