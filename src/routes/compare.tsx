import { useSearchParams, useNavigate } from '@solidjs/router'
import { createMemo, For, Show, createSignal, onMount, onCleanup, createEffect } from 'solid-js'
import type { Car } from '~/types/CarDataTypes'
import { getSupportTypeColor } from '~/types/supportType'
import { cn, slugify, hasObjectEntries } from '~/lib/utils'
import metadata from '~/data/metadata.json'
import { useModelComparison } from '~/contexts/ModelComparisonContext'
import { SPECS_BY_CATEGORY } from '~/data/specs'
import { openSupportTypeModal } from '~/contexts/SupportTypeModalContext'
import UpArrowSvg from '~/lib/icons/up-arrow.svg?raw'
import OpenFolderSvg from '~/lib/icons/open-folder.svg?raw'
import RightArrowSvg from '~/lib/icons/right-arrow.svg?raw'

const MIN_CARS_FOR_COMPARISON = 2

export default function ComparePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setCompareMode } = useModelComparison()

  const navigateToCompareMode = () => {
    setCompareMode(true)
    navigate('/')
  }

  type CellPosition = {
    columnIndex: number
    specKey: string
  }

  const [highlight, setHighlight] = createSignal<{
    hovered: CellPosition | null
    selected: CellPosition | null
  }>({ hovered: null, selected: null })

  const [showStickyHeader, setShowStickyHeader] = createSignal(false)
  const [hasHorizontalOverflow, setHasHorizontalOverflow] = createSignal(false)
  const [isZoomedOut, setIsZoomedOut] = createSignal(false)
  let selectedCarCardsRef: HTMLDivElement | undefined
  let tableContainerRef: HTMLDivElement | undefined
  let tableContentRef: HTMLDivElement | undefined

  const HIGHLIGHT_STYLES = {
    card: {
      selected: 'ring-4 ring-amber-400 shadow-lg shadow-amber-400/50',
      hovered: 'ring-4 ring-gray-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]',
      default: 'shadow-elev-1',
    },
    cell: {
      selected: 'bg-amber-50 text-yellow-700 font-semibold outline outline-[3px] outline-amber-400 shadow-xl',
      columnSelected: 'bg-[#4C7C69]/20 text-green-900',
      columnHovered: 'bg-gray-500/10',
    },
    row: {
      selected: 'bg-amber-50',
      hovered: 'bg-gray-500/30',
      stripeEven: 'bg-gray-100',
      stripeOdd: 'bg-white',
    },
    label: {
      selected: 'text-yellow-700',
    },
  } as const

  const selectedCars = createMemo(() => {
    const carsParam = searchParams.cars
    if (!carsParam) return []

    const carsString = Array.isArray(carsParam) ? carsParam[0] : carsParam
    const carSlugs = carsString.split(',').slice(0, 6)
    const typedCarData = metadata as Car[]

    return carSlugs
      .map(slug => typedCarData.find(car => slugify(car.name) === slug))
      .filter(Boolean) as Car[]
  })

  const removeCar = (carName: string) => {
    const remaining = selectedCars().filter(car => car.name !== carName)

    if (remaining.length < MIN_CARS_FOR_COMPARISON) {
      navigateToCompareMode()
    } else {
      const newParams = remaining.map(car => slugify(car.name)).join(',')
      setSearchParams({ cars: newParams })
    }

    setHighlight({ hovered: null, selected: null })
  }

  const handleCellClick = (columnIndex: number, specKey: string) => {
    const isAlreadySelected = isCellSelected(columnIndex, specKey)

    if (isAlreadySelected) {
      setHighlight(prev => ({ ...prev, selected: null }))
    } else {
      setHighlight(prev => ({ ...prev, selected: { columnIndex, specKey } }))
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const DESKTOP_BREAKPOINT = 768
  const SCROLL_THRESHOLD = 5

  const detectHorizontalScroll = () => {
    if (!tableContainerRef) return

    const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT
    if (!isDesktop) {
      setHasHorizontalOverflow(false)
      return
    }

    const hasOverflow = tableContainerRef.scrollWidth > tableContainerRef.clientWidth + SCROLL_THRESHOLD
    setHasHorizontalOverflow(hasOverflow)
  }

  const TABLE_UI_SCALE_CONFIG = {
    DESKTOP_PADDING: 48,    // Decreasing this leads to cutting off the right side of table UI
    SCALE_BUFFER: 0.99,
    SAFETY_MARGIN: 8,       // Extra pixels for scrollbars, borders, etc
  } as const

  const calcScaleToFit = (contentWidth: number, availableWidth: number): number => {
    const usableWidth = availableWidth - TABLE_UI_SCALE_CONFIG.DESKTOP_PADDING - TABLE_UI_SCALE_CONFIG.SAFETY_MARGIN

    const rawScale = usableWidth / contentWidth
    const scaleWithBuffer = rawScale * TABLE_UI_SCALE_CONFIG.SCALE_BUFFER

    return Math.min(scaleWithBuffer, 1)
  }

  const applyTableUIScale = (scale: number) => {
    if (!tableContentRef || !tableContainerRef) return

    const originalHeight = tableContentRef.getBoundingClientRect().height

    tableContentRef.style.transform = `scale(${scale})`
    tableContentRef.style.transformOrigin = 'top left'

    // Adjust container height to match scaled content - prevents empty space below
    const scaledHeight = originalHeight * scale
    tableContainerRef.style.height = `${scaledHeight}px`

    // Scaled content creates overflow
    tableContainerRef.style.overflow = 'hidden'
  }

  const resetTableUIScale = () => {
    if (!tableContentRef || !tableContainerRef) return

    tableContentRef.style.transform = 'none'
    tableContentRef.style.transformOrigin = ''
    tableContainerRef.style.height = ''
    tableContainerRef.style.overflow = ''
  }

  const toggleTableUIScale = () => {
    if (isZoomedOut()) {
      resetTableUIScale()
      setIsZoomedOut(false)
      return
    }

    if (!tableContainerRef || !tableContentRef) return

    const tableWidth = tableContainerRef.scrollWidth
    const viewportWidth = window.innerWidth
    const scaleLevel = calcScaleToFit(tableWidth, viewportWidth)

    applyTableUIScale(scaleLevel)
    setIsZoomedOut(true)
  }

  onMount(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const shouldPreserveSelection = target.closest('[data-column-value], [data-spec-label], [data-preserve-selection]')

      if (!shouldPreserveSelection && highlight().selected !== null) {
        setHighlight(prev => ({ ...prev, selected: null }))
      }
    }

    const handleWindowResize = () => {
      detectHorizontalScroll()
      if (isZoomedOut()) {
        resetTableUIScale()
        setIsZoomedOut(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    window.addEventListener('resize', handleWindowResize)

    let resizeObserver: ResizeObserver | undefined
    if (tableContainerRef) {
      resizeObserver = new ResizeObserver(() => {
        detectHorizontalScroll()
      })
      resizeObserver.observe(tableContainerRef)

      if (window.innerWidth < DESKTOP_BREAKPOINT) {
        setTimeout(() => tableContainerRef?.scrollTo({ left: 280, behavior: 'smooth' }), 300)
      }
    }

    onCleanup(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleWindowResize)
      resizeObserver?.disconnect()
      resetTableUIScale()
    })
  })

  createEffect(() => {
    const isSelected = highlight().selected !== null

    const checkStickyHeader = () => {
      if (selectedCarCardsRef) {
        const rect = selectedCarCardsRef.getBoundingClientRect()
        setShowStickyHeader(rect.bottom < 80 && isSelected)
      }
    }

    const handleScroll = () => checkStickyHeader()

    window.addEventListener('scroll', handleScroll)
    checkStickyHeader()

    onCleanup(() => window.removeEventListener('scroll', handleScroll))
  })

  const updateCellHover = (columnIndex: number, specKey: string) => {
    setHighlight(prev => ({ ...prev, hovered: { columnIndex, specKey } }))
  }

  const clearCellHover = () => {
    setHighlight(prev => ({ ...prev, hovered: null }))
  }

  const isColumnSelected = (col: number) => highlight().selected?.columnIndex === col
  const isColumnHovered = (col: number) => highlight().hovered?.columnIndex === col
  const isRowSelected = (key: string) => highlight().selected?.specKey === key
  const isRowHovered = (key: string) => highlight().hovered?.specKey === key
  const isCellSelected = (col: number, key: string) =>
    highlight().selected?.columnIndex === col && highlight().selected?.specKey === key

  const getCardHighlightClass = (columnIndex: number) => {
    if (isColumnSelected(columnIndex)) return HIGHLIGHT_STYLES.card.selected
    if (isColumnHovered(columnIndex)) return HIGHLIGHT_STYLES.card.hovered
    return HIGHLIGHT_STYLES.card.default
  }

  const getRowBackgroundClass = (specKey: string, rowIndex: number) => {
    if (isRowSelected(specKey)) return HIGHLIGHT_STYLES.row.selected
    if (isRowHovered(specKey)) return HIGHLIGHT_STYLES.row.hovered
    return rowIndex % 2 === 0 ? HIGHLIGHT_STYLES.row.stripeEven : HIGHLIGHT_STYLES.row.stripeOdd
  }

  const getLabelHighlightClass = (specKey: string) => {
    if (isRowSelected(specKey)) return HIGHLIGHT_STYLES.label.selected
    return ''
  }

  const getCellHighlightClass = (columnIndex: number, specKey: string) => {
    if (isCellSelected(columnIndex, specKey)) return HIGHLIGHT_STYLES.cell.selected
    if (isColumnSelected(columnIndex)) return HIGHLIGHT_STYLES.cell.columnSelected

    const cellHovered = highlight().hovered
    const rowHoveredOrCellHovered = (cellHovered?.specKey === specKey)

    if (!rowHoveredOrCellHovered && isColumnHovered(columnIndex)) {
      return HIGHLIGHT_STYLES.cell.columnHovered
    }

    return ''
  }

  return (
    <div class="min-h-screen bg-gray-100">
      {/* Header */}
      <header class="py-4 border-b-[3px] border-black gradient-dark-forrest shadow-[0_6px_20px_rgba(0,0,0,0.6)] md:py-6">
        <div class="px-4 mx-auto md:px-6 max-w-[2200px]">
          <nav class="flex items-center text-sm font-medium text-white">
            <button
              onClick={navigateToCompareMode}
              class="flex items-center gap-1.5 transition-colors cursor-pointer hover:text-gray-200"
            >
              <div class="flex-shrink-0 w-3 h-3 rotate-180" innerHTML={RightArrowSvg} />
              <span>Car List</span>
            </button>
          </nav>
        </div>
      </header>

      <Show when={selectedCars().length < MIN_CARS_FOR_COMPARISON} fallback={
        <main class="p-4 mx-auto md:p-6 max-w-[2200px]">
          {/* Sticky Selected Car Header */}
          <Show when={showStickyHeader() && highlight().selected !== null}>
            <div
              data-preserve-selection
              onClick={scrollToTop}
              class={cn(
                'fixed top-0 right-0 left-0 z-40 py-3 md:py-4',
                'gradient-dark-forrest shadow-[0_6px_20px_rgba(0,0,0,0.6)] cursor-pointer',
              )}
            >
              <div class="flex justify-between items-center px-4 mx-auto md:px-6 max-w-[2200px]">
                <div class="flex gap-3 items-center">
                  <div class={cn(
                    'py-1.5 px-3 border-4 border-white/80',
                    getSupportTypeColor(selectedCars()[highlight().selected!.columnIndex].support_type),
                  )}>
                    <span class="text-xs font-bold uppercase md:text-sm">
                      {selectedCars()[highlight().selected!.columnIndex].support_type}
                    </span>
                  </div>
                  <div class="text-white">
                    <span class="text-base font-semibold md:text-lg">
                      {selectedCars()[highlight().selected!.columnIndex].name}
                    </span>
                  </div>
                </div>
                <div class="w-5 h-5 text-white bouncy-arrow" innerHTML={UpArrowSvg} />
              </div>
            </div>
          </Show>

          {/* Compare Specs Header with Zoom Button */}
          <div class="flex flex-col gap-2 mb-4">
            <h2 class="text-xl font-bold md:text-2xl">Compare Specs</h2>
            <Show when={hasHorizontalOverflow()}>
              <button
                onClick={toggleTableUIScale}
                class={cn(
                  'w-fit border-2 border-black py-2 px-4 text-sm font-medium transition-all cursor-pointer',
                  isZoomedOut()
                    ? 'bg-[#4A9B6F] text-white hover:bg-[#3d8159]'
                    : 'bg-white text-black hover:bg-gray-100',
                )}
                title={isZoomedOut() ? 'Reset zoom' : 'Zoom out to view full table'}
              >
                {isZoomedOut() ? '↻ Reset Zoom' : '🔍 Fit to Screen'}
              </button>
            </Show>
          </div>

          {/* Combined scrollable container for cards and table */}
          <div ref={tableContainerRef} class="overflow-x-auto">
            <div ref={tableContentRef} class="min-w-full">
              {/* Car Cards - Aligned with columns */}
              <div
                ref={selectedCarCardsRef}
                class="grid items-stretch py-2 mb-2 w-full min-w-fit"
                style={{
                  "grid-template-columns": `280px repeat(${selectedCars().length}, minmax(220px, 1fr))`,
                  "gap": "0 0"
                }}
              >
                {/* Empty spacer for label column */}
                <div />

                {/* Car cards aligned with value columns */}
                <For each={selectedCars()}>
                  {(car, columnIndex) => (
                    <div class="flex relative flex-col px-4 w-full h-full">
                        {/* Support Type Badge - Tab Style */}
                        <button
                          onClick={() => openSupportTypeModal(car.support_type)}
                          class={cn(
                            'relative z-10 block w-fit border-2 border-black border-b-0 py-0.5 px-2',
                            'text-center transition-opacity cursor-pointer hover:opacity-80',
                            getSupportTypeColor(car.support_type),
                          )}
                        >
                          <p class="text-xs font-bold uppercase">{car.support_type}</p>
                        </button>

                        {/* Card */}
                        <div
                          class={cn(
                            'relative flex w-full flex-1 flex-col border-2 border-black bg-white transition-all duration-200',
                            getCardHighlightClass(columnIndex()),
                          )}
                        >
                          {/* Car Info */}
                          <div class="flex flex-col flex-grow p-2 border-b border-black">
                            <h3 class="text-sm font-bold leading-tight">{car.make}</h3>
                            <p class="text-xs font-semibold leading-tight text-gray-700">{car.model}</p>
                            <p class="mt-0.5 text-xs text-gray-600">{car.years}</p>
                          </div>

                          {/* Action Buttons */}
                          <div class="flex">
                            <a
                              href={`/cars/${slugify(car.name)}`}
                              class={cn(
                                'flex flex-[7] items-center justify-center border-r border-black bg-[#A8A8A8]',
                                'py-1.5 transition-colors hover:bg-[#8B8B8B]',
                              )}
                              title="View full details"
                            >
                              <div class="size-4" innerHTML={OpenFolderSvg} />
                            </a>
                            <button
                              onClick={() => removeCar(car.name)}
                              class={cn(
                                'flex flex-[3] items-center justify-center py-1.5 bg-[#A07878] text-sm font-medium text-white',
                                'transition-colors cursor-pointer hover:bg-[#8B6B6B]',
                              )}
                              title="Remove from comparison"
                            >
                              <span class="text-base">×</span>
                            </button>
                          </div>
                        </div>
                    </div>
                  )}
                </For>
              </div>

              {/* Comparison Table */}
              <div
                class="min-w-fit w-full bg-white border-2 border-black shadow-elev-1"
                onMouseLeave={clearCellHover}
              >
              {/* Render specs grouped by category */}
              <For each={SPECS_BY_CATEGORY}>
                {(group) => (
                  <>
                    {/* Category Header */}
                    <div
                      class="grid w-full border-b-2 bg-stone-950 min-w-fit"
                      style={{
                        "grid-template-columns": `280px repeat(${selectedCars().length}, minmax(220px, 1fr))`,
                        "gap": "0 0"
                      }}
                    >
                      <div class="py-2 pr-3 pl-4">
                        <h2 class="text-sm font-bold text-white uppercase md:text-base">
                          {group.category}
                        </h2>
                      </div>
                      <For each={selectedCars()}>
                        {() => <div />}
                      </For>
                    </div>

                    {/* Spec Rows for this category */}
                    <For each={group.specs}>
                      {(spec, index) => (
                        <div
                          class={`grid min-h-[60px] w-full min-w-fit ${getRowBackgroundClass(spec.key, index())}`}
                          style={{
                            "grid-template-columns": `280px repeat(${selectedCars().length}, minmax(220px, 1fr))`,
                            "gap": "0 0"
                          }}
                        >
                          {/* Spec Label */}
                          <div
                            data-spec-label
                            class={cn(
                              'flex items-center py-3 pl-4 pr-3 font-medium border-r border-gray-300',
                              getLabelHighlightClass(spec.key),
                            )}
                          >
                            <span class="break-words">{spec.label}</span>
                          </div>

                          {/* Spec Values */}
                          <For each={selectedCars()}>
                            {(car, columnIndex) => {
                              const value = car[spec.key]
                              const isObject = hasObjectEntries(value)

                              const getDisplayValue = () => {
                                if (spec.format && value != null) return spec.format(value as any)
                                if (value != null && typeof value === 'object') return 'N/A'
                                return value?.toString() ?? 'N/A'
                              }

                              return (
                                <div
                                  data-column-value
                                  class={cn(
                                    'flex py-3 px-4 text-sm cursor-pointer',
                                    isObject ? 'items-start' : 'items-center',
                                    getCellHighlightClass(columnIndex(), spec.key),
                                  )}
                                  onMouseEnter={() => updateCellHover(columnIndex(), spec.key)}
                                  onClick={() => handleCellClick(columnIndex(), spec.key)}
                                  style={{ "word-break": "break-word", "overflow-wrap": "anywhere" }}
                                >
                                  <Show
                                    when={isObject}
                                    fallback={<span class="leading-snug">{getDisplayValue()}</span>}
                                  >
                                    <div class="text-sm leading-relaxed">
                                      <For each={Object.entries(value as Record<string, string>)}>
                                        {([key, val]) => (
                                          <div>
                                            <span class="font-bold">{key}:</span> {val}
                                          </div>
                                        )}
                                      </For>
                                    </div>
                                  </Show>
                                </div>
                              )
                            }}
                          </For>
                        </div>
                      )}
                    </For>
                  </>
                )}
              </For>
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-600">
              Hover or click any spec to highlight its row and column
            </p>
          </div>
        </main>
      }>
        <div class="flex justify-center items-center p-8 min-h-[400px]">
          <div class="text-center">
            <h2 class="mb-4 text-xl font-bold">
              {selectedCars().length === 0 ? 'No cars selected' : `Need at least ${MIN_CARS_FOR_COMPARISON} cars to compare`}
            </h2>
            <p class="mb-6 text-gray-600">
              {selectedCars().length === 0
                ? 'Select cars from the list to compare them'
                : 'Add more cars to start comparing'}
            </p>
            <button
              onClick={navigateToCompareMode}
              class={cn(
                'inline-block border-2 border-black bg-accent py-2 px-6 text-white',
                'transition-colors cursor-pointer hover:bg-[#727272]',
              )}
            >
              Go Back to Car List
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}
