import {
  type Component,
  Show,
  createSignal,
  createEffect,
  For,
  createMemo,
} from 'solid-js'
import * as Drawer from 'corvu/drawer'
import * as Dialog from 'corvu/dialog'
import createMediaQuery from '~/utils/createMediaQuery'
import { BREAKPOINTS } from '~/utils/breakpoints'
import { getSupportTypeColor, getSupportTypeGradient } from '~/types/supportType'
import {
  SUPPORT_TYPE_CONTENT,
  getSupportTypeOrder,
  type SupportTypeContent,
} from '~/data/supportTypeDescriptions'
import { cn } from '~/lib/utils'
import LinkIcon from '~/lib/icons/link-new-window.svg?raw'
import ChevronIcon from '~/lib/icons/down-chevron.svg?raw'

type SupportTypeInfoModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialSupportType?: string
}

const SUPPORT_TYPE_ORDER = getSupportTypeOrder()

const ExternalLinkButton: Component<{ text: string; url: string }> = (props) => (
  <a
    href={props.url}
    target="_blank"
    rel="noopener noreferrer"
    class={cn(
      "inline-flex items-center gap-4 px-4 py-2",
      "bg-white/10 hover:bg-white/20",
      "border-2 border-white/30 hover:border-white/50",
      "transition-all text-sm"
    )}
  >
    {props.text}
    <span class="w-4 h-4" innerHTML={LinkIcon} />
  </a>
)

const SpacedParagraphList: Component<{ paragraphs: string[]; spacing?: string }> = (props) => (
  <For each={props.paragraphs}>
    {(paragraph, index) => {
      const isNotLastParagraph = index() < props.paragraphs.length - 1
      return (
        <p class={isNotLastParagraph ? (props.spacing ?? 'mb-3') : ''}>
          {paragraph}
        </p>
      )
    }}
  </For>
)

