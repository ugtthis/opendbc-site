import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'

import FilterSvg from '~/lib/icons/filter.svg?raw'
import SearchGlassSvg from '~/lib/icons/search-glass.svg?raw'
import ShineBorder from '~/components/ui/ShineBorder'
import FilterModal from '~/components/FilterModal'
import { useFilter } from '~/contexts/FilterContext'

const Header: Component = () => {
  const [isFilterOpen, setIsFilterOpen] = createSignal(false)
  const { searchQuery, setSearchQuery } = useFilter()

  return (
    <>
      <header
        role="banner"
        class={`
          flex flex-col items-center gap-4 py-6 md:py-8
          gradient-dark-forrest border-black border-b-[3px] shadow-[0_6px_20px_rgba(0,0,0,0.6)]
        `}
      >
        <img
          src="/opendbc-logo.png"
          alt="opendbc logo"
          width="200"
          height="59"
          class="h-auto w-[200px]"
        />

        <div class="flex justify-center px-14 w-full max-[410px]:px-8">
          <div class="flex gap-2 items-center max-w-full md:gap-3.5">
            <div class="min-w-0">
              <ShineBorder>
                <input
                  type="text"
                  placeholder="Search models"
                  value={searchQuery()}
                  onInput={(e) => setSearchQuery(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur()
                    }
                  }}
                  maxLength={45}
                  class="pr-6 pl-12 max-w-full h-12 font-sans text-xs bg-white outline-none sm:text-sm md:text-base w-[400px]"
                />
                <span class="grid absolute inset-y-0 left-0 place-items-center w-12 text-gray-500" aria-hidden="true">
                  <div class="w-5 h-5 text-accent" innerHTML={SearchGlassSvg} />
                </span>
              </ShineBorder>
            </div>

            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              class="grid flex-shrink-0 place-items-center transition-colors cursor-pointer size-[48px] border-7 border-[#C7C7C7] bg-[#989898] hover:bg-[#7a7a7a]"
            >
              <div class="size-5 text-[#D4D4D4]" innerHTML={FilterSvg} />
            </button>
          </div>
        </div>
      </header>

      <FilterModal open={isFilterOpen()} onOpenChange={setIsFilterOpen} />
    </>
  )
}

export default Header
