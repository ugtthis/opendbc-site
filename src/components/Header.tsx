import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'

import FilterSvg from '~/lib/icons/filter.svg?raw'
import SearchGlassSvg from '~/lib/icons/search-glass.svg?raw'
import ShineBorder from '~/components/ui/ShineBorder'
import FilterModal from '~/components/FilterModal'
import { useFilter } from '~/contexts/FilterContext'
import { cn } from '~/lib/utils'

const Header: Component = () => {
  const [isFilterOpen, setIsFilterOpen] = createSignal(false)
  const { searchQuery, setSearchQuery } = useFilter()

  return (
    <>
      <header
        role="banner"
        class={cn(
          'flex flex-col items-center gap-4 py-6 border-b-[3px] border-black',
          'shadow-[0_6px_20px_rgba(0,0,0,0.6)] gradient-dark-forrest md:py-8',
        )}
      >
        <img
          src="/opendbc-logo.png"
          alt="opendbc logo"
          width="200"
          height="59"
          class="w-[200px] h-auto"
        />

        <div class="flex w-full justify-center px-14 max-[410px]:px-8">
          <div class="flex max-w-full items-center gap-2 md:gap-3.5">
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
                  class={cn(
                    'h-12 w-[400px] max-w-full pl-12 pr-6 bg-white',
                    'font-sans text-xs outline-none sm:text-sm md:text-base',
                  )}
                />
                <span class="absolute inset-y-0 left-0 grid w-12 place-items-center text-gray-500" aria-hidden="true">
                  <div class="w-5 h-5 text-accent" innerHTML={SearchGlassSvg} />
                </span>
              </ShineBorder>
            </div>

            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              class={cn(
                'grid place-items-center size-[48px] flex-shrink-0 px-0 py-0 border-7 border-[#C7C7C7]',
                'bg-[#989898] transition-colors cursor-pointer hover:bg-[#7a7a7a]',
              )}
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
