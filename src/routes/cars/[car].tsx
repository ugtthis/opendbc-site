import { useParams, A } from '@solidjs/router'
import { createMemo, For, createSignal, onMount, onCleanup, Show, type Component } from 'solid-js'
import type { Car } from '~/types/CarDataTypes'
import UpArrowSvg from '~/lib/icons/up-arrow.svg?raw'
import MasterToggle from '~/components/MasterToggle'
import AccordionContainer from '~/components/AccordionContainer'
import ExpandableSpec from '~/components/ExpandableSpec'
import { QuickNavProvider, QuickNavWrapper } from '~/components/QuickNavHighlight'
import QuickNavDrawer from '~/components/QuickNavDrawer'
import QuickNavSpecLinks from '~/components/QuickNavSpecLinks'
import { SPEC_ID, getAccordionIdForSpec } from '~/data/quickNavSpecs'
import { DESCRIPTIONS } from '~/data/specDescriptions'
import { ToggleProvider, useToggle } from '~/contexts/ToggleContext'
import createMediaQuery from '~/utils/createMediaQuery'
import { BREAKPOINTS } from '~/utils/breakpoints'
import { slugify } from '~/lib/utils'
import { getSupportTypeColor } from '~/types/supportType'

import metadata from '~/data/metadata.json'

const MS_TO_MPH = 2.237
const KG_TO_LBS = 2.20462

const formatSpeed = (speedMs: number): string => {
  return speedMs > 0 ? `${Math.round(speedMs * MS_TO_MPH)} mph` : 'any speed'
}

const formatValue = (value: number | undefined, unit: string = ''): string => {
  if (value === undefined) return 'N/A'

  if (Math.abs(value) >= 1000) {
    return `~${Math.round(value).toLocaleString()}${unit}`
  }

  return `~${value.toFixed(2)}${unit}`
}

const formatWeight = (kg: number | undefined): string => {
  if (kg === undefined) return 'N/A'
  const lbs = Math.round(kg * KG_TO_LBS)
  return `${lbs.toLocaleString()} lbs`
}

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
  fsr_longitudinal?: string
  fsr_steering?: string
  longitudinal?: string
  steering_torque?: string
  wheelbase?: number
  center_to_front_ratio?: number
  max_lateral_accel?: number
}


type GradientHeaderProps = {
  car: DetailedSpecs | undefined
  showUpArrow: boolean
  onScrollToTop: () => void
}

