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

export default function Home() {
  const { filteredResults, resultCount, searchQuery } = useFilter()
  const { compareMode, setCompareMode, clearSelectedCars } = useModelComparison()

  return (
    <>
      <Header />
      <main class={`px-4 pt-4 mx-auto max-w-7xl ${compareMode() ? 'pb-32' : 'pb-16'}`}>
        <div class="flex justify-between items-center mb-1.5">
          <div class="text-gray-600 md:text-lg text-md">
            {resultCount()} of {metadata.length} cars
          </div>

          <div class="flex bg-white shadow-sm border-5 border-[#dcded6]">
            <button
              type="button"
              onClick={() => {
                if (compareMode()) {
                  clearSelectedCars()
                }
                setCompareMode(false)
              }}
              class={`flex items-center justify-center p-2 transition-colors ${
                !compareMode()
                  ? 'bg-[#242424] text-white border-2 border-[#65e063] shadow-md/70'
                  : 'bg-[#bbbbbbcd] text-white/70 hover:bg-[#aeaeae] hover:cursor-pointer'
              }`}
              aria-label="Grid view"
            >
              <div class="w-6 h-6" innerHTML={GridSvg} />
            </button>
            <button
              type="button"
              onClick={() => setCompareMode(true)}
              class={`flex items-center justify-center p-2 transition-colors ${
                compareMode()
                  ? 'bg-[#242424] text-white border-2 border-[#65e063] shadow-md/70'
                  : 'bg-[#bbbbbbcd] text-white/70 hover:bg-[#aeaeae] hover:cursor-pointer'
              }`}
              aria-label="List view"
            >
              <div class="w-6 h-6" innerHTML={ListSvg} />
            </button>
          </div>
        </div>
        <FilterChips />

        <div class={compareMode()
          ? "flex flex-col gap-2 mt-8"
          : "grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3"
        }>
          <For each={filteredResults()}>
            {(vehicle) => (
              <div class="vehicle-card">
                <FileCard car={vehicle} searchQuery={searchQuery()} compareMode={compareMode()} />
              </div>
            )}
          </For>
        </div>
      </main>
      {compareMode() && <CompareFooter />}
    </>
  )
}
