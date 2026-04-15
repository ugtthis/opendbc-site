import { type Component, For, Show, createEffect, createSignal } from 'solid-js'
import type { ReportData } from '~/contexts/ReportModalContext'
import { cn } from '~/lib/utils'
import CompareReportDropdown from '~/components/ui/CompareReportDropdown'
import { createReportScrollSync } from '~/components/report-modal/createReportScrollSync'

/** Scales the embedded report in each compare pane (CSS transform; not `zoom`, which is unreliable with iframes). */
const COMPARE_REPORTS_IFRAME_SCALE = 0.88

/** Scroll distance before the compare “Back to top” control appears (outer column scroll, not iframe). */
const COMPARE_REPORTS_BACK_TO_TOP_THRESHOLD_PX = 160

/** Fixed iframe document height so the parent column scrolls; iframe uses `scrolling="no"`. */
const COMPARE_REPORTS_IFRAME_INNER_HEIGHT_PX = 17000

export type CompareReportContentProps = {
  reports: ReportData[]
  open: boolean
  compareDefaultIdx: number
  /** From parent modal: whether scroll stays synced between the two panes. */
  syncScrollEnabled: () => boolean
}

const CompareReportContent: Component<CompareReportContentProps> = (props) => {
  const [leftIdx, setLeftIdx] = createSignal(0)
  const [rightIdx, setRightIdx] = createSignal(1)
  const [openCompareMenu, setOpenCompareMenu] = createSignal<'left' | 'right' | null>(null)

  const {
    showBackToTop,
    assignPaneRef,
    onPaneScroll,
    scrollBothToTop,
  } = createReportScrollSync({
    syncScrollEnabled: props.syncScrollEnabled,
    backToTopThresholdPx: COMPARE_REPORTS_BACK_TO_TOP_THRESHOLD_PX,
  })

  createEffect(() => {
    if (props.open && props.reports.length >= 2) {
      const len = props.reports.length
      const raw = props.compareDefaultIdx ?? 0
      const def = Math.min(Math.max(0, raw), len - 1)
      setLeftIdx(def)
      setRightIdx((def + 1) % len)
    }
  })

  return (
    <div class="relative grid min-h-0 flex-1 grid-cols-2">
      <For each={[leftIdx, rightIdx]}>
        {(idxSignal, i) => {
          const side = () => (i() === 0 ? 'left' : 'right') as 'left' | 'right'
          return (
            <div
              class={cn(
                'flex min-h-0 min-w-0 flex-col overflow-hidden',
                i() === 0 && 'border-r border-border-soft',
              )}
            >
              <div
                class={cn(
                  'relative flex-shrink-0 border-b border-black bg-surface px-4 py-3',
                  openCompareMenu() === side() ? 'z-[100]' : 'z-30',
                )}
              >
                <CompareReportDropdown
                  reports={props.reports}
                  valueIndex={idxSignal()}
                  excludeIndex={i() === 0 ? rightIdx() : leftIdx()}
                  onIndexChange={(index) =>
                    (i() === 0 ? setLeftIdx : setRightIdx)(index)
                  }
                  open={openCompareMenu() === side()}
                  onOpenChange={(next) => {
                    if (next) setOpenCompareMenu(side())
                    else {
                      setOpenCompareMenu((cur) => (cur === side() ? null : cur))
                    }
                  }}
                />
              </div>
              <div class="relative flex min-h-0 flex-1 flex-col">
                {/* Cross-origin iframe: parent never sees pointer events; shim catches dismiss + dims. */}
                <Show when={openCompareMenu() !== null}>
                  <button
                    type="button"
                    class="absolute inset-0 z-10 cursor-default bg-black/35"
                    aria-hidden="true"
                    tabIndex={-1}
                    onPointerDown={() => setOpenCompareMenu(null)}
                  />
                </Show>
                <div
                  class="relative z-0 flex min-h-0 flex-1 overflow-y-auto overflow-x-hidden"
                  ref={(el) => assignPaneRef(el, i() === 0 ? 'left' : 'right')}
                  onScroll={(e) => onPaneScroll(e.currentTarget)}
                >
                  <div
                    class="origin-top-left ml-2.5"
                    style={{
                      transform: `scale(${COMPARE_REPORTS_IFRAME_SCALE})`,
                      width: `calc((100% + 20px) / ${COMPARE_REPORTS_IFRAME_SCALE})`,
                    }}
                  >
                    <div class="overflow-hidden" style={{ width: 'calc(100% + 20px)' }}>
                      <iframe
                        src={props.reports[idxSignal()]?.link}
                        class="border-0 block"
                        style={{
                          height: `${COMPARE_REPORTS_IFRAME_INNER_HEIGHT_PX}px`,
                          width: 'calc(100% + 20px)',
                        }}
                        title="Report"
                        scrolling="no"
                        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      </For>
      <Show when={showBackToTop()}>
        <button
          type="button"
          class={cn(
            'absolute bottom-4 left-1/2 z-[45] -translate-x-1/2',
            'cursor-pointer rounded-none border border-black bg-[#D9D9D9] px-3 py-2',
            'text-xs font-semibold uppercase text-black shadow-md',
            'transition-colors hover:bg-white',
          )}
          aria-label="Back to top"
          onClick={scrollBothToTop}
        >
          Back to top
        </button>
      </Show>
    </div>
  )
}

export default CompareReportContent
