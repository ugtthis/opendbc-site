import { useParams, useNavigate } from '@solidjs/router'
import { createMemo, For, createSignal, onMount, onCleanup, Show, type Component } from 'solid-js'
import type { Car } from '~/types/CarDataTypes'
import UpArrowSvg from '~/lib/icons/up-arrow.svg?raw'
import RightArrowSvg from '~/lib/icons/right-arrow.svg?raw'
import LinkNewWindowSvg from '~/lib/icons/link-new-window.svg?raw'
import MasterToggle from '~/components/MasterToggle'
import AccordionContainer from '~/components/AccordionContainer'
import ExpandableSpec from '~/components/ExpandableSpec'
import { QuickNavProvider, QuickNavWrapper, useQuickNavScrollTarget, HIGHLIGHT_STYLES } from '~/components/QuickNavHighlight'
import QuickNavDrawer from '~/components/QuickNavDrawer'
import QuickNavSpecLinks from '~/components/QuickNavSpecLinks'
import { SPEC_ID, getAccordionIdForSpec } from '~/data/specs'
import { DESCRIPTIONS } from '~/data/specDescriptions'
import { ToggleProvider, useToggle } from '~/contexts/ToggleContext'
import createMediaQuery from '~/utils/createMediaQuery'
import { BREAKPOINTS } from '~/utils/breakpoints'
import { cn, slugify, hasObjectEntries, formatSpeed, formatValue, formatWeight } from '~/lib/utils'
import { getSupportTypeColor } from '~/types/supportType'
import { openSupportTypeModal } from '~/contexts/SupportTypeModalContext'
import YoutubeVidPlayer from '~/components/YoutubeVidPlayer'

import metadata from '~/data/metadata.json'

type DetailedSpecs = Car & {
  parts?: Array<{
    name: string
    type: string
    count: number
  }>
  tire_stiffness_factor?: number
  tire_stiffness_front?: number
  tire_stiffness_rear?: number
  steer_actuator_delay?: number
  steer_limit_timer?: number
  steer_control_type?: string
  vEgo_stopping?: number
  vEgo_starting?: number
  stop_accel?: number
  network_location?: string
  bus_lookup?: {
    pt?: string
    radar?: string
  }
  experimental_longitudinal_available?: boolean
  enable_dsu?: boolean
  enable_bsm?: boolean
  pcm_cruise?: boolean
  min_enable_speed?: number
  fsr_longitudinal?: string
  fsr_steering?: string
  longitudinal?: string
  steering_torque?: string
  wheelbase?: number
  center_to_front_ratio?: number
  max_lateral_accel?: number
}


type SupportTypeButtonProps = {
  supportType: string
  onClick: () => void
}

const SupportTypeButton: Component<SupportTypeButtonProps> = (props) => {
  const { isActive } = useQuickNavScrollTarget()

  return (
    <button
      onClick={props.onClick}
      class={`w-full py-4 px-3 text-left cursor-pointer border-b border-gray-200
        ${isActive() ? HIGHLIGHT_STYLES.bg : ' hover:bg-amber-50'}
        ${isActive() ? `${HIGHLIGHT_STYLES.border} ${HIGHLIGHT_STYLES.transition}` : ''}`}
    >
      <div class="mb-1 text-sm font-medium text-gray-700">Support Type</div>
      <div class="text-sm font-semibold uppercase">{props.supportType}</div>
    </button>
  )
}

type GradientHeaderProps = {
  car: DetailedSpecs | undefined
  showUpArrow: boolean
  onScrollToTop: () => void
}

