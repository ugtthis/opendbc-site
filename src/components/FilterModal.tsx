import {
  type Component,
  Show,
  createSignal,
  createEffect,
  onMount,
  onCleanup,
} from 'solid-js'
import * as Drawer from 'corvu/drawer'
import * as Dialog from 'corvu/dialog'
import { isServer } from 'solid-js/web'
import createMediaQuery from '~/utils/createMediaQuery'
import { BREAKPOINTS } from '~/utils/breakpoints'
import CustomDropdown from '~/components/ui/CustomDropdown'
import { useFilter, type SortField } from '~/contexts/FilterContext'
import type { Car } from '~/types/CarDataTypes'
import carData from '~/data/metadata.json'
import { getSupportLevels } from '~/types/supportType'

import { cn } from '~/lib/utils'
import sortOrderIcon from '~/lib/icons/sort-order-icon.svg?url'
import rotateLeftIcon from '~/lib/icons/rotate-left.svg?url'
import downChevronIcon from '~/lib/icons/down-chevron.svg?url'
import rightArrowIcon from '~/lib/icons/right-arrow.svg?url'

type FilterModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const FilterModal: Component<FilterModalProps> = (props) => {
  const isDesktop = createMediaQuery(BREAKPOINTS.desktop)

  const [openedAsDesktop, setOpenedAsDesktop] = createSignal<boolean | null>(null)

  createEffect(() => {
    if (props.open && openedAsDesktop() === null) {
      setOpenedAsDesktop(isDesktop())
    } else if (!props.open) {
      setOpenedAsDesktop(null)
    }
  })

  // Close modal if screen size changes while open
  createEffect(() => {
    if (props.open && openedAsDesktop() !== null) {
      const currentIsDesktop = isDesktop()
      if (openedAsDesktop() !== currentIsDesktop) {
        props.onOpenChange(false)
      }
    }
  })

  // Use locked state when open, current state when closed
  const shouldUseDesktop = () => openedAsDesktop() ?? isDesktop()
  const {
    filters,
    setFilters,
    clearAllFilters,
    sortConfig,
    setSortConfig,
    resultCount,
    hasActiveFilters,
  } = useFilter()

  // Get unique values for dropdowns
  const typedCarData = carData as Car[]
  const supportLevels = getSupportLevels()
  const makes = [...new Set(typedCarData.map((car) => car.make))].sort()
  const years: string[] = [
    ...new Set(typedCarData.flatMap((car) => car.year_list)),
  ].sort()

  const [openSort, setOpenSort] = createSignal(false)

  let sortRef: HTMLDivElement | undefined

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

  const getResultsColor = (count: number) => {
    if (count === 0) return '#FF5733' // Red
    if (count <= 5) return '#E6A500' // Yellow
    return '#00CC33' // Green
  }

  const sortOptions: { label: string; value: SortField }[] = [
    { label: 'Make', value: 'make' },
    { label: 'Year', value: 'year_list' },
    { label: 'Support Level', value: 'support_type' },
  ]

  const FilterContent = () => (
    <>
      {/* Scrollable content area */}
      <div class="flex-1 overflow-y-auto px-6 pt-4 pb-11">
        {/* Sort Section */}
        <div class="mb-6">
          <h2 class="mb-4 text-lg font-semibold">SORT BY:</h2>
          <div class="flex gap-2">
            <div class="relative w-2/3" ref={sortRef}>
              <button
                type="button"
                onClick={() => setOpenSort(!openSort())}
                class={cn(
                  'flex h-[56px] w-full items-center justify-between border border-black bg-white',
                  'p-4 text-left transition-colors cursor-pointer hover:bg-surface',
                )}
              >
                <span>
                  {sortOptions.find((opt) => opt.value === sortConfig().field)
                    ?.label || 'Make'}
                </span>
                <img
                  src={downChevronIcon}
                  alt=""
                  width="24"
                  height="24"
                  class={cn('opacity-60 transition-transform', openSort() && 'rotate-180')}
                />
              </button>

              <Show when={openSort()}>
                <div class="w-full border border-t-0 border-black bg-white">
                  <div class="max-h-[200px] overflow-y-auto">
                    {sortOptions.map((option) => (
                      <button
                        class={cn(
                          'h-[40px] w-full px-4 text-left cursor-pointer hover:bg-gray-100',
                          sortConfig().field === option.value && 'bg-gray-100',
                        )}
                        onClick={() => {
                          setSortConfig((prev) => ({
                            ...prev,
                            field: option.value,
                          }))
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
              class={cn(
                'flex h-[56px] w-1/3 items-center justify-center self-start border border-black',
                'p-4 transition-colors cursor-pointer hover:bg-surface',
              )}
              aria-label={`Toggle sort order: currently ${sortConfig().order === 'ASC' ? 'Ascending' : 'Descending'}`}
            >
              <img
                src={sortOrderIcon}
                alt=""
                width="32"
                height="28"
                class={cn(sortConfig().order === 'DESC' && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div class="my-4 h-[1px] w-full bg-gray-200" />

        {/* Filter Section */}
        <div>
          <h2 class="mb-4 text-lg font-semibold">FILTER BY:</h2>
          <div class="space-y-4">
            <CustomDropdown
              label="Has Longitudinal Report"
              options={['Yes', 'No']}
              value={filters().hasLongitudinalReport}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, hasLongitudinalReport: value }))
              }
            />

            <CustomDropdown
              label="Has User Video"
              options={['Yes', 'No']}
              value={filters().hasUserVideo}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, hasUserVideo: value }))
              }
            />

            <CustomDropdown
              label="Has User Install Video"
              options={['Yes', 'No']}
              value={filters().hasSetupVideo}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, hasSetupVideo: value }))
              }
            />

            <CustomDropdown
              label="Support Level"
              options={supportLevels}
              value={filters().supportLevel}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, supportLevel: value }))
              }
            />

            <CustomDropdown
              label="Make"
              options={makes}
              value={filters().make}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, make: value }))
              }
            />

            <CustomDropdown
              label="Year"
              options={years}
              value={filters().year}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, year: value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Fixed Footer section */}
      <div class="flex-shrink-0 p-6 border-t border-gray-200 bg-surface shadow-[0_-6px_16px_rgba(0,0,0,0.2)]">
        <div
          class="p-3 mb-4 font-semibold text-center bg-black border border-white"
          style={{ color: getResultsColor(resultCount() || 0) }}
        >
          {resultCount() || 0} RESULT{(resultCount() || 0) !== 1 ? 'S' : ''}
        </div>
        <div class="flex gap-2">
          <button
            onClick={() => hasActiveFilters() && clearAllFilters()}
            disabled={!hasActiveFilters()}
            class={cn(
              'flex flex-1 items-center justify-center gap-2 border border-black bg-white',
              'p-3 font-medium transition-colors cursor-pointer hover:bg-gray-50',
              !hasActiveFilters() && 'cursor-not-allowed opacity-50 hover:bg-white',
            )}
          >
            <img
              src={rotateLeftIcon}
              alt=""
              width="24"
              height="24"
              class="opacity-90"
              aria-hidden="true"
            />
            <span>RESET</span>
          </button>
          <button
            onClick={() => props.onOpenChange(false)}
            class="relative flex flex-1 items-center justify-center gap-2 border-2 border-black p-3 font-medium transition-colors cursor-pointer"
            style={{
              color: `color-mix(in srgb, ${getResultsColor(resultCount() || 0)} 90%, black 10%)`,
              'background-color': `color-mix(in srgb, ${getResultsColor(resultCount() || 0)} 20%, white 80%)`
            }}
          >
            <span class="font-bold">VIEW</span>
            <img
              src={rightArrowIcon}
              width="24"
              height="24"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </>
  )

  const MobileDrawer = () => (
    <Drawer.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      breakPoints={[0.95]} // mobile-drawer-viewport-safe sets max-height
      side="bottom"
    >
      {(drawerProps) => (
        <Drawer.Portal>
          <Drawer.Overlay
            class="fixed inset-0 z-40 bg-black/50 data-[transitioning]:transition-all data-[transitioning]:duration-300"
            style={{
              'background-color': `rgb(0 0 0 / ${0.5 * drawerProps.openPercentage})`,
            }}
          />
          <Drawer.Content
            class={cn(
              'mobile-drawer-viewport-safe fixed inset-x-0 bottom-0 z-50',
              'flex flex-col rounded-t-4xl bg-[#FBFBFB] shadow-[0_-6px_20px_rgba(0,0,0,0.6)]',
              'data-[transitioning]:transition-transform data-[transitioning]:duration-300',
              'data-[transitioning]:ease-[cubic-bezier(0.32,0.72,0,1)]',
            )}
          >
            {/* Mobile header with drawer handle */}
            <div class="bg-[#616161] rounded-t-4xl">
              {/* Drawer handle */}
              <div class="flex justify-center pt-4 pb-3">
                <div class="w-12 h-1.5 rounded-full shadow-sm bg-[#292929]" />
              </div>

              {/* Header */}
              <div class="flex items-center justify-between border-b border-black px-4 pb-4">
                <Drawer.Label class="text-xl font-bold text-white">
                  Filter & Sort
                </Drawer.Label>
                <Drawer.Description class="sr-only">
                  Configure filters and sorting options for the car database
                </Drawer.Description>
                <Drawer.Close
                  class={cn(
                    'flex items-center justify-center size-8',
                    'bg-surface-secondary border border-black',
                    'hover:bg-white transition-colors',
                    'text-lg font-bold text-black cursor-pointer',
                  )}
                >
                  ×
                </Drawer.Close>
              </div>
            </div>

            {/* Filter content */}
            <div class="flex flex-col flex-1 min-h-0">
              <FilterContent />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      )}
    </Drawer.Root>
  )

  const DesktopDialog = () => (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay class="fixed inset-0 z-40 bg-black/50 data-[opening]:animate-in data-[opening]:fade-in-0 data-[closing]:animate-out data-[closing]:fade-out-0" />
        <Dialog.Content
          class={cn(
            'fixed left-1/2 top-1/2 z-50 flex w-full max-w-2xl flex-col',
            '-translate-x-1/2 -translate-y-1/2',
            'border-4 border-black bg-[#FBFBFB]',
            'max-h-[min(85vh,850px)] shadow-[0_6px_20px_rgba(0,0,0,0.6)]',
            'data-[opening]:animate-in data-[opening]:fade-in-0',
            'data-[opening]:zoom-in-95 data-[opening]:slide-in-from-top-2',
            'data-[closing]:animate-out data-[closing]:fade-out-0',
            'data-[closing]:zoom-out-95 data-[closing]:slide-out-to-top-2',
          )}
        >
          {/* Desktop header */}
          <div class="flex flex-shrink-0 items-center justify-between border-b border-black bg-accent p-4">
            <Dialog.Label class="text-xl font-bold text-white">
              Filter & Sort
            </Dialog.Label>
            <Dialog.Close
              class={cn(
                'flex items-center justify-center size-8 border border-black bg-[#D9D9D9]',
                'text-lg font-bold text-black cursor-pointer hover:bg-white transition-colors',
              )}
            >
              ×
            </Dialog.Close>
          </div>

          {/* Filter content */}
          <div class="flex flex-col flex-1 min-h-0">
            <FilterContent />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )

  // Use locked component type to prevent switching during resize
  return (
    <Show when={shouldUseDesktop()} fallback={<MobileDrawer />}>
      <DesktopDialog />
    </Show>
  )
}

export default FilterModal
