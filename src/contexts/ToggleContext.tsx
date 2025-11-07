import { createContext, useContext, createSignal, onMount, type JSX } from 'solid-js'
import createMediaQuery from '~/utils/createMediaQuery'

type ToggleContextType = {
  openSections: () => Set<string>
  setOpenSections: (sections: Set<string>) => void
  toggleSection: (id: string) => void
  toggleAll: () => void
  isAllOpen: () => boolean
}

const ToggleContext = createContext<ToggleContextType>()

export function ToggleProvider(props: { children: JSX.Element }) {
  const isDesktop = createMediaQuery('(min-width: 1024px)')

  const DEFAULT_OPEN_SECTIONS = new Set<string>([
    'general', 'technical', 'system', 'capabilities',
    'compatibility-info', 'longitudinal-reports', 'quick-nav', 'vehicle-metrics'
  ])

  // All sections plus the closed ones
  const ALL_SECTIONS = new Set<string>([
    ...DEFAULT_OPEN_SECTIONS,
    'parts',
    'user-video',
    'user-install-video'
  ])

  const [openSections, setOpenSections] = createSignal<Set<string>>(DEFAULT_OPEN_SECTIONS)

  onMount(() => {
    if (isDesktop()) {
      setOpenSections(prev => new Set([...prev, 'user-video', 'user-install-video']))
    }
  })

  // Toggle individual section
  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Master toggle: close all if any are open, open all if all are closed
  const toggleAll = () => {
    const anyOpen = openSections().size > 0
    setOpenSections(anyOpen ? new Set<string>() : new Set(ALL_SECTIONS))
  }

  // Helper to check if all sections are open
  const isAllOpen = () => openSections().size === ALL_SECTIONS.size

  return (
    <ToggleContext.Provider value={{
      openSections,
      setOpenSections,
      toggleSection,
      toggleAll,
      isAllOpen
    }}>
      {props.children}
    </ToggleContext.Provider>
  )
}

export const useToggle = () => {
  const context = useContext(ToggleContext)
  if (!context) {
    throw new Error('useToggle must be used within ToggleProvider')
  }
  return context
}
