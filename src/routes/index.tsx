import { For } from 'solid-js'
import FileCard from '~/components/FileCard'
import FilterChips from '~/components/FilterChips'
import Header from '~/components/Header'
import { useFilter } from '~/contexts/FilterContext'

import metadata from '~/data/metadata.json'

export default function Home() {
  const { filteredResults, resultCount, searchQuery } = useFilter()

  return (
    <>
      <Header />
      <main class="px-4 pt-4 pb-16 mx-auto max-w-7xl">
        <div class="mb-4 text-sm text-gray-600">
          Showing {resultCount()} of {metadata.length} cars
        </div>
        <FilterChips />

        <div class="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          <For each={filteredResults()}>
            {(vehicle) => (
              <div class="vehicle-card">
                <FileCard car={vehicle} searchQuery={searchQuery()} />
              </div>
            )}
          </For>
        </div>
      </main>
    </>
  )
}
