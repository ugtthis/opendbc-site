import { type Component, type JSX, Show } from 'solid-js'
import * as Drawer from 'corvu/drawer'
import * as Dialog from 'corvu/dialog'
import createMediaQuery from '~/utils/createMediaQuery'

import type { SupportType } from '~/types/supportType'
import { cn } from '~/lib/utils'

export type FilterState = {
  year: string
  make: string
  supportType: string
}

type FilterModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableYears: string[]
  availableMakes: string[]
  availableSupportTypes: SupportType[]
}

const FilterModal: Component<FilterModalProps> = (props) => {
  const isDesktop = createMediaQuery('(min-width: 768px)')

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    props.onFiltersChange({
      ...props.filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    props.onFiltersChange({
      year: '',
      make: '',
      supportType: '',
    })
  }

  const FilterSection: Component<{
    title: string
    children: JSX.Element
  }> = (sectionProps) => (
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-black">{sectionProps.title}</h3>
      {sectionProps.children}
    </div>
  )

  const Select: Component<{
    value: string
    onChange: (value: string) => void
    options: string[]
    placeholder: string
  }> = (selectProps) => (
    <select
      value={selectProps.value}
      onChange={(e) => selectProps.onChange(e.currentTarget.value)}
      class={cn(
        'w-full h-12 px-4 border border-black bg-white',
        'font-sans text-base outline-none shadow-elev-1',
        'focus:bg-[#F3F3F3] transition-colors',
      )}
    >
      <option value="">{selectProps.placeholder}</option>
      {selectProps.options.map((option) => (
        <option value={option}>{option}</option>
      ))}
    </select>
  )

  const FilterContent = () => (
    <>
      <FilterSection title="Year">
        <Select
          value={props.filters.year}
          onChange={(value) => handleFilterChange('year', value)}
          options={props.availableYears}
          placeholder="All years"
        />
      </FilterSection>

      <FilterSection title="Make">
        <Select
          value={props.filters.make}
          onChange={(value) => handleFilterChange('make', value)}
          options={props.availableMakes}
          placeholder="All makes"
        />
      </FilterSection>

      <FilterSection title="Support Type">
        <Select
          value={props.filters.supportType}
          onChange={(value) => handleFilterChange('supportType', value)}
          options={props.availableSupportTypes}
          placeholder="All support types"
        />
      </FilterSection>
    </>
  )

  const MobileDrawer = () => (
    <Drawer.Root open={props.isOpen} onOpenChange={props.onOpenChange} breakPoints={[0.8]} side="bottom">
      {(drawerProps: { openPercentage: number }) => (
        <>
          <Drawer.Portal>
            <Drawer.Overlay
              class="fixed inset-0 z-40 bg-black/50 data-[transitioning]:transition-all data-[transitioning]:duration-300"
              style={{
                'background-color': `rgb(0 0 0 / ${0.5 * drawerProps.openPercentage})`,
              }}
            />
            <Drawer.Content
              class={cn(
                'fixed inset-x-0 bottom-0 z-50 flex flex-col',
                'max-h-[90vh] rounded-t-lg border-t-4 border-black',
                'bg-[#F3F3F3] shadow-[0_-6px_20px_rgba(0,0,0,0.6)]',
                'data-[transitioning]:transition-transform data-[transitioning]:duration-300',
                'data-[transitioning]:ease-[cubic-bezier(0.32,0.72,0,1)]',
              )}
            >
              {/* Mobile drawer handle */}
              <div class="flex justify-center pt-3 pb-2">
                <div class="w-10 h-1 rounded-full bg-[#969696]" />
              </div>

              {/* Header */}
              <div class="flex justify-between items-center p-4 border-b border-black bg-[#969696]">
                <Drawer.Label class="text-xl font-bold text-white">Filter Cars</Drawer.Label>
                <Drawer.Close
                  class={cn(
                    'flex items-center justify-center size-8',
                    'bg-[#D9D9D9] border border-black',
                    'hover:bg-white transition-colors',
                    'text-lg font-bold text-black',
                  )}
                >
                  ×
                </Drawer.Close>
              </div>

              {/* Filter content */}
              <div class="overflow-y-auto flex-1 p-4 space-y-6">
                <FilterContent />
              </div>

              {/* Footer */}
              <div class="p-4 space-y-3 border-t border-black bg-[#D9D9D9]">
                <button
                  onClick={clearFilters}
                  class={cn(
                    'w-full h-12 px-4 border border-black',
                    'bg-white hover:bg-[#F3F3F3]',
                    'font-semibold text-black transition-colors',
                    'shadow-elev-1',
                  )}
                >
                  Clear All Filters
                </button>
                <Drawer.Close
                  class={cn(
                    'w-full h-12 px-4 border border-black',
                    'bg-[#969696] hover:bg-[#7a7a7a]',
                    'font-semibold text-white transition-colors',
                    'shadow-elev-1',
                  )}
                >
                  Apply Filters
                </Drawer.Close>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </>
      )}
    </Drawer.Root>
  )

  const DesktopDialog = () => (
    <Dialog.Root open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-40 bg-black/50 data-[opening]:animate-in data-[opening]:fade-in-0 data-[closing]:animate-out data-[closing]:fade-out-0" />
        <Dialog.Content
          class={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-md',
            '-translate-x-1/2 -translate-y-1/2',
            'rounded-lg border-4 border-black bg-[#F3F3F3]',
            'shadow-[0_6px_20px_rgba(0,0,0,0.6)]',
            'data-[opening]:animate-in data-[opening]:fade-in-0',
            'data-[opening]:zoom-in-95 data-[opening]:slide-in-from-top-2',
            'data-[closing]:animate-out data-[closing]:fade-out-0',
            'data-[closing]:zoom-out-95 data-[closing]:slide-out-to-top-2',
          )}
        >
          {/* Header */}
          <div class="flex justify-between items-center p-4 border-b border-black bg-[#969696]">
            <Dialog.Label class="text-xl font-bold text-white">Filter Cars</Dialog.Label>
            <Dialog.Close
              class={cn(
                'flex items-center justify-center size-8',
                'bg-[#D9D9D9] border border-black',
                'hover:bg-white transition-colors',
                'text-lg font-bold text-black',
              )}
            >
              ×
            </Dialog.Close>
          </div>

          {/* Filter content */}
          <div class="overflow-y-auto p-4 space-y-6 max-h-[60vh]">
            <FilterContent />
          </div>

          {/* Footer */}
          <div class="p-4 space-y-3 border-t border-black bg-[#D9D9D9]">
            <button
              onClick={clearFilters}
              class={cn(
                'w-full h-12 px-4 border border-black',
                'bg-white hover:bg-[#F3F3F3]',
                'font-semibold text-black transition-colors',
                'shadow-elev-1',
              )}
            >
              Clear All Filters
            </button>
            <Dialog.Close
              class={cn(
                'w-full h-12 px-4 border border-black',
                'bg-[#969696] hover:bg-[#7a7a7a]',
                'font-semibold text-white transition-colors',
                'shadow-elev-1',
              )}
            >
              Apply Filters
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

  return (
    <Show when={isDesktop()} fallback={<MobileDrawer />}>
      <DesktopDialog />
    </Show>
  )
}

export default FilterModal
