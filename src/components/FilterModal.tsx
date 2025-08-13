import { type Component, Show, createSignal, onMount, onCleanup } from 'solid-js'
import * as Drawer from 'corvu/drawer'
import * as Dialog from 'corvu/dialog'
import { isServer } from 'solid-js/web'
import createMediaQuery from '~/utils/createMediaQuery'
import CustomDropdown from '~/components/ui/CustomDropdown'
import { useFilter, type SortField } from '~/contexts/FilterContext'
import carData from '~/data/metadata.json'
import { cn } from '~/lib/utils'
import sortOrderIcon from '~/lib/icons/sort-order-icon.svg?url'
import rotateLeftIcon from '~/lib/icons/rotate-left.svg?url'

type FilterModalProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const FilterModal: Component<FilterModalProps> = (props) => {
  const isDesktop = createMediaQuery('(min-width: 768px)')
  const { filters, setFilters, clearAllFilters, sortConfig, setSortConfig, resultCount, hasActiveFilters } = useFilter()

  // Get unique values for dropdowns
  const typedCarData = carData as Array<Record<string, any>>
  const supportLevels = ['Upstream', 'Under review', 'Community', 'Dashcam mode', 'Not compatible']
  const makes = [...new Set(typedCarData.map((car) => car.make))].sort()
  const years: string[] = [...new Set(typedCarData.flatMap((car) => car.year_list))].sort()

  const [openDropdown, setOpenDropdown] = createSignal<string | null>(null)
  const [openSort, setOpenSort] = createSignal(false)

  let sortRef: HTMLDivElement | undefined

  const toggleDropdown = (id: string) => {
    setOpenDropdown((current) => (current === id ? null : id))
  }

  const handleSortClickOutside = (e: MouseEvent) => {
    if (openSort() && sortRef && !sortRef.contains(e.target as Node)) {
      setOpenSort(false)
    }
  }

  onMount(() => {
    if (!isServer) {
      document.addEventListener('mousedown', handleSortClickOutside)
    }
  })

  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener('mousedown', handleSortClickOutside)
    }
  })

  const getResultsStyle = (count: number) => {
    if (count === 0) return 'bg-black text-[#FF5733]' // Red text
    if (count <= 5) return 'bg-black text-[#FFD700]' // Yellow text
    return 'bg-black text-[#32E347]' // Green text
  }

  const sortOptions: { label: string; value: SortField }[] = [
    { label: 'Make', value: 'make' },
    { label: 'Year', value: 'year_list' },
    { label: 'Support Level', value: 'support_type' },
  ]

  const FilterContent = () => (
    <>
      {/* Scrollable content area */}
      <div class="overflow-y-auto flex-1 px-6 pt-4 pb-4">
        {/* Sort Section */}
        <div class="mb-6">
          <h2 class="mb-4 text-lg font-semibold">SORT BY:</h2>
          <div class="flex gap-2">
            <div class="relative w-2/3" ref={sortRef}>
              <button
                type="button"
                onClick={() => setOpenSort(!openSort())}
                class="flex justify-between items-center p-4 w-full text-left bg-white border border-black"
              >
                <span>{sortOptions.find((opt) => opt.value === sortConfig().field)?.label || 'Make'}</span>
                <svg
                  class={`w-6 h-6 transition-transform ${openSort() ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <Show when={openSort()}>
                <div class="absolute z-10 w-full bg-white border border-t-0 border-black">
                  <div class="overflow-y-auto max-h-[180px]">
                    {sortOptions.map((option) => (
                      <button
                        class={`w-full h-10 px-4 text-left hover:bg-gray-100
                          ${sortConfig().field === option.value ? 'bg-gray-100' : ''}`}
                        onClick={() => {
                          setSortConfig((prev) => ({ ...prev, field: option.value }))
                          setOpenSort(false)
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Show>
            </div>
            <button
              onClick={() =>
                setSortConfig((prev) => ({
                  ...prev,
                  order: prev.order === 'ASC' ? 'DESC' : 'ASC',
                }))
              }
              class="flex justify-center items-center p-3 w-1/3 border border-black hover:bg-gray-50"
              aria-label={`Toggle sort order: currently ${sortConfig().order === 'ASC' ? 'Ascending' : 'Descending'}`}
            >
              <img
                src={sortOrderIcon}
                alt=""
                width="32"
                height="28"
                class={`${sortConfig().order === 'DESC' ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div class="my-4 w-full bg-gray-200 h-[1px]" />

        {/* Filter Section */}
        <div>
          <h2 class="mb-4 text-lg font-semibold">FILTER BY:</h2>
          <div class="space-y-4">
            <CustomDropdown
              label="Has User Video"
              options={['Yes', 'No']}
              value={filters().hasUserVideo}
              onChange={(value) => setFilters((prev) => ({ ...prev, hasUserVideo: value }))}
              isOpen={openDropdown() === 'has-user-video'}
              onToggle={() => toggleDropdown('has-user-video')}
            />

            <CustomDropdown
              label="Support Level"
              options={supportLevels}
              value={filters().supportLevel}
              onChange={(value) => setFilters((prev) => ({ ...prev, supportLevel: value }))}
              isOpen={openDropdown() === 'support-level'}
              onToggle={() => toggleDropdown('support-level')}
            />

            <CustomDropdown
              label="Make"
              options={makes}
              value={filters().make}
              onChange={(value) => setFilters((prev) => ({ ...prev, make: value }))}
              isOpen={openDropdown() === 'make'}
              onToggle={() => toggleDropdown('make')}
            />

            <CustomDropdown
              label="Year"
              options={years}
              value={filters().year}
              onChange={(value) => setFilters((prev) => ({ ...prev, year: value }))}
              isOpen={openDropdown() === 'year'}
              onToggle={() => toggleDropdown('year')}
            />
          </div>
        </div>
      </div>

      {/* Fixed Footer section */}
      <div class="flex-shrink-0 p-6 border-t border-gray-200 bg-[#F3F3F3] shadow-[0_-6px_16px_rgba(0,0,0,0.2)]">
        <div class={`p-3 border border-white text-center font-semibold mb-4 ${getResultsStyle(resultCount() || 0)}`}>
          {resultCount() || 0} RESULT{(resultCount() || 0) !== 1 ? 'S' : ''}
        </div>
        <div class="flex gap-2">
          <button
            onClick={() => hasActiveFilters() && clearAllFilters()}
            disabled={!hasActiveFilters()}
            class={cn(
              'flex-1 p-3 border border-black bg-white hover:bg-gray-50 font-medium flex items-center justify-center gap-2',
              !hasActiveFilters() ? 'opacity-50 cursor-not-allowed hover:bg-white' : '',
            )}
          >
            <img src={rotateLeftIcon} alt="" width="24" height="24" class="opacity-90" aria-hidden="true" />
            <span>RESET</span>
          </button>
        </div>
      </div>
    </>
  )

  const MobileDrawer = () => (
    <Drawer.Root open={props.isOpen} onOpenChange={props.onOpenChange} breakPoints={[0.85]} side="bottom">
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
                'max-h-[85vh] rounded-t-lg border-t-4 border-black',
                'bg-[#FBFBFB] shadow-[0_-6px_20px_rgba(0,0,0,0.6)]',
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
                <Drawer.Label class="text-xl font-bold text-white">Filter & Sort</Drawer.Label>
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

              {/* Filter content with proper height handling */}
              <div class="flex flex-col flex-1 min-h-0">
                <FilterContent />
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
            'fixed left-1/2 top-1/2 z-50 w-full max-w-2xl',
            '-translate-x-1/2 -translate-y-1/2',
            'rounded-lg border-4 border-black bg-[#FBFBFB]',
            'shadow-[0_6px_20px_rgba(0,0,0,0.6)]',
            'data-[opening]:animate-in data-[opening]:fade-in-0',
            'data-[opening]:zoom-in-95 data-[opening]:slide-in-from-top-2',
            'data-[closing]:animate-out data-[closing]:fade-out-0',
            'data-[closing]:zoom-out-95 data-[closing]:slide-out-to-top-2',
            'max-h-[85vh] flex flex-col',
          )}
        >
          {/* Header */}
          <div class="flex flex-shrink-0 justify-between items-center p-4 border-b border-black bg-[#969696]">
            <Dialog.Label class="text-xl font-bold text-white">Filter & Sort</Dialog.Label>
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

          {/* Filter content with proper height handling */}
          <div class="flex flex-col flex-1 min-h-0">
            <FilterContent />
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
