import { type Component, createEffect } from 'solid-js'
import * as Drawer from 'corvu/drawer'
import { cn } from '~/lib/utils'
import createMediaQuery from '~/utils/createMediaQuery'
import { BREAKPOINTS } from '~/utils/breakpoints'
import QuickNavSpecLinks from './QuickNavSpecLinks'

export type QuickNavDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (specId: string) => void
  excludeSpecs?: string[]
}

const QuickNavDrawer: Component<QuickNavDrawerProps> = (props) => {
  const isMobile = createMediaQuery(BREAKPOINTS.mobile)

  // Close drawer if screen size changes to desktop while open
  createEffect(() => {
    if (props.open && !isMobile()) {
      props.onOpenChange(false)
    }
  })

  const handleNavClick = (specId: string) => {
    // Close mobile drawer first
    props.onOpenChange(false)
    // Wait for mobile drawer close animation (300ms) before scrolling
    setTimeout(() => {
      props.onNavigate(specId)
    }, 350)
  }

  return (
    <Drawer.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      breakPoints={[0.85]}
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
                  Quick Navigation
                </Drawer.Label>
                <Drawer.Description class="sr-only">
                  Navigate to specific vehicle specifications
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

            {/* Navigation content */}
            <div class="flex-1 space-y-1 overflow-y-auto px-6 pt-4 pb-6 text-sm">
              <QuickNavSpecLinks
                onNavigate={handleNavClick}
                variant="mobile"
                excludeSpecs={props.excludeSpecs}
              />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      )}
    </Drawer.Root>
  )
}

export default QuickNavDrawer