const GradientHeader: Component<GradientHeaderProps> = (props) => {
  const navigate = useNavigate()

  return (
    <div
      class={cn(
        'fixed top-0 left-0 right-0 z-50 py-4.5 md:py-5.5',
        'gradient-dark-forrest shadow-[0_6px_20px_rgba(0,0,0,0.6)]',
      )}
    >
      {/* Bottom shine border */}
      <div
        class={cn(
          'absolute inset-x-0 bottom-0 h-[10px]',
          'opacity-0 shadow-[0_8px_10px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(0,0,0,0.4)]',
          'transition-opacity duration-[3000ms] ease-in-out pointer-events-none shine-border-overlay',
          props.showUpArrow && 'opacity-70',
        )}
      />
      <div class="px-4 mx-auto md:px-6 max-w-[1500px]">
        <nav class="flex items-center text-sm font-medium text-white">
          <button
            onClick={() => navigate('/')}
            class="flex items-center gap-1.5 transition-colors cursor-pointer hover:text-gray-200"
          >
            <Show when={!props.car}>
              <div class="flex-shrink-0 w-3 h-3 rotate-180" innerHTML={RightArrowSvg} />
            </Show>
            <span>Home</span>
          </button>
          <Show when={props.car}>
            {(currentCar) => (
              <>
                <span class="mx-2">{'>'}</span>
                <button
                  onClick={props.onScrollToTop}
                  class={cn(
                    'flex flex-1 items-center justify-between gap-4 font-normal transition-colors',
                    props.showUpArrow ? 'cursor-pointer md:hover:font-semibold md:hover:text-[#76ab7a]' : 'cursor-default',
                  )}
                >
                  {currentCar().name}
                  {props.showUpArrow && (
                    <div
                      class="flex-shrink-0 w-5 h-5 duration-300 bouncy-arrow"
                      innerHTML={UpArrowSvg}
                    />
                  )}
                </button>
              </>
            )}
          </Show>
        </nav>
      </div>
    </div>
  )
}