const ReadMoreSection: Component<{
  content: SupportTypeContent['expandableContent']
  isExpanded: boolean
  onToggle: () => void
}> = (props) => {
  const hasLinks = () => props.content?.sections.some(s => s.link) ?? false

  return (
    <div>
      <Show when={props.isExpanded}>
        <div class="pt-4 mt-6 space-y-4 border-t border-white/20">
          <For each={props.content!.sections}>
            {(section) => (
              <div>
                <Show when={section.title}>
                  <h3 class="mb-2 font-bold text-md">{section.title}</h3>
                </Show>
                <SpacedParagraphList paragraphs={section.paragraphs} spacing="mb-2" />
              </div>
            )}
          </For>

          <Show when={hasLinks()}>
            <div class="flex flex-wrap gap-3 pt-4 mt-6 border-t border-white/20">
              <For each={props.content!.sections}>
                {(section) => (
                  <Show when={section.link}>
                    <ExternalLinkButton text={section.link!.text} url={section.link!.url} />
                  </Show>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>

      <button
        onClick={props.onToggle}
        class={cn(
          "text-sm font-semibold text-white/80 hover:text-white",
          "underline cursor-pointer",
          props.isExpanded ? "mt-6" : "mt-4"
        )}
      >
        {props.isExpanded ? 'Show less' : 'Read more'}
      </button>
    </div>
  )
}

const SupportTypeTab: Component<{
  supportType: string
  isSelected: boolean
  onClick: () => void
  buttonRef?: (el: HTMLButtonElement) => void
}> = (props) => {
  const gradientClass = getSupportTypeGradient(props.supportType)

  return (
    <button
      ref={props.buttonRef}
      onClick={props.onClick}
      class={cn(
        'flex items-center transition-all duration-300 cursor-pointer flex-shrink-0',
        'border-4 whitespace-nowrap uppercase tracking-wide py-3',
        'bg-[#3a3a3a] text-white',
        props.isSelected
          ? 'gap-2 px-3 text-sm font-bold border-black shadow-md/60'
          : 'gap-2 px-3 text-sm border-transparent opacity-70 hover:opacity-90'
      )}
    >
      {/* Support type rectangle gem */}
      <div class={cn(
        'w-5 h-7 border-4 border-[#101010] bg-gradient-to-b flex-shrink-0',
        'shadow-[2px_4px_3px_rgba(0,0,0,0.4),inset_0_3px_8px_rgba(0,0,0,0.8),inset_0_-2px_4px_rgba(255,255,255,0.1)]',
        gradientClass
      )} />
      {props.supportType}
    </button>
  )
}

const SupportTypeInfoModal: Component<SupportTypeInfoModalProps> = (props) => {
  const isDesktop = createMediaQuery(BREAKPOINTS.desktop)
  const [openedAsDesktop, setOpenedAsDesktop] = createSignal<boolean | null>(null)
  const [selectedIndex, setSelectedIndex] = createSignal(0)
  const [isExpanded, setIsExpanded] = createSignal(false)

  const [scrollContainer, setScrollContainer] = createSignal<HTMLDivElement>()
  const buttonRefs: Map<number, HTMLButtonElement> = new Map()

  createEffect(() => {
    if (props.open) {
      if (openedAsDesktop() === null) {
        setOpenedAsDesktop(isDesktop())
      }
      if (props.initialSupportType) {
        const index = SUPPORT_TYPE_ORDER.indexOf(props.initialSupportType)
        if (index !== -1) {
          setSelectedIndex(index)
        }
      }
    } else {
      setOpenedAsDesktop(null)
    }
  })

  createEffect(() => {
    selectedIndex()
    setIsExpanded(false)
  })

  const scrollButtonToCenter = (container: HTMLDivElement, button: HTMLButtonElement) => {
    const containerRect = container.getBoundingClientRect()
    const buttonRect = button.getBoundingClientRect()

    const halfContainerWidth = containerRect.width / 2
    const halfButtonWidth = buttonRect.width / 2
    const buttonOffsetFromContainerLeft = buttonRect.left - containerRect.left
    const targetScrollLeft = container.scrollLeft + buttonOffsetFromContainerLeft - halfContainerWidth + halfButtonWidth

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth'
    })
  }

  createEffect(() => {
    if (!props.open) return

    const index = selectedIndex()
    const container = scrollContainer()
    const selectedButton = buttonRefs.get(index)

    if (!selectedButton || !container) return

    requestAnimationFrame(() => scrollButtonToCenter(container, selectedButton))
  })

  // Better UX for mobile/desktop switching
  createEffect(() => {
    if (props.open && openedAsDesktop() !== null && openedAsDesktop() !== isDesktop()) {
      props.onOpenChange(false)
    }
  })

  const shouldUseDesktop = () => openedAsDesktop() ?? isDesktop()
  const selectedSupportType = createMemo(() => SUPPORT_TYPE_ORDER[selectedIndex()])
  const selectedContent = createMemo(() => SUPPORT_TYPE_CONTENT[selectedSupportType()])

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % SUPPORT_TYPE_ORDER.length)
  }

  const handleBack = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? SUPPORT_TYPE_ORDER.length - 1 : prev - 1
    )
  }

  const ModalContent = () => (
    <>
      <div class="overflow-y-auto flex-1 px-6 pt-6 pb-6">
        <div class="relative mb-1">
          {/* Support Type Badge */}
          <div
            class={cn(
              'w-full  px-4 md:px-9 py-2 border-4 border-black border-b-0',
              getSupportTypeColor(selectedSupportType())
            )}
          >
            <span class="text-xl font-bold uppercase">
              {selectedSupportType()}
            </span>
          </div>
          {/* Main Content Card */}
          <div class="overflow-y-auto text-white border-4 border-black shadow-lg h-[290px] bg-[#3a3a3a]">
            <div class="p-4 text-sm leading-relaxed md:py-4 md:px-8 md:text-md">
              {/* Main paragraphs */}
              <SpacedParagraphList paragraphs={selectedContent().paragraphs} />

              {/* Expandable content section */}
              <Show when={selectedContent().expandableContent}>
                <ReadMoreSection
                  content={selectedContent().expandableContent}
                  isExpanded={isExpanded()}
                  onToggle={() => setIsExpanded(!isExpanded())}
                />
              </Show>

              {/* Reference link at the bottom */}
              <Show when={selectedContent().reference}>
                <div class="pt-4 mt-6 border-t border-white/20">
                  <ExternalLinkButton
                    text={selectedContent().reference!.text}
                    url={selectedContent().reference!.url}
                  />
                </div>
              </Show>
            </div>
          </div>
        </div>

        {/* Support Type Tabs */}
        <div ref={setScrollContainer} class="overflow-x-auto mb-6 scrollbar-hide scroll-smooth">
          <div class="flex gap-3 py-2 pl-[5%] items-center">
            <For each={SUPPORT_TYPE_ORDER}>
              {(supportType, index) => (
                <SupportTypeTab
                  supportType={supportType}
                  isSelected={selectedIndex() === index()}
                  onClick={() => setSelectedIndex(index())}
                  buttonRef={(el) => buttonRefs.set(index(), el)}
                />
              )}
            </For>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div class="flex gap-4">
          <button
            onClick={handleBack}
            class={cn(
              "flex-1 p-4 text-lg font-medium",
              "border-8 border-black",
              "bg-[#1E1E1E] hover:bg-[#3a3a3a]",
              "text-white transition-colors cursor-pointer",
              "flex items-center justify-center"
            )}
          >
            <span class="w-6 h-6 rotate-90" innerHTML={ChevronIcon} />
          </button>
          <button
            onClick={handleNext}
            class={cn(
              "flex-1 p-4 text-sm md:text-lg font-medium",
              "border-8 border-black",
              "bg-[#1E1E1E] hover:bg-[#3a3a3a]",
              "text-white transition-colors cursor-pointer",
              "flex items-center justify-center"
            )}
          >
            <span class="w-6 h-6 -rotate-90" innerHTML={ChevronIcon} />
          </button>
        </div>
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
              'rounded-t-4xl bg-[#FBFBFB]',
              'shadow-[0_-6px_20px_rgba(0,0,0,0.6)]',
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
              <div class="flex justify-between items-center px-4 pb-4 border-b border-black">
                <Drawer.Label class="text-xl font-bold text-white">
                  Types of Support:
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
            'border-4 border-black bg-[#FBFBFB]',
            'shadow-[0_6px_20px_rgba(0,0,0,0.6)]',
            'data-[opening]:animate-in data-[opening]:fade-in-0',
            'data-[opening]:zoom-in-95 data-[opening]:slide-in-from-top-2',
            'data-[closing]:animate-out data-[closing]:fade-out-0',
            'data-[closing]:zoom-out-95 data-[closing]:slide-out-to-top-2',
            'max-h-[min(85vh,700px)] flex flex-col',
          )}
        >
          {/* Desktop header */}
          <div class="flex flex-shrink-0 justify-between items-center p-4 border-b border-black bg-accent">
            <Dialog.Label class="text-xl font-bold text-white">
              Types of Support:
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

export default SupportTypeInfoModal

