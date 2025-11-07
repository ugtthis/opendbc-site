import { type Component, Show, createSignal, createEffect } from 'solid-js'
import * as Drawer from 'corvu/drawer'
import * as Dialog from 'corvu/dialog'
import createMediaQuery from '~/utils/createMediaQuery'
import { BREAKPOINTS } from '~/utils/breakpoints'
import { cn } from '~/lib/utils'

type LongitudinalReportModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  description?: string
  link?: string
}

const LongitudinalReportModal: Component<LongitudinalReportModalProps> = (props) => {
  const isDesktop = createMediaQuery(BREAKPOINTS.desktop)
  const [openedAsDesktop, setOpenedAsDesktop] = createSignal<boolean | null>(null)

  createEffect(() => {
    if (props.open) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      if (openedAsDesktop() === null) {
        setOpenedAsDesktop(isDesktop())
      }
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflowY = 'scroll'
      setOpenedAsDesktop(null)
    }
  })

  // Better UX for mobile/desktop switching
  createEffect(() => {
    if (props.open && openedAsDesktop() !== null && openedAsDesktop() !== isDesktop()) {
      props.onOpenChange(false)
    }
  })

  const shouldUseDesktop = () => openedAsDesktop() ?? isDesktop()

  const ModalContent = () => (
    <>
      {/* Description header */}
      <Show when={props.description}>
        <div class="flex-shrink-0 px-6 py-4 bg-gray-100 border-b border-gray-300">
          <p class="text-sm text-gray-700">{props.description}</p>
        </div>
      </Show>

      {/* iframe container */}
      <div class="flex-1 min-h-[600px] bg-white">
        <Show
          when={props.link}
          fallback={
            <div class="flex items-center justify-center h-full text-gray-500">
              No report available
            </div>
          }
        >
          <iframe
            src={props.link}
            class="w-full h-full border-0"
            title="Longitudinal Report"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </Show>
      </div>
    </>
  )

  const MobileDrawer = () => (
    <Drawer.Root
      open={props.open}
      onOpenChange={props.onOpenChange}
      breakPoints={[0.95]}
      side="bottom"
    >
      {(drawerProps) => (
        <Drawer.Portal>
          <Drawer.Overlay
            class={cn(
              "fixed inset-0 z-40 bg-black/50",
              "data-[transitioning]:transition-all",
              "data-[transitioning]:duration-300"
            )}
            style={{
              'background-color': `rgb(0 0 0 / ${0.5 * drawerProps.openPercentage})`,
            }}
          />
          <Drawer.Content
            class={cn(
              'mobile-drawer-viewport-safe fixed inset-x-0 bottom-0 z-50 flex flex-col',
              'rounded-t-4xl bg-white',
              'shadow-[0_-6px_20px_rgba(0,0,0,0.6)]',
              'data-[transitioning]:transition-transform data-[transitioning]:duration-300',
              'data-[transitioning]:ease-[cubic-bezier(0.32,0.72,0,1)]',
              'h-[95vh]',
            )}
          >
            <div class="bg-[#616161] rounded-t-4xl flex-shrink-0">
              {/* Drawer handle */}
              <div class="flex justify-center pt-4 pb-3">
                <div class="w-12 h-1.5 rounded-full shadow-sm bg-[#292929]" />
              </div>

              {/* Header */}
              <div class="flex justify-between items-center px-4 pb-4 border-b border-black">
                <Drawer.Label class="text-xl font-bold text-white">
                  Longitudinal Report
                </Drawer.Label>
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

            {/* Modal content */}
            <div class="flex flex-col flex-1 min-h-0">
              <ModalContent />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      )}
    </Drawer.Root>
  )

  const DesktopDialog = () => (
    <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          class={cn(
            "fixed inset-0 z-40 bg-black/50",
            "data-[opening]:animate-in data-[opening]:fade-in-0",
            "data-[closing]:animate-out data-[closing]:fade-out-0"
          )}
        />
        <Dialog.Content
          class={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-2xl',
            '-translate-x-1/2 -translate-y-1/2',
            'border-4 border-black bg-white',
            'shadow-[0_6px_20px_rgba(0,0,0,0.6)]',
            'data-[opening]:animate-in data-[opening]:fade-in-0',
            'data-[opening]:zoom-in-95 data-[opening]:slide-in-from-top-2',
            'data-[closing]:animate-out data-[closing]:fade-out-0',
            'data-[closing]:zoom-out-95 data-[closing]:slide-out-to-top-2',
            'h-[90vh] max-h-[900px] flex flex-col',
          )}
        >
          {/* Desktop header */}
          <div class="flex flex-shrink-0 items-center justify-between border-b border-black bg-accent p-4">
            <Dialog.Label class="text-xl font-bold text-white">
              Longitudinal Report
            </Dialog.Label>
            <Dialog.Close
              class={cn(
                'flex items-center justify-center size-8',
                'bg-[#D9D9D9] border border-black',
                'hover:bg-white transition-colors',
                'text-lg font-bold text-black cursor-pointer',
              )}
            >
              ×
            </Dialog.Close>
          </div>

          {/* Modal content */}
          <div class="flex flex-col flex-1 min-h-0">
            <ModalContent />
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

export default LongitudinalReportModal

