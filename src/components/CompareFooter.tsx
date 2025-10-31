import { type Component, Show, Index, createMemo } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import { useModelComparison } from '~/contexts/ModelComparisonContext'
import { cn, slugify } from '~/lib/utils'
import { getSupportTypeGradient } from '~/types/supportType'
import type { Car } from '~/types/CarDataTypes'
import metadata from '~/data/metadata.json'
import CloseIconSvg from '~/lib/icons/close.svg?raw'
import RightArrowSvg from '~/lib/icons/right-arrow.svg?raw'

const CompareFooter: Component = () => {
  const { selectedCars, clearSelectedCars } = useModelComparison()
  const navigate = useNavigate()
  const typedCarData = metadata as Car[]

  const carSupportTypeGradients = createMemo(() => {
    return selectedCars().map(carName => {
      const car = typedCarData.find(c => c.name === carName)
      return getSupportTypeGradient(car?.support_type)
    })
  })

  const handleCompare = () => {
    if (selectedCars().length >= 2) {
      // Navigate to compare page with slugified car names (clean URLs)
      const carSlugs = selectedCars().map(name => slugify(name)).join(',')
      navigate(`/compare?cars=${encodeURIComponent(carSlugs)}`)
    }
  }

  return (
    <Show when={selectedCars().length > 0}>
      <div class={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-[#202020]/90 backdrop-blur-sm',
        'shadow-[0_-6px_18px_rgba(0,0,0,0.6),inset_0_10px_60px_rgba(82,255,10,0.1)]',
      )}>
        <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          {/* Selection Indicators */}
          <div class="flex flex-col gap-2 items-start">
            <div class="flex items-center gap-1.5">
              <Index each={[0, 1, 2, 3, 4, 5]}>
                {(_, i) => (
                  <div
                    class={cn(
                      i < selectedCars().length
                        ? cn(
                            'h-7 w-5 border-4 border-[#101010] bg-gradient-to-b',
                            carSupportTypeGradients()[i],
                            'shadow-[2px_4px_3px_rgba(0,0,0,0.4),inset_0_3px_8px_rgba(0,0,0,0.8),inset_0_-2px_4px_rgba(255,255,255,0.1)]',
                          )
                        : 'h-5 w-4 border-2 border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]',
                    )}
                  />
                )}
              </Index>
            </div>
            <p class="text-xs text-white">
              Compare up to 6 models
            </p>
          </div>

          {/* Action Buttons */}
          <div class="flex gap-3">
            <button
              onClick={clearSelectedCars}
              class={cn(
                'flex items-center gap-1 px-2 py-2 border-4 border-white/60 bg-transparent',
                'text-xs uppercase tracking-wider text-white',
                'transition-colors cursor-pointer hover:bg-white/10',
                'max-[370px]:border-2 max-[370px]:px-1 max-[370px]:py-3.5 md:text-md',
              )}
            >
              <div class="max-[370px]:hidden" innerHTML={CloseIconSvg} />
              <span class="max-[370px]:text-xs">Clear</span>
            </button>
            <button
              onClick={handleCompare}
              disabled={selectedCars().length < 2}
              class={cn(
                'flex items-center px-2 py-2 border-4 border-[#6AFF72] bg-[#336233]',
                'text-white shadow-sm/40 shadow-[#4aff4a]',
                'transition-colors cursor-pointer',
                'hover:border-[#22FF00] hover:bg-[#0e1c0e] hover:shadow-[inset_0_2px_8px_rgba(34,255,0,0.9)]',
                'disabled:cursor-not-allowed disabled:opacity-35 max-[370px]:p-1',
              )}
            >
              <div class="w-6 h-6 sliding-arrow" innerHTML={RightArrowSvg} />
            </button>
          </div>
        </div>
      </div>
    </Show>
  )
}

export default CompareFooter

