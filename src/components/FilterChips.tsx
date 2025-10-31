import { type Component, Show, For, createMemo } from 'solid-js'
import { useFilter, filterLabels } from '~/contexts/FilterContext'
import { cn } from '~/lib/utils'

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
    <div
      class={cn(
        'flex items-center gap-1.5 max-w-full px-3 py-1.5',
        'border border-black bg-accent text-sm text-white shadow-elev-1',
        props.bgColor,
      )}
    >
      <span class="font-medium">{props.label}:</span>
      <span class="min-w-0 truncate max-w-[30ch]">{props.value}</span>
      <button
        onClick={props.onRemove}
        class={cn(
          'flex items-center justify-center size-6 shrink-0 ml-4 border border-black',
          'bg-surface-secondary text-lg font-bold text-black transition-colors cursor-pointer hover:bg-white',
        )}
        aria-label={`Remove ${props.label}`}
      >
        ×
      </button>
    </div>
  )

  return (
    <Show when={hasActiveFilters()}>
      <div class="mb-4 flex flex-wrap items-center gap-2 p-4 border border-black bg-surface shadow-elev-1">
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
          class={cn(
            'flex items-center justify-center gap-2 px-3 py-1.5 border border-black bg-white',
            'text-sm font-semibold text-black shadow-elev-1 transition-colors cursor-pointer hover:bg-surface',
          )}
        >
          Clear all
        </button>
      </div>
    </Show>
  )
}

export default FilterChips
