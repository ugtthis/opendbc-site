import { For } from 'solid-js'
import FileCard from '~/components/FileCard'
import FilterChips from '~/components/FilterChips'
import Header from '~/components/Header'
import CompareFooter from '~/components/CompareFooter'
import { useFilter } from '~/contexts/FilterContext'
import { useModelComparison } from '~/contexts/ModelComparisonContext'

import metadata from '~/data/metadata.json'
import GridSvg from '~/lib/icons/grid.svg?raw'
import ListSvg from '~/lib/icons/list.svg?raw'
import { cn } from '~/lib/utils'

export default function Home() {
  const { filteredResults, resultCount, searchQuery } = useFilter()
  const { compareMode, setCompareMode, clearSelectedCars } = useModelComparison()

  return (
    <>
      <Header />
      <main class="mx-auto max-w-7xl px-4 pt-4 pb-16">
        <div class="flex items-center justify-between mb-1.5">
          <div class="text-md text-gray-600 md:text-lg">
            {resultCount()} of {metadata.length} cars
          </div>

          <div class="flex border-5 border-[#dcded6] bg-white shadow-sm">
            <button
              type="button"
              onClick={() => {
                if (compareMode()) {
                  clearSelectedCars()
                }
                setCompareMode(false)
              }}
              class={cn(
                'flex items-center justify-center p-2 transition-colors cursor-pointer',
                !compareMode()
                  ? 'bg-[#242424] text-white border-2 border-[#65e063] shadow-md/70'
                  : 'bg-[#bbbbbbcd] text-white/70 hover:bg-[#aeaeae]'
              )}
              aria-label="Grid view"
            >
              <div class="h-6 w-6" innerHTML={GridSvg} />
            </button>
            <button
              type="button"
              onClick={() => setCompareMode(true)}
              class={cn(
                'flex items-center justify-center p-2 transition-colors cursor-pointer',
                compareMode()
                  ? 'bg-[#242424] text-white border-2 border-[#65e063] shadow-md/70'
                  : 'bg-[#bbbbbbcd] text-white/70 hover:bg-[#aeaeae]'
              )}
              aria-label="List view"
            >
              <div class="h-6 w-6" innerHTML={ListSvg} />
            </button>
          </div>
        </div>
        <FilterChips />

        <div
          class={cn(
            'grid grid-cols-1 mt-8',
            compareMode()
              ? 'gap-2 compare-mode-active'
              : 'gap-6 md:grid-cols-2 lg:grid-cols-3',
          )}
        >
          <For each={filteredResults()}>
            {(vehicle) => (
              <div class="vehicle-card" data-car-id={vehicle.name}>
                <FileCard car={vehicle} searchQuery={searchQuery()} />
              </div>
            )}
          </For>
        </div>
      </main>
      {compareMode() && <CompareFooter />}
    </>
  )
}