function CarDetailContent() {
  const params = useParams()
  const navigate = useNavigate()
  const toggle = useToggle()
  const isMobile = createMediaQuery(BREAKPOINTS.mobile)
  const [highlightedSpec, setHighlightedSpec] = createSignal<string | null>(null)
  const [showUpArrow, setShowUpArrow] = createSignal(false)
  const [openDesc, setOpenDesc] = createSignal<string | null>(null)
  const [quickNavDrawerOpen, setQuickNavDrawerOpen] = createSignal(false)
  let highlightTimeoutId: ReturnType<typeof setTimeout> | undefined

  // Force scrollbar to show = prevents layout shift when using MasterToggle
  onMount(() => {
    document.documentElement.style.overflowY = 'scroll'
    onCleanup(() => {
      document.documentElement.style.overflowY = ''
      if (highlightTimeoutId !== undefined) {
        clearTimeout(highlightTimeoutId)
      }
    })
  })

  const car = createMemo(() => {
    if (!params.car) return undefined
    return (metadata as DetailedSpecs[]).find(c => slugify(c.name) === params.car)
  })


  // Scroll detection for up arrow visibility
  onMount(() => {
    const handleScroll = () => {
      setShowUpArrow(window.scrollY > 150)
    }

    window.addEventListener('scroll', handleScroll)
    onCleanup(() => window.removeEventListener('scroll', handleScroll))
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleDesc = (detailId: string) => {
    setOpenDesc(prev => prev === detailId ? null : detailId)
  }

  const scrollToSpec = (specId: string) => {
    const accordionId = getAccordionIdForSpec(specId)
    const needsExpansion = accordionId && !toggle.openSections().has(accordionId)

    // Support Type uses modal instead of inline expansion, so skip toggle logic
    if (specId !== SPEC_ID.SUPPORT_TYPE_BADGE && openDesc() === specId) {
      setOpenDesc(null)
    }

    if (needsExpansion) {
      toggle.toggleSection(accordionId)
    }

    if (highlightTimeoutId !== undefined) {
      clearTimeout(highlightTimeoutId)
    }

    // Ensures signal always changes for re-clicks of same spec
    setHighlightedSpec(null)

    // Small delay to allow section expansion animation to start
    setTimeout(() => {
      const element = document.getElementById(specId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setHighlightedSpec(specId)
        highlightTimeoutId = setTimeout(() => setHighlightedSpec(null), 3000)
      }
    }, needsExpansion ? 150 : 0)
  }

  return (
    <QuickNavProvider activeSpec={highlightedSpec}>
      <div class="min-h-screen bg-gray-100">
        <GradientHeader car={car()} showUpArrow={showUpArrow()} onScrollToTop={scrollToTop} />

        <Show
          when={car()}
          fallback={
            <main class="flex items-center justify-center p-8 pt-24 min-h-[calc(100vh-80px)]">
              <div class="max-w-2xl text-center">
                <h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">Car Not Found</h1>
                <p class="mb-8 text-lg text-gray-600">
                  The requested vehicle "{params.car}" could not be found.
                </p>
                <button
                  onClick={() => navigate('/')}
                  class={cn(
                    'inline-block py-3 px-8 border-2 border-black bg-accent text-white',
                    'transition-colors cursor-pointer hover:bg-[#727272]',
                  )}
                >
                  Go Back Home
                </button>
              </div>
            </main>
          }
        >
          {(currentCar) => (
          <div class="p-4 pt-20 mx-auto md:p-6 md:pt-24 max-w-[1500px]">

            <div class="flex flex-col gap-4 lg:flex-row lg:gap-6">
              {/* Left Sidebar */}
              <div class="space-y-4 w-full lg:flex-shrink-0 lg:w-72">

                {/* Sidebar Header */}
                <div class="border border-black shadow-sm">
                  <div class="flex justify-between items-stretch pl-4 text-white bg-black">
                    <h1 class="py-3 text-xl font-bold">{currentCar().make}</h1>
                    <MasterToggle />
                  </div>
                  <div class="py-3 pl-4 bg-white">
                    <div class="font-medium">{currentCar().name}</div>
                  </div>
                </div>

                {/* Mobile Quick Nav Drawer */}
                <Show when={isMobile()}>
                  <button
                    onClick={() => setQuickNavDrawerOpen(true)}
                    class={cn(
                      'flex items-center justify-center gap-2 w-full border border-black bg-black',
                      'py-3 px-4 font-medium text-white transition-colors cursor-pointer hover:bg-gray-800',
                    )}
                  >
                    <span>Quick Navigation</span>
                  </button>
                </Show>

                {/* Outside <Show> for smooth animations */}
                <QuickNavDrawer
                  open={quickNavDrawerOpen()}
                  onOpenChange={setQuickNavDrawerOpen}
                  onNavigate={scrollToSpec}
                  excludeSpecs={[SPEC_ID.YEARS]}
                />

                {/* Compatibility Info */}
                <AccordionContainer
                  title="Compatibility Info"
                  id="compatibility-info"
                  disableDefaultPadding={true}
                >
                  <div class={`h-4 w-full -mb-1.5 ${getSupportTypeColor(currentCar().support_type)}`} />
                  <QuickNavWrapper id={SPEC_ID.SUPPORT_TYPE_BADGE}>
                    <SupportTypeButton
                      supportType={currentCar().support_type}
                      onClick={() => openSupportTypeModal(currentCar().support_type)}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.ADAS_PACKAGE}>
                    <ExpandableSpec
                      layout="vertical"
                      label="ADAS Package"
                      value={currentCar().support_type === 'Not compatible' ? 'N/A' : currentCar().package}
                      isEven={true}
                      isOpen={openDesc() === 'adas-package'}
                      onToggle={() => toggleDesc('adas-package')}
                      description={DESCRIPTIONS[SPEC_ID.ADAS_PACKAGE]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.FINGERPRINT}>
                    <ExpandableSpec
                      layout="vertical"
                      label="Fingerprint"
                      value={currentCar().car_fingerprint}
                      isOpen={openDesc() === 'fingerprint'}
                      onToggle={() => toggleDesc('fingerprint')}
                      description={DESCRIPTIONS[SPEC_ID.FINGERPRINT]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.HARNESS}>
                    <ExpandableSpec
                      layout="vertical"
                      label="Harness"
                      value={currentCar().harness}
                      isEven={true}
                      isOpen={openDesc() === 'harness'}
                      onToggle={() => toggleDesc('harness')}
                      description={DESCRIPTIONS[SPEC_ID.HARNESS]}
                    />
                  </QuickNavWrapper>
                </AccordionContainer>

                {/* User Video */}
                <Show when={currentCar().video}>
                  {(videoUrl) => <YoutubeVidPlayer videoUrl={videoUrl()} />}
                </Show>

                {/* User Install Video */}
                <Show when={currentCar().setup_video}>
                  {(videoUrl) => (
                    <YoutubeVidPlayer
                      videoUrl={videoUrl()}
                      title="User Install Video"
                      sectionId="user-install-video"
                    />
                  )}
                </Show>
              </div>

              {/* Main Content */}
              <div class="space-y-2 w-full lg:flex-1">
                {/* General Information */}
                <AccordionContainer
                  title="General Information"
                  id="general"
                >
                  <div class="max-w-none prose prose-sm">
                    <div class="text-sm leading-relaxed text-gray-700" innerHTML={String(currentCar().detail_sentence || '')} />
                  </div>
                </AccordionContainer>

                {/* Required Parts */}
                <AccordionContainer
                  title="Required Parts"
                  id="parts"
                >
                  <div class="overflow-x-auto px-2 -mx-2 md:px-0 md:mx-0">
                    <table class="w-full text-sm border-collapse md:min-w-0 min-w-[600px]">
                      <thead>
                        <tr class="bg-gray-50">
                          <th class="p-3 font-medium text-left text-gray-700 border-b border-gray-200">QTY</th>
                          <th class="p-3 font-medium text-left text-gray-700 border-b border-gray-200">PART NAME</th>
                          <th class="p-3 font-medium text-center text-gray-700 border-b border-gray-200">INCLUDED WITH HARNESS</th>
                          <th class="p-3 font-medium text-center text-gray-700 border-b border-gray-200">INCLUDED WITH COMMA 3X</th>
                        </tr>
                      </thead>
                      <tbody>
                        <For
                          each={currentCar().parts || []}
                          fallback={<tr><td colspan="4" class="p-6 text-center text-gray-500">No parts data available</td></tr>}
                        >
                          {(part) => (
                            <tr class="border-b border-gray-100">
                              <td class="p-3 font-medium">{part.count}</td>
                              <td class="p-3">{part.name}</td>
                              <td class="p-3 text-lg text-center">
                                <Show
                                  when={part.type === 'connector' || part.type === 'accessory'}
                                  fallback={<span class="text-gray-400">–</span>}
                                >
                                  <span class="text-green-600">✓</span>
                                </Show>
                              </td>
                              <td class="p-3 text-lg text-center">
                                <Show
                                  when={part.type === 'device'}
                                  fallback={<span class="text-gray-400">–</span>}
                                >
                                  <span class="text-green-600">✓</span>
                                </Show>
                              </td>
                            </tr>
                          )}
                        </For>
                      </tbody>
                    </table>
                  </div>
                </AccordionContainer>

                {/* Technical Parameters */}
                <AccordionContainer
                  title="Technical Parameters"
                  id="technical"
                  disableDefaultPadding={true}
                  contentClass="px-5 py-8 @container"
                >
                  {/* Container query: Grid layout acts better when going big to small screen */}
                  <div class="grid grid-cols-1 gap-4 @[730px]:grid-cols-3 items-start">
                    <div class="flex flex-col bg-white border border-[#e5e7eb]">
                      <h3 class="py-3 px-3 text-sm font-medium uppercase">Tire Configuration:</h3>
                      <div class="flex flex-col flex-1">
                        <QuickNavWrapper id={SPEC_ID.TIRE_STIFFNESS_FACTOR}>
                          <ExpandableSpec
                            label="Stiffness Factor"
                            value={formatValue(currentCar().tire_stiffness_factor)}
                            isEven={true}
                            isOpen={openDesc() === 'tire-stiffness-factor'}
                            onToggle={() => toggleDesc('tire-stiffness-factor')}
                            description={DESCRIPTIONS[SPEC_ID.TIRE_STIFFNESS_FACTOR]}
                          />
                        </QuickNavWrapper>
                        <QuickNavWrapper id={SPEC_ID.TIRE_FRONT_STIFFNESS}>
                          <ExpandableSpec
                            label="Front Stiffness"
                            value={formatValue(currentCar().tire_stiffness_front)}
                            isEven={false}
                            isOpen={openDesc() === 'tire-front-stiffness'}
                            onToggle={() => toggleDesc('tire-front-stiffness')}
                            description={DESCRIPTIONS[SPEC_ID.TIRE_FRONT_STIFFNESS]}
                          />
                        </QuickNavWrapper>
                        <QuickNavWrapper id={SPEC_ID.TIRE_REAR_STIFFNESS}>
                          <ExpandableSpec
                            label="Rear Stiffness"
                            value={formatValue(currentCar().tire_stiffness_rear)}
                            isEven={true}
                            isOpen={openDesc() === 'tire-rear-stiffness'}
                            onToggle={() => toggleDesc('tire-rear-stiffness')}
                            description={DESCRIPTIONS[SPEC_ID.TIRE_REAR_STIFFNESS]}
                          />
                        </QuickNavWrapper>
                      </div>
                    </div>
                    <div class="flex flex-col bg-white border border-[#e5e7eb]">
                      <h3 class="py-3 px-3 text-sm font-medium uppercase">Vehicle Control:</h3>
                      <div class="flex flex-col flex-1">
                        <QuickNavWrapper id={SPEC_ID.ACTUATOR_DELAY}>
                          <ExpandableSpec
                            label="Actuator Delay"
                            value={formatValue(currentCar().steer_actuator_delay, 's')}
                            isEven={true}
                            isOpen={openDesc() === 'actuator-delay'}
                            onToggle={() => toggleDesc('actuator-delay')}
                            description={DESCRIPTIONS[SPEC_ID.ACTUATOR_DELAY]}
                          />
                        </QuickNavWrapper>
                        <QuickNavWrapper id={SPEC_ID.LIMIT_TIMER}>
                          <ExpandableSpec
                            label="Limit Timer"
                            value={formatValue(currentCar().steer_limit_timer, 's')}
                            isEven={false}
                            isOpen={openDesc() === 'limit-timer'}
                            onToggle={() => toggleDesc('limit-timer')}
                            description={DESCRIPTIONS[SPEC_ID.LIMIT_TIMER]}
                          />
                        </QuickNavWrapper>
                        <QuickNavWrapper id={SPEC_ID.CONTROL_TYPE}>
                          <ExpandableSpec
                            label="Control Type"
                            value={currentCar().steer_control_type}
                            isEven={true}
                            isOpen={openDesc() === 'control-type'}
                            onToggle={() => toggleDesc('control-type')}
                            description={DESCRIPTIONS[SPEC_ID.CONTROL_TYPE]}
                          />
                        </QuickNavWrapper>
                      </div>
                    </div>
                    <div class="flex flex-col bg-white border border-[#e5e7eb]">
                      <h3 class="py-3 px-3 text-sm font-medium uppercase">Speed Parameters:</h3>
                      <div class="flex flex-col flex-1">
                        <QuickNavWrapper id={SPEC_ID.STOPPING_SPEED}>
                          <ExpandableSpec
                            label="Stopping Speed"
                            value={formatValue(currentCar().vEgo_stopping, ' m/s')}
                            isEven={true}
                            isOpen={openDesc() === 'stopping-speed'}
                            onToggle={() => toggleDesc('stopping-speed')}
                            description={DESCRIPTIONS[SPEC_ID.STOPPING_SPEED]}
                          />
                        </QuickNavWrapper>
                        <QuickNavWrapper id={SPEC_ID.STARTING_SPEED}>
                          <ExpandableSpec
                            label="Starting Speed"
                            value={formatValue(currentCar().vEgo_starting, ' m/s')}
                            isEven={false}
                            isOpen={openDesc() === 'starting-speed'}
                            onToggle={() => toggleDesc('starting-speed')}
                            description={DESCRIPTIONS[SPEC_ID.STARTING_SPEED]}
                          />
                        </QuickNavWrapper>
                        <QuickNavWrapper id={SPEC_ID.STOP_ACCEL}>
                          <ExpandableSpec
                            label="Stop Accel"
                            value={formatValue(currentCar().stop_accel, ' m/s²')}
                            isEven={true}
                            isOpen={openDesc() === 'stop-accel'}
                            onToggle={() => toggleDesc('stop-accel')}
                            description={DESCRIPTIONS[SPEC_ID.STOP_ACCEL]}
                          />
                        </QuickNavWrapper>
                      </div>
                    </div>
                  </div>
                </AccordionContainer>

                {/* System Configuration */}
                <AccordionContainer
                  title="System Configuration"
                  id="system"
                  disableDefaultPadding={true}
                  contentClass="px-5 py-8 @container"
                >
                  {/* Container query: Grid layout acts better when going big to small screen */}
                  <div class="grid grid-cols-1 gap-4 @[730px]:grid-cols-2 items-start">
                    <div class="flex flex-col bg-white border border-[#e5e7eb]">
                      <h3 class="py-3 px-3 text-sm font-medium uppercase">Network Settings:</h3>
                      <div class="flex flex-col flex-1">
                        <QuickNavWrapper id={SPEC_ID.NETWORK_LOCATION}>
                          <ExpandableSpec
                            label="Network Location"
                            value={currentCar().network_location}
                            isEven={true}
                            isOpen={openDesc() === 'network-location'}
                            onToggle={() => toggleDesc('network-location')}
                            description={DESCRIPTIONS[SPEC_ID.NETWORK_LOCATION]}
                          />
                        </QuickNavWrapper>
                        <QuickNavWrapper id={SPEC_ID.BUS_LOOKUP}>
                          <ExpandableSpec
                            layout="vertical"
                            label="Bus Lookup"
                            isOpen={openDesc() === 'bus-lookup'}
                            onToggle={() => toggleDesc('bus-lookup')}
                            description={DESCRIPTIONS[SPEC_ID.BUS_LOOKUP]}
                          >
                            {(() => {
                              const busLookup = currentCar().bus_lookup

                              return (
                                <Show
                                  when={hasObjectEntries(busLookup)}
                                  fallback={<span class="text-xs">N/A</span>}
                                >
                                  <div class="text-xs break-words">
                                    <For each={Object.entries(busLookup!)}>
                                      {([key, value]) => (
                                        <div class="py-0.5">
                                          <span class="font-semibold">{key}:</span> {value}
                                        </div>
                                      )}
                                    </For>
                                  </div>
                                </Show>
                              )
                            })()}
                          </ExpandableSpec>
                        </QuickNavWrapper>
                      </div>
                    </div>
                    <div class="flex flex-col bg-white border border-[#e5e7eb]">
                      <h3 class="py-3 px-3 text-sm font-medium uppercase">Feature Flags:</h3>
                      <div class="flex flex-col flex-1">
                        <QuickNavWrapper id={SPEC_ID.EXPERIMENTAL_LONGITUDINAL}>
                          <ExpandableSpec
                            label="Experimental Longitudinal"
                            value={currentCar().experimental_longitudinal_available ? 'Enabled' : 'Disabled'}
                            isEven={true}
                            isOpen={openDesc() === 'experimental-longitudinal'}
                            onToggle={() => toggleDesc('experimental-longitudinal')}
                            description={DESCRIPTIONS[SPEC_ID.EXPERIMENTAL_LONGITUDINAL]}
                          />
                        </QuickNavWrapper>
                        <QuickNavWrapper id={SPEC_ID.DSU_ENABLED}>
                          <ExpandableSpec
                            label="DSU Enabled"
                            value={currentCar().enable_dsu ? 'Yes' : 'No'}
                            isEven={false}
                            isOpen={openDesc() === 'dsu-enabled'}
                            onToggle={() => toggleDesc('dsu-enabled')}
                            description={DESCRIPTIONS[SPEC_ID.DSU_ENABLED]}
                          />
                        </QuickNavWrapper>
                        <QuickNavWrapper id={SPEC_ID.BSM_ENABLED}>
                          <ExpandableSpec
                            label="BSM Enabled"
                            value={currentCar().enable_bsm ? 'Yes' : 'No'}
                            isEven={true}
                            isOpen={openDesc() === 'bsm-enabled'}
                            onToggle={() => toggleDesc('bsm-enabled')}
                            description={DESCRIPTIONS[SPEC_ID.BSM_ENABLED]}
                          />
                        </QuickNavWrapper>
                        <QuickNavWrapper id={SPEC_ID.PCM_CRUISE}>
                          <ExpandableSpec
                            label="PCM Cruise"
                            value={currentCar().pcm_cruise ? 'Yes' : 'No'}
                            isEven={false}
                            isOpen={openDesc() === 'pcm-cruise'}
                            onToggle={() => toggleDesc('pcm-cruise')}
                            description={DESCRIPTIONS[SPEC_ID.PCM_CRUISE]}
                          />
                        </QuickNavWrapper>
                      </div>
                    </div>
                  </div>
                </AccordionContainer>

                {/* Capabilities */}
                <AccordionContainer
                  title="Capabilities"
                  id="capabilities"
                  disableDefaultPadding={true}
                >
                  <QuickNavWrapper id={SPEC_ID.MIN_STEERING_SPEED}>
                    <ExpandableSpec
                      label="Min Steering Speed"
                      value={formatSpeed(currentCar().min_steer_speed)}
                      isEven={false}
                      isOpen={openDesc() === 'min-steering-speed'}
                      onToggle={() => toggleDesc('min-steering-speed')}
                      description={DESCRIPTIONS[SPEC_ID.MIN_STEERING_SPEED]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.MIN_ENABLE_SPEED}>
                    <ExpandableSpec
                      label="Min Enable Speed"
                      value={formatSpeed(currentCar().min_enable_speed ?? 0)}
                      isEven={true}
                      isOpen={openDesc() === 'min-enable-speed'}
                      onToggle={() => toggleDesc('min-enable-speed')}
                      description={DESCRIPTIONS[SPEC_ID.MIN_ENABLE_SPEED]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.LONGITUDINAL_CONTROL}>
                    <ExpandableSpec
                      label="Longitudinal Control"
                      value={currentCar().longitudinal}
                      isEven={false}
                      isOpen={openDesc() === 'longitudinal-control'}
                      onToggle={() => toggleDesc('longitudinal-control')}
                      description={DESCRIPTIONS[SPEC_ID.LONGITUDINAL_CONTROL]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.AUTO_RESUME}>
                    <ExpandableSpec
                      label="Auto Resume"
                      value={currentCar().auto_resume ? 'Yes' : 'No'}
                      isEven={true}
                      isOpen={openDesc() === 'auto-resume'}
                      onToggle={() => toggleDesc('auto-resume')}
                      description={DESCRIPTIONS[SPEC_ID.AUTO_RESUME]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.FSR_LONGITUDINAL}>
                    <ExpandableSpec
                      label="FSR Longitudinal"
                      value={currentCar().fsr_longitudinal}
                      isEven={false}
                      isOpen={openDesc() === 'fsr-longitudinal'}
                      onToggle={() => toggleDesc('fsr-longitudinal')}
                      description={DESCRIPTIONS[SPEC_ID.FSR_LONGITUDINAL]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.FSR_STEERING}>
                    <ExpandableSpec
                      label="FSR Steering"
                      value={currentCar().fsr_steering}
                      isEven={true}
                      isOpen={openDesc() === 'fsr-steering'}
                      onToggle={() => toggleDesc('fsr-steering')}
                      description={DESCRIPTIONS[SPEC_ID.FSR_STEERING]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.STEERING_TORQUE}>
                    <ExpandableSpec
                      label="Steering Torque"
                      value={currentCar().steering_torque}
                      isEven={false}
                      isOpen={openDesc() === 'steering-torque'}
                      onToggle={() => toggleDesc('steering-torque')}
                      description={DESCRIPTIONS[SPEC_ID.STEERING_TORQUE]}
                    />
                  </QuickNavWrapper>
                </AccordionContainer>
              </div>

              {/* Right Sidebar */}
              <div class="space-y-4 w-full lg:flex-shrink-0 lg:w-72">
                {/* Quick Navigation - Desktop Only */}
                <Show when={!isMobile()}>
                  <AccordionContainer
                    title="Quick Navigation"
                    id="quick-nav"
                    contentClass="p-4 space-y-1 text-sm max-h-96 overflow-y-auto"
                    disableDefaultPadding={true}
                  >
                    <QuickNavSpecLinks
                      onNavigate={scrollToSpec}
                      variant="desktop"
                      excludeSpecs={[SPEC_ID.YEARS]}
                    />
                  </AccordionContainer>
                </Show>

                {/* Vehicle Metrics */}
                <AccordionContainer
                  title="Vehicle Metrics"
                  id="vehicle-metrics"
                  disableDefaultPadding={true}
                >
                  <QuickNavWrapper id={SPEC_ID.CURB_WEIGHT}>
                    <ExpandableSpec
                      label="Curb Weight"
                      value={formatWeight(currentCar().mass_curb_weight)}
                      isEven={false}
                      isOpen={openDesc() === 'curb-weight'}
                      onToggle={() => toggleDesc('curb-weight')}
                      description={DESCRIPTIONS[SPEC_ID.CURB_WEIGHT]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.WHEELBASE}>
                    <ExpandableSpec
                      label="Wheelbase"
                      value={formatValue(currentCar().wheelbase, ' m')}
                      isEven={true}
                      isOpen={openDesc() === 'wheelbase'}
                      onToggle={() => toggleDesc('wheelbase')}
                      description={DESCRIPTIONS[SPEC_ID.WHEELBASE]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.STEER_RATIO}>
                    <ExpandableSpec
                      label="Steer Ratio"
                      value={formatValue(currentCar().steer_ratio)}
                      isEven={false}
                      isOpen={openDesc() === 'steer-ratio'}
                      onToggle={() => toggleDesc('steer-ratio')}
                      description={DESCRIPTIONS[SPEC_ID.STEER_RATIO]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.CENTER_FRONT_RATIO}>
                    <ExpandableSpec
                      label="Center to Front Ratio"
                      value={formatValue(currentCar().center_to_front_ratio)}
                      isEven={true}
                      isOpen={openDesc() === 'center-front-ratio'}
                      onToggle={() => toggleDesc('center-front-ratio')}
                      description={DESCRIPTIONS[SPEC_ID.CENTER_FRONT_RATIO]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.MAX_LATERAL_ACCEL}>
                    <ExpandableSpec
                      label="Max Lateral Accel"
                      value={formatValue(currentCar().max_lateral_accel, ' m/s²')}
                      isEven={false}
                      isOpen={openDesc() === 'max-lateral-accel'}
                      onToggle={() => toggleDesc('max-lateral-accel')}
                      description={DESCRIPTIONS[SPEC_ID.MAX_LATERAL_ACCEL]}
                    />
                  </QuickNavWrapper>
                </AccordionContainer>

                {/* Feedback Button */}
                <a
                  href="https://opendbc.userjot.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class={cn(
                    'flex items-center justify-between',
                    'w-full gap-2 px-5 py-3 text-sm font-semibold tracking-wide text-white',
                    'border-6 border-gray-700 bg-gradient-to-r from-[#4A4A4A] to-[#686868]',
                    'transition-all duration-200 ease-in cursor-pointer',
                    'md:hover:translate-y-[-2px] md:hover:from-[#0F2F24] md:hover:to-[#00FFA3]',
                    'md:hover:shadow-lg md:hover:shadow-[0_4px_10px_#0F2F24]/40',
                  )}
                >
                  <div class="flex flex-col">
                    <span>See a bug?</span>
                    <span>Submit feedback!</span>
                  </div>
                  <div
                    class="h-8 w-8"
                    innerHTML={LinkNewWindowSvg}
                  />
                </a>
              </div>
            </div>
          </div>
          )}
        </Show>
      </div>
    </QuickNavProvider>
  )
}

export default function CarDetailPage() {
  return (
    <ToggleProvider>
      <CarDetailContent />
    </ToggleProvider>
  )
}