const GradientHeader: Component<GradientHeaderProps> = (props) => {
  return (
    <div class="fixed top-0 right-0 left-0 z-50 py-3 border-black md:py-4 gradient-dark-forrest border-b-[3px] shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
      <div class="px-4 mx-auto md:px-6 max-w-[1500px]">
        <nav class="flex items-center text-sm font-medium text-white">
          <A href="/" class="transition-colors hover:text-gray-200">
            Home
          </A>
          <span class="mx-2 text-gray-300">{'>'}</span>
          <div class="flex gap-2 items-center">
            <button
              onClick={props.onScrollToTop}
              class="flex gap-1 items-center text-gray-200 transition-colors cursor-pointer hover:text-white"
            >
              {props.car ? `${props.car.make} ${props.car.model} ${props.car.years}` : 'Loading...'}
              {props.showUpArrow && (
                <div
                  class="w-4 h-4 transition-opacity duration-300 bouncy-arrow"
                  innerHTML={UpArrowSvg}
                />
              )}
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}

function CarDetailContent() {
  const params = useParams()
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
      // Show up arrow when scrolled down more than 150px
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

    if (needsExpansion) {
      toggle.toggleSection(accordionId)
    }

    if (highlightTimeoutId !== undefined) {
      clearTimeout(highlightTimeoutId)
    }

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
            <div class="p-8 text-center">
              <h1 class="mb-4 text-2xl font-bold text-gray-900">Car Not Found</h1>
              <p class="mb-6 text-gray-600">The requested vehicle "{params.car}" could not be found in our database.</p>
              <A href="/" class="inline-flex items-center py-2 px-4 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
                ← Back to Car List
              </A>
            </div>
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
                    <div class="font-medium">{currentCar().years} {currentCar().make} {currentCar().model}</div>
                  </div>
                </div>

                {/* Mobile Quick Nav Drawer */}
                <Show when={isMobile()}>
                  <button
                    onClick={() => setQuickNavDrawerOpen(true)}
                    class="flex gap-2 justify-center items-center py-3 px-4 w-full font-medium text-white bg-black border border-black transition-colors cursor-pointer hover:bg-gray-800"
                  >
                    <span>Quick Navigation</span>
                  </button>
                </Show>

                {/* Outside <Show> for smooth animations */}
                <QuickNavDrawer
                  open={quickNavDrawerOpen()}
                  onOpenChange={setQuickNavDrawerOpen}
                  onNavigate={scrollToSpec}
                />

                {/* Compatibility Info */}
                <AccordionContainer
                  title="Compatibility Info"
                  id="compatibility-info"
                  disableDefaultPadding={true}
                >
                  <div class={`h-4 w-full -mb-1.5 ${getSupportTypeColor(currentCar().support_type)}`} />
                  <QuickNavWrapper id={SPEC_ID.SUPPORT_TYPE_BADGE} variant="outline">
                    <ExpandableSpec
                      layout="vertical"
                      label="Support Type"
                      isOpen={openDesc() === 'support-type-badge'}
                      onToggle={() => toggleDesc('support-type-badge')}
                      description={DESCRIPTIONS[SPEC_ID.SUPPORT_TYPE_BADGE]}
                    >
                      <span class="text-sm font-semibold uppercase">{currentCar().support_type}</span>
                    </ExpandableSpec>
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.ADAS_PACKAGE} variant="outline">
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
                  <QuickNavWrapper id={SPEC_ID.FINGERPRINT} variant="outline">
                    <ExpandableSpec
                      layout="vertical"
                      label="Fingerprint"
                      value={currentCar().car_fingerprint}
                      isOpen={openDesc() === 'fingerprint'}
                      onToggle={() => toggleDesc('fingerprint')}
                      description={DESCRIPTIONS[SPEC_ID.FINGERPRINT]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.HARNESS} variant="outline">
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
                            <Show
                              when={currentCar().bus_lookup}
                              fallback={<span class="text-xs">N/A</span>}
                            >
                              {(busLookup) => (
                                <div class="text-xs break-words">
                                  <For each={Object.entries(busLookup())}>
                                    {([key, value]) => (
                                      <div class="py-0.5">
                                        <span class="font-semibold">{key}:</span> {value}
                                      </div>
                                    )}
                                  </For>
                                </div>
                              )}
                            </Show>
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
                  <QuickNavWrapper id={SPEC_ID.MIN_STEERING_SPEED} variant="outline">
                    <ExpandableSpec
                      label="Min Steering Speed"
                      value={formatSpeed(currentCar().min_steer_speed)}
                      isEven={false}
                      isOpen={openDesc() === 'min-steering-speed'}
                      onToggle={() => toggleDesc('min-steering-speed')}
                      description={DESCRIPTIONS[SPEC_ID.MIN_STEERING_SPEED]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.FSR_LONGITUDINAL} variant="outline">
                    <ExpandableSpec
                      label="FSR Longitudinal"
                      value={currentCar().fsr_longitudinal}
                      isEven={true}
                      isOpen={openDesc() === 'fsr-longitudinal'}
                      onToggle={() => toggleDesc('fsr-longitudinal')}
                      description={DESCRIPTIONS[SPEC_ID.FSR_LONGITUDINAL]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.FSR_STEERING} variant="outline">
                    <ExpandableSpec
                      label="FSR Steering"
                      value={currentCar().fsr_steering}
                      isEven={false}
                      isOpen={openDesc() === 'fsr-steering'}
                      onToggle={() => toggleDesc('fsr-steering')}
                      description={DESCRIPTIONS[SPEC_ID.FSR_STEERING]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.LONGITUDINAL_CONTROL} variant="outline">
                    <ExpandableSpec
                      label="Longitudinal Control"
                      value={currentCar().longitudinal}
                      isEven={true}
                      isOpen={openDesc() === 'longitudinal-control'}
                      onToggle={() => toggleDesc('longitudinal-control')}
                      description={DESCRIPTIONS[SPEC_ID.LONGITUDINAL_CONTROL]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.SUPPORT_TYPE} variant="outline">
                    <ExpandableSpec
                      label="Support Type"
                      isEven={false}
                      isOpen={openDesc() === 'support-type'}
                      onToggle={() => toggleDesc('support-type')}
                      description={DESCRIPTIONS[SPEC_ID.SUPPORT_TYPE]}
                    >
                      <span class="font-semibold uppercase">{currentCar().support_type}</span>
                    </ExpandableSpec>
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.AUTO_RESUME} variant="outline">
                    <ExpandableSpec
                      label="Auto Resume"
                      value={currentCar().auto_resume ? 'Yes' : 'No'}
                      isEven={true}
                      isOpen={openDesc() === 'auto-resume'}
                      onToggle={() => toggleDesc('auto-resume')}
                      description={DESCRIPTIONS[SPEC_ID.AUTO_RESUME]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.STEERING_TORQUE} variant="outline">
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
                    <QuickNavSpecLinks onNavigate={scrollToSpec} variant="desktop" />
                  </AccordionContainer>
                </Show>

                {/* Vehicle Metrics */}
                <AccordionContainer
                  title="Vehicle Metrics"
                  id="vehicle-metrics"
                  disableDefaultPadding={true}
                >
                  <QuickNavWrapper id={SPEC_ID.CURB_WEIGHT} variant="outline">
                    <ExpandableSpec
                      label="Curb Weight"
                      value={formatWeight(currentCar().mass_curb_weight)}
                      isEven={false}
                      isOpen={openDesc() === 'curb-weight'}
                      onToggle={() => toggleDesc('curb-weight')}
                      description={DESCRIPTIONS[SPEC_ID.CURB_WEIGHT]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.WHEELBASE} variant="outline">
                    <ExpandableSpec
                      label="Wheelbase"
                      value={formatValue(currentCar().wheelbase, ' m')}
                      isEven={true}
                      isOpen={openDesc() === 'wheelbase'}
                      onToggle={() => toggleDesc('wheelbase')}
                      description={DESCRIPTIONS[SPEC_ID.WHEELBASE]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.STEER_RATIO} variant="outline">
                    <ExpandableSpec
                      label="Steer Ratio"
                      value={formatValue(currentCar().steer_ratio)}
                      isEven={false}
                      isOpen={openDesc() === 'steer-ratio'}
                      onToggle={() => toggleDesc('steer-ratio')}
                      description={DESCRIPTIONS[SPEC_ID.STEER_RATIO]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.CENTER_FRONT_RATIO} variant="outline">
                    <ExpandableSpec
                      label="Center to Front Ratio"
                      value={formatValue(currentCar().center_to_front_ratio)}
                      isEven={true}
                      isOpen={openDesc() === 'center-front-ratio'}
                      onToggle={() => toggleDesc('center-front-ratio')}
                      description={DESCRIPTIONS[SPEC_ID.CENTER_FRONT_RATIO]}
                    />
                  </QuickNavWrapper>
                  <QuickNavWrapper id={SPEC_ID.MAX_LATERAL_ACCEL} variant="outline">
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
              </div>
            </div>
          </div>
          )}
        </Show>
      </div>
    </QuickNavProvider>
  )
}

// Main component that provides the context
export default function CarDetailPage() {
  return (
    <ToggleProvider>
      <CarDetailContent />
    </ToggleProvider>
  )
}
