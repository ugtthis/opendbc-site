import { type Component, Show, For, createMemo } from 'solid-js'
import { useFilter, filterLabels } from '~/contexts/FilterContext'

const FilterChips: Component = () => {
  const { filters, searchQuery, removeFilter, setSearchQuery, clearAllFilters } = useFilter()

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
    <div class={`flex items-center gap-1.5 px-3 py-1.5 ${props.bgColor} border border-black text-white text-sm shadow-elev-1 max-w-full`}>
      <span class="font-medium">{props.label}:</span>
      <span class="min-w-0 truncate max-w-[30ch]">{props.value}</span>
      <button
        onClick={props.onRemove}
        class="flex justify-center items-center ml-4 text-xs font-bold text-black border border-black transition-colors cursor-pointer hover:bg-white shrink-0 size-6 bg-surface-secondary"
        aria-label={`Remove ${props.label}`}
      >
        ×
      </button>
    </div>
  )

  return (
    <Show when={hasActiveFilters()}>
      <div class="flex flex-wrap gap-2 items-center p-4 mb-4 border border-black bg-surface shadow-elev-1">
        <span class="mr-2 text-sm font-semibold text-black">Active filters:</span>

        <Show when={searchQuery().trim()}>
          <Chip
            label="Search"
            value={`"${searchQuery()}"`}
            bgColor="bg-accent"
            onRemove={() => setSearchQuery('')}
          />
        </Show>

        <For each={activeFilters()}>
          {(filter) => (
            <Chip
              label={filter.label}
              value={filter.value}
              bgColor="bg-accent"
              onRemove={() => removeFilter(filter.key)}
            />
          )}
        </For>

        <button
          onClick={clearAllFilters}
          class="py-1.5 px-3 text-sm font-semibold text-black bg-white border border-black transition-colors cursor-pointer shadow-elev-1 hover:bg-surface"
        >
          Clear all
        </button>
      </div>
    </Show>
  )
}

export default FilterChips
