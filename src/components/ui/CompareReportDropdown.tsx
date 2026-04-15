import {
  type Component,
  createEffect,
  onCleanup,
  For,
  Show,
} from 'solid-js'
import { isServer } from 'solid-js/web'
import { cn } from '~/lib/utils'
import type { ReportData } from '~/contexts/ReportModalContext'
import downChevronIcon from '~/lib/icons/down-chevron.svg?url'

type CompareReportDropdownProps = {
  reports: ReportData[]
  valueIndex: number
  onIndexChange: (index: number) => void
  /** Option at this index cannot be chosen (e.g. already selected in the other column). */
  excludeIndex: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CompareReportDropdown: Component<CompareReportDropdownProps> = (props) => {
  let rootRef: HTMLDivElement | undefined

  const isEventInsideRoot = (e: Event) => {
    const el = rootRef
    if (!el) return false
    const path = typeof e.composedPath === 'function' ? e.composedPath() : []
    if (path.length > 0) {
      return path.some((node) => node === el || (node instanceof Node && el.contains(node)))
    }
    return e.target instanceof Node && el.contains(e.target)
  }

  const handlePointerDownCapture = (e: PointerEvent) => {
    if (isEventInsideRoot(e)) return
    props.onOpenChange(false)
  }

  // Only listen for outside clicks while this dropdown is open.
  createEffect(() => {
    if (isServer) return
    if (props.open) {
      document.addEventListener('pointerdown', handlePointerDownCapture, true)
      onCleanup(() => document.removeEventListener('pointerdown', handlePointerDownCapture, true))
    }
  })

  const label = () => props.reports[props.valueIndex]?.description ?? ''

  return (
    <div
      class="relative z-20 w-full"
      ref={(el) => {
        rootRef = el ?? undefined
      }}
    >
      <button
        type="button"
        aria-expanded={props.open}
        aria-haspopup="listbox"
        onClick={() => props.onOpenChange(!props.open)}
        class={cn(
          'flex h-[56px] w-full items-center justify-between border border-black bg-white',
          'px-4 text-left text-xs transition-colors cursor-pointer hover:bg-surface',
        )}
        title={label()}
      >
        <span class="min-w-0 flex-1 truncate pr-3">{label()}</span>
        <img
          src={downChevronIcon}
          alt=""
          width="20"
          height="20"
          class={cn('flex-shrink-0 opacity-60', props.open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>

      <Show when={props.open}>
        <div
          class={cn(
            'absolute left-0 right-0 top-full max-h-[min(240px,45vh)] w-full',
            'overflow-y-auto overscroll-none border border-t-0 border-black bg-white shadow-md',
          )}
        >
          <For each={props.reports}>
            {(report, index) => (
              <button
                type="button"
                disabled={index() === props.excludeIndex}
                class={cn(
                  'flex min-h-[3.5rem] w-full items-center justify-start px-4 py-2',
                  'text-left text-xs transition-colors',
                  index() === props.excludeIndex
                    ? 'cursor-not-allowed bg-gray-50 text-gray-400'
                    : index() === props.valueIndex
                      ? 'cursor-pointer bg-gray-300 hover:bg-gray-300'
                      : 'cursor-pointer hover:bg-gray-100',
                )}
                title={report.description}
                onClick={() => {
                  if (index() === props.excludeIndex) return
                  props.onIndexChange(index())
                  props.onOpenChange(false)
                }}
              >
                <span class="line-clamp-2 w-full min-w-0 break-words leading-5">
                  {report.description}
                </span>
              </button>
            )}
          </For>
        </div>
      </Show>
    </div>
  )
}

export default CompareReportDropdown
