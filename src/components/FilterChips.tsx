import { type Component, Show, For, createMemo } from 'solid-js'
import { useFilter } from '~/contexts/FilterContext'

const FilterChips: Component = () => {
  const { filters, searchQuery, removeFilter, setSearchQuery, clearAllFilters } = useFilter()

  const filterLabels = {
    year: 'Year',
    make: 'Make',
    supportLevel: 'Support',
    hasUserVideo: 'Has Video'
  }

  const activeFilters = createMemo(() => {
    const currentFilters = filters()
    return Object.entries(currentFilters)
      .filter(([_, value]) => value)
      .map(([key, value]) => ({
        key: key as keyof typeof filterLabels,
        label: filterLabels[key as keyof typeof filterLabels],
        value
      }))
  })

  const hasActiveFilters = createMemo(() =>
    activeFilters().length > 0 || searchQuery().trim().length > 0
  )

  const Chip = (props: { label: string; value: string; bgColor: string; onRemove: () => void }) => (
    <div class={`flex items-center gap-1.5 px-3 py-1.5 ${props.bgColor} border border-black text-white text-sm rounded-sm shadow-elev-1`}>
      <span class="font-medium">{props.label}:</span>
      <span>{props.value}</span>
      <button
        onClick={props.onRemove}
        class="flex justify-center items-center ml-1 text-xs font-bold text-black rounded-sm border border-black transition-colors hover:bg-white size-4 bg-[#D9D9D9]"
        aria-label={`Remove ${props.label}`}
      >
        ×
      </button>
    </div>
  )

  return (
    <Show when={hasActiveFilters()}>
      <div class="flex flex-wrap gap-2 items-center p-4 mb-4 rounded-sm border border-black bg-[#F3F3F3] shadow-elev-1">
        <span class="mr-2 text-sm font-semibold text-black">Active filters:</span>

        <Show when={searchQuery().trim()}>
          <Chip
            label="Search"
            value={`"${searchQuery()}"`}
            bgColor="bg-[#00b925]"
            onRemove={() => setSearchQuery('')}
          />
        </Show>

        <For each={activeFilters()}>
          {(filter) => (
            <Chip
              label={filter.label}
              value={filter.value}
              bgColor="bg-[#969696]"
              onRemove={() => removeFilter(filter.key)}
            />
          )}
        </For>

        <button
          onClick={clearAllFilters}
          class="py-1.5 px-3 text-sm font-semibold text-black bg-white rounded-sm border border-black transition-colors shadow-elev-1 hover:bg-[#F3F3F3]"
        >
          Clear all
        </button>
      </div>
    </Show>
  )
}

export default FilterChips
