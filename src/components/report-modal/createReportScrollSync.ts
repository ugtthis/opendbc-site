import { createSignal, type Accessor } from 'solid-js'

export function createReportScrollSync(options: {
  syncScrollEnabled: Accessor<boolean>
  backToTopThresholdPx: number
}) {
  let leftEl!: HTMLDivElement
  let rightEl!: HTMLDivElement

  // Both panes set together (e.g. back to top); don’t run scroll sync between them.
  let ignoreSync = false
  // Ignore echoed `scroll` after we assign scrollTop on the other pane (not user input).
  let suppressLeft = false
  let suppressRight = false

  const [showBackToTop, setShowBackToTop] = createSignal(false)

  const releaseSuppressStale = (side: 'left' | 'right') => {
    queueMicrotask(() => {
      if (side === 'left' && suppressLeft) suppressLeft = false
      if (side === 'right' && suppressRight) suppressRight = false
    })
  }

  const syncOtherPane = (src: HTMLDivElement) => {
    if (!leftEl || !rightEl || !options.syncScrollEnabled() || ignoreSync) return

    if (src === leftEl) {
      if (suppressLeft) {
        suppressLeft = false
        return
      }
      suppressRight = true
      rightEl.scrollTop = leftEl.scrollTop
      releaseSuppressStale('right')
    } else if (src === rightEl) {
      if (suppressRight) {
        suppressRight = false
        return
      }
      suppressLeft = true
      leftEl.scrollTop = rightEl.scrollTop
      releaseSuppressStale('left')
    }
  }

  const refreshBackToTop = () => {
    if (!leftEl || !rightEl) return
    const y = Math.max(leftEl.scrollTop, rightEl.scrollTop)
    setShowBackToTop(y > options.backToTopThresholdPx)
  }

  const setBothTo = (top: number) => {
    if (!leftEl || !rightEl) return
    ignoreSync = true
    leftEl.scrollTop = top
    rightEl.scrollTop = top
    refreshBackToTop()
    requestAnimationFrame(() => {
      ignoreSync = false
    })
  }

  const assignPaneRef = (el: HTMLDivElement, pane: 'left' | 'right') => {
    if (pane === 'left') leftEl = el
    else rightEl = el
  }

  const onPaneScroll = (src: HTMLDivElement) => {
    syncOtherPane(src)
    refreshBackToTop()
  }

  return {
    showBackToTop,
    assignPaneRef,
    onPaneScroll,
    scrollBothToTop: () => setBothTo(0),
  }
}
