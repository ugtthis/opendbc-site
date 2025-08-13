import { type Component, Show, For } from 'solid-js'
import { cn } from '~/lib/utils'
import { useFilter, type FilterState } from '~/contexts/FilterContext'

const FilterChips: Component = () => {
  const { filters, searchQuery, removeFilter, setSearchQuery, clearAllFilters } = useFilter()

  const activeFilters = () => {
    const currentFilters = filters()
    const active: Array<{ key: keyof FilterState; label: string; value: string }> = []

    if (currentFilters.year) {
      active.push({ key: 'year', label: 'Year', value: currentFilters.year })
    }
    if (currentFilters.make) {
      active.push({ key: 'make', label: 'Make', value: currentFilters.make })
    }
    if (currentFilters.supportLevel) {
      active.push({ key: 'supportLevel', label: 'Support', value: currentFilters.supportLevel })
    }
    if (currentFilters.hasUserVideo) {
      active.push({ key: 'hasUserVideo', label: 'Has Video', value: currentFilters.hasUserVideo })
    }

    return active
  }

  const hasActiveFilters = () => activeFilters().length > 0 || searchQuery().trim().length > 0

  return (
    <Show when={hasActiveFilters()}>
      <div class="flex flex-wrap gap-2 items-center p-4 mb-4 rounded-sm border border-black bg-[#F3F3F3] shadow-elev-1">
        <span class="mr-2 text-sm font-semibold text-black">Active filters:</span>

        {/* Search chip */}
        <Show when={searchQuery().trim()}>
          <div
            class={cn(
              'flex items-center gap-1.5 px-3 py-1.5',
              'bg-[#00b925] border border-black text-white text-sm',
              'rounded-sm shadow-elev-1',
            )}
          >
            <span class="font-medium">Search:</span>
            <span>"{searchQuery()}"</span>
            <button
              onClick={() => setSearchQuery('')}
              class={cn(
                'ml-1 flex items-center justify-center size-4',
                'bg-[#D9D9D9] text-black text-xs font-bold',
                'rounded-sm hover:bg-white transition-colors',
                'border border-black',
              )}
              aria-label="Clear search"
            >
              ×
            </button>
          </div>
        </Show>

        <For each={activeFilters()}>
          {(filter) => (
            <div
              class={cn(
                'flex items-center gap-1.5 px-3 py-1.5',
                'bg-[#969696] border border-black text-white text-sm',
                'rounded-sm shadow-elev-1',
              )}
            >
              <span class="font-medium">{filter.label}:</span>
              <span>{filter.value}</span>
              <button
                onClick={() => removeFilter(filter.key)}
                class={cn(
                  'ml-1 flex items-center justify-center size-4',
                  'bg-[#D9D9D9] text-black text-xs font-bold',
                  'rounded-sm hover:bg-white transition-colors',
                  'border border-black',
                )}
                aria-label={`Remove ${filter.label} filter`}
              >
                ×
              </button>
            </div>
          )}
        </For>

        <button
          onClick={clearAllFilters}
          class={cn(
            'px-3 py-1.5 text-sm font-semibold',
            'bg-white text-black border border-black',
            'rounded-sm hover:bg-[#F3F3F3] transition-colors',
            'shadow-elev-1',
          )}
        >
          Clear all
        </button>
      </div>
    </Show>
  )
}

export default FilterChips
