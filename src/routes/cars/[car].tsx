import { useParams, A } from '@solidjs/router'
import { createMemo, For, createSignal, onMount, onCleanup, type Component } from 'solid-js'
import type { Car } from '~/types/CarDataTypes'
import { getSupportTypeColor } from '~/types/supportType'
import { cn } from '~/lib/utils'
import UpArrowSvg from '~/lib/icons/up-arrow.svg?raw'
import MasterToggle from '~/components/MasterToggle'
import AccordionContainer from '~/components/AccordionContainer'
import ExpandableSpec from '~/components/ExpandableSpec'
import { ToggleProvider, useToggle } from '~/contexts/ToggleContext'

import metadata from '~/data/metadata.json'

const MS_TO_MPH = 2.237

const formatSpeed = (speedMs: number): string => {
  return speedMs > 0 ? `${Math.round(speedMs * MS_TO_MPH)} mph` : 'any speed'
}

const SPEC_ID = {
  // Technical Parameters
  TIRE_STIFFNESS_FACTOR: 'tire-stiffness-factor',
  TIRE_FRONT_STIFFNESS: 'tire-front-stiffness',
  TIRE_REAR_STIFFNESS: 'tire-rear-stiffness',
  ACTUATOR_DELAY: 'actuator-delay',
  LIMIT_TIMER: 'limit-timer',
  CONTROL_TYPE: 'control-type',
  STOPPING_SPEED: 'stopping-speed',
  STARTING_SPEED: 'starting-speed',
  STOP_ACCEL: 'stop-accel',
  // System Configuration
  NETWORK_LOCATION: 'network-location',
  BUS_LOOKUP: 'bus-lookup',
  EXPERIMENTAL_LONGITUDINAL: 'experimental-longitudinal',
  DSU_ENABLED: 'dsu-enabled',
  BSM_ENABLED: 'bsm-enabled',
  PCM_CRUISE: 'pcm-cruise',
  // Capabilities
  MIN_STEERING_SPEED: 'min-steering-speed',
  FSR_LONGITUDINAL: 'fsr-longitudinal',
  FSR_STEERING: 'fsr-steering',
  LONGITUDINAL_CONTROL: 'longitudinal-control',
  SUPPORT_TYPE: 'support-type',
  AUTO_RESUME: 'auto-resume',
  STEERING_TORQUE: 'steering-torque',
  // Vehicle Metrics
  CURB_WEIGHT: 'curb-weight',
  WHEELBASE: 'wheelbase',
  STEER_RATIO: 'steer-ratio',
  CENTER_FRONT_RATIO: 'center-front-ratio',
  MAX_LATERAL_ACCEL: 'max-lateral-accel',
} as const

const QUICK_NAV_SPECS = [
  // Technical Parameters
  { id: SPEC_ID.TIRE_STIFFNESS_FACTOR, label: 'Tire Stiffness Factor', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.TIRE_FRONT_STIFFNESS, label: 'Front Stiffness', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.TIRE_REAR_STIFFNESS, label: 'Rear Stiffness', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.ACTUATOR_DELAY, label: 'Actuator Delay', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.LIMIT_TIMER, label: 'Limit Timer', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.CONTROL_TYPE, label: 'Control Type', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.STOPPING_SPEED, label: 'Stopping Speed', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.STARTING_SPEED, label: 'Starting Speed', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.STOP_ACCEL, label: 'Stop Accel', section: 'technical', category: 'Technical Parameters' },
  // System Configuration
  { id: SPEC_ID.NETWORK_LOCATION, label: 'Network Location', section: 'system', category: 'System Configuration' },
  { id: SPEC_ID.BUS_LOOKUP, label: 'Bus Lookup', section: 'system', category: 'System Configuration' },
  { id: SPEC_ID.EXPERIMENTAL_LONGITUDINAL, label: 'Experimental Longitudinal', section: 'system', category: 'System Configuration' },
  { id: SPEC_ID.DSU_ENABLED, label: 'DSU Enabled', section: 'system', category: 'System Configuration' },
  { id: SPEC_ID.BSM_ENABLED, label: 'BSM Enabled', section: 'system', category: 'System Configuration' },
  { id: SPEC_ID.PCM_CRUISE, label: 'PCM Cruise', section: 'system', category: 'System Configuration' },
  // Capabilities
  { id: SPEC_ID.MIN_STEERING_SPEED, label: 'Min Steering Speed', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.FSR_LONGITUDINAL, label: 'FSR Longitudinal', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.FSR_STEERING, label: 'FSR Steering', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.LONGITUDINAL_CONTROL, label: 'Longitudinal Control', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.SUPPORT_TYPE, label: 'Support Type', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.AUTO_RESUME, label: 'Auto Resume', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.STEERING_TORQUE, label: 'Steering Torque', section: 'capabilities', category: 'Capabilities' },
  // Vehicle Metrics
  { id: SPEC_ID.CURB_WEIGHT, label: 'Curb Weight', section: 'vehicle-metrics', category: 'Vehicle Metrics' },
  { id: SPEC_ID.WHEELBASE, label: 'Wheelbase', section: 'vehicle-metrics', category: 'Vehicle Metrics' },
  { id: SPEC_ID.STEER_RATIO, label: 'Steer Ratio', section: 'vehicle-metrics', category: 'Vehicle Metrics' },
  { id: SPEC_ID.CENTER_FRONT_RATIO, label: 'Center to Front Ratio', section: 'vehicle-metrics', category: 'Vehicle Metrics' },
  { id: SPEC_ID.MAX_LATERAL_ACCEL, label: 'Max Lateral Accel', section: 'vehicle-metrics', category: 'Vehicle Metrics' },
] as const

// Group specs by category for navigation rendering (computed once at module load)
const NAV_CATEGORIES = QUICK_NAV_SPECS.reduce((acc, spec) => {
  if (!acc[spec.category]) acc[spec.category] = []
  acc[spec.category].push(spec)
  return acc
}, {} as Record<string, typeof QUICK_NAV_SPECS[number][]>)

// Helper: Get the section ID for a given spec ID
const getSpecSection = (specId: string): string | undefined => {
  return QUICK_NAV_SPECS.find(spec => spec.id === specId)?.section
}

// Helper: Get highlight classes for a spec element
const getHighlightClasses = (specId: string, highlightedSpec: string | null): string => {
  return highlightedSpec === specId
    ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2'
    : ''
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
                  class="w-4 h-4 transition-opacity duration-300"
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

// Inner component that uses the toggle context
function CarDetailContent() {
  const params = useParams()
  const toggle = useToggle()
  const [highlightedSpec, setHighlightedSpec] = createSignal<string | null>(null)
  const [showUpArrow, setShowUpArrow] = createSignal(false)
  const [openDesc, setOpenDesc] = createSignal<string | null>(null)

  // Force scrollbar to show = prevents layout shift when using MasterToggle
  onMount(() => {
    document.documentElement.style.overflowY = 'scroll'
    onCleanup(() => {
      document.documentElement.style.overflowY = ''
    })
  })

  const car = createMemo((): DetailedSpecs | undefined => {
    const carData = metadata as DetailedSpecs[]
    const carName = params.car ? decodeURIComponent(params.car) : undefined

    if (!carName) return undefined

    // Try exact match first
    let found = carData.find(c => c.name === carName)

    // If not found, try case-insensitive
    if (!found) {
      found = carData.find(c => c.name.toLowerCase() === carName.toLowerCase())
    }

    // If still not found, try partial matching (fallback for old URLs)
    if (!found) {
      const fallbackName = carName.replace(/-/g, ' ')
      found = carData.find(c => c.name === fallbackName || c.name.toLowerCase() === fallbackName.toLowerCase())
    }

    return found
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

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleDesc = (detailId: string) => {
    setOpenDesc(prev => prev === detailId ? null : detailId)
  }

  // Scroll to a specific spec, expanding its section if needed
  const scrollToSpec = (specId: string) => {
    const sectionId = getSpecSection(specId)
    const needsExpansion = sectionId && !toggle.openSections().has(sectionId)

    // Expand the section if it's currently collapsed
    if (needsExpansion) {
      toggle.toggleSection(sectionId)
    }

    // Small delay to allow section expansion animation to start
    setTimeout(() => {
      const element = document.getElementById(specId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setHighlightedSpec(specId)
        // Clear highlight after 3 seconds
        setTimeout(() => setHighlightedSpec(null), 3000)
      }
    }, needsExpansion ? 150 : 0)
  }

  return (
    <div class="min-h-screen bg-gray-100">
      <GradientHeader car={car()} showUpArrow={showUpArrow()} onScrollToTop={scrollToTop} />

      {(() => {
        const currentCar = car()
        if (!currentCar) return null
        return (
        <div class="p-4 pt-20 mx-auto md:p-6 md:pt-24 max-w-[1500px]">

            <div class="flex flex-col gap-4 lg:flex-row lg:gap-6">
              {/* Left Sidebar */}
              <div class="space-y-4 w-full lg:flex-shrink-0 lg:w-72">

                {/* Sidebar Header */}
                <div class="border border-black shadow-sm">
                  <div class="flex justify-between items-stretch pl-4 text-white bg-black">
                    <h1 class="py-3 text-xl font-bold">{car()!.make}</h1>
                    <MasterToggle />
                  </div>
                  <div class="py-3 pl-4 bg-white">
                    <div class="font-medium">{car()!.years} {car()!.make} {car()!.model}</div>
                  </div>
                </div>

                {/* Key Specs */}
                <AccordionContainer
                  title="Key Specs"
                  id="key-specs"
                  contentClass="p-4 space-y-4 text-sm"
                  disableDefaultPadding={true}
                >
                  <div>
                    <div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">Support Type:</div>
                    <div class={cn(
                      'inline-block px-3 py-1 text-xs font-medium text-white rounded border border-black',
                      getSupportTypeColor(car()!.support_type)
                    )}>
                      {car()!.support_type}
                    </div>
                  </div>
                  <div>
                    <div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">ADAS Package:</div>
                    <div class="text-sm leading-relaxed text-gray-900">{car()!.package}</div>
                  </div>
                  <div>
                    <div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">Fingerprint:</div>
                    <div class="py-1 px-2 font-mono text-sm text-gray-800 bg-gray-50 rounded border">{car()!.car_fingerprint}</div>
                  </div>
                  <div>
                    <div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">Harness:</div>
                    <div class="text-sm text-gray-900">{car()!.harness || 'nidec'}</div>
                  </div>
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
                    <div class="text-sm leading-relaxed text-gray-700" innerHTML={String(car()!.detail_sentence || '')} />
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
                        {currentCar.parts && Array.isArray(currentCar.parts) && currentCar.parts.length > 0 ? (
                          <For each={currentCar.parts}>
                            {(part) => (
                              <tr class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="p-3 font-medium">{part.count}</td>
                                <td class="p-3">{part.name}</td>
                                <td class="p-3 text-lg text-center">
                                  <span class={part.type === 'connector' || part.type === 'accessory' ? 'text-green-600' : 'text-gray-400'}>
                                    {part.type === 'connector' || part.type === 'accessory' ? '✓' : '–'}
                                  </span>
                                </td>
                                <td class="p-3 text-lg text-center">
                                  <span class={part.type === 'device' ? 'text-green-600' : 'text-gray-400'}>
                                    {part.type === 'device' ? '✓' : '–'}
                                  </span>
                                </td>
                              </tr>
                            )}
                          </For>
                        ) : (
                          <tr><td colspan="4" class="p-6 text-center text-gray-500">No parts data available</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </AccordionContainer>

                {/* Technical Parameters */}
                <AccordionContainer
                  title="Technical Parameters"
                  id="technical"
                  disableDefaultPadding={true}
                  contentClass="p-4"
                >
                  <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    <div>
                      <h4 class="mb-4 font-semibold tracking-wide text-gray-900 uppercase">TIRE CONFIGURATION:</h4>
                      <div class="space-y-3">
                        <div id={SPEC_ID.TIRE_STIFFNESS_FACTOR} class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${getHighlightClasses(SPEC_ID.TIRE_STIFFNESS_FACTOR, highlightedSpec())}`}>
                          <span class="text-gray-600">Stiffness Factor</span>
                          <span class="font-mono font-medium">{car()!.tire_stiffness_factor ?? 0.72}</span>
                        </div>
                        <div id={SPEC_ID.TIRE_FRONT_STIFFNESS} class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${getHighlightClasses(SPEC_ID.TIRE_FRONT_STIFFNESS, highlightedSpec())}`}>
                          <span class="text-gray-600">Front Stiffness</span>
                          <span class="font-mono font-medium">{car()!.tire_stiffness_front ? Math.round(car()!.tire_stiffness_front as number).toLocaleString() : '155,002'}</span>
                        </div>
                        <div id={SPEC_ID.TIRE_REAR_STIFFNESS} class={`flex justify-between items-center py-2 transition-all duration-300 ${getHighlightClasses(SPEC_ID.TIRE_REAR_STIFFNESS, highlightedSpec())}`}>
                          <span class="text-gray-600">Rear Stiffness</span>
                          <span class="font-mono font-medium">{car()!.tire_stiffness_rear ? Math.round(car()!.tire_stiffness_rear as number).toLocaleString() : '142,048'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 class="mb-4 font-semibold tracking-wide text-gray-900 uppercase">VEHICLE CONTROL:</h4>
                      <div class="space-y-3">
                        <div id={SPEC_ID.ACTUATOR_DELAY} class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${getHighlightClasses(SPEC_ID.ACTUATOR_DELAY, highlightedSpec())}`}>
                          <span class="text-gray-600">Actuator Delay</span>
                          <span class="font-mono font-medium">{car()!.steer_actuator_delay ? `${car()!.steer_actuator_delay}s` : '0.10s'}</span>
                        </div>
                        <div id={SPEC_ID.LIMIT_TIMER} class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${getHighlightClasses(SPEC_ID.LIMIT_TIMER, highlightedSpec())}`}>
                          <span class="text-gray-600">Limit Timer</span>
                          <span class="font-mono font-medium">{car()!.steer_limit_timer ? `${car()!.steer_limit_timer}s` : '0.80s'}</span>
                        </div>
                        <div id={SPEC_ID.CONTROL_TYPE} class={`flex justify-between items-center py-2 transition-all duration-300 ${getHighlightClasses(SPEC_ID.CONTROL_TYPE, highlightedSpec())}`}>
                          <span class="text-gray-600">Control Type</span>
                          <span class="font-mono font-medium">{car()!.steer_control_type || 'torque'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 class="mb-4 font-semibold tracking-wide text-gray-900 uppercase">SPEED PARAMETERS:</h4>
                      <div class="space-y-3">
                        <div id={SPEC_ID.STOPPING_SPEED} class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${getHighlightClasses(SPEC_ID.STOPPING_SPEED, highlightedSpec())}`}>
                          <span class="text-gray-600">Stopping Speed</span>
                          <span class="font-mono font-medium">{car()!.vEgo_stopping ? `${car()!.vEgo_stopping} m/s` : '0.50 m/s'}</span>
                        </div>
                        <div id={SPEC_ID.STARTING_SPEED} class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${getHighlightClasses(SPEC_ID.STARTING_SPEED, highlightedSpec())}`}>
                          <span class="text-gray-600">Starting Speed</span>
                          <span class="font-mono font-medium">{car()!.vEgo_starting ? `${car()!.vEgo_starting} m/s` : '0.50 m/s'}</span>
                        </div>
                        <div id={SPEC_ID.STOP_ACCEL} class={`flex justify-between items-center py-2 transition-all duration-300 ${getHighlightClasses(SPEC_ID.STOP_ACCEL, highlightedSpec())}`}>
                          <span class="text-gray-600">Stop Accel</span>
                          <span class="font-mono font-medium">{car()!.stop_accel || '–2.80'} m/s²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContainer>

                {/* System Configuration */}
                <AccordionContainer
                  title="System Configuration"
                  id="system"
                  disableDefaultPadding={true}
                  contentClass="p-4"
                >
                  <div class="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:gap-8">
                    <div>
                      <h4 class="mb-4 font-semibold tracking-wide text-gray-900 uppercase">NETWORK SETTINGS:</h4>
                      <div class="space-y-4">
                        <div id={SPEC_ID.NETWORK_LOCATION} class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.NETWORK_LOCATION ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2 py-2 -my-2' : ''}`}>
                          <div class="mb-1 text-xs tracking-wide text-gray-600 uppercase">Network Location</div>
                          <div class="py-2 px-3 font-mono text-gray-900 bg-gray-50 rounded border">{car()!.network_location || 'fwdCamera'}</div>
                        </div>
                        <div id={SPEC_ID.BUS_LOOKUP} class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.BUS_LOOKUP ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2 py-2 -my-2' : ''}`}>
                          <div class="mb-1 text-xs tracking-wide text-gray-600 uppercase">Bus Lookup</div>
                          <div class="py-2 px-3 font-mono text-sm bg-gray-50 rounded border">
                            <div><strong>pt:</strong> {car()!.bus_lookup?.pt || 'acura_ilx_2016_can_generated'}</div>
                            <div><strong>radar:</strong> {car()!.bus_lookup?.radar || 'acura_ilx_2016_nidec'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 class="mb-4 font-semibold tracking-wide text-gray-900 uppercase">FEATURE FLAGS:</h4>
                      <div class="space-y-3">
                        <div id={SPEC_ID.EXPERIMENTAL_LONGITUDINAL} class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${getHighlightClasses(SPEC_ID.EXPERIMENTAL_LONGITUDINAL, highlightedSpec())}`}>
                          <span class="text-gray-600">Experimental Longitudinal</span>
                          <span class={`font-medium ${car()!.experimental_longitudinal_available ? 'text-green-600' : 'text-red-600'}`}>
                            {car()!.experimental_longitudinal_available ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div id={SPEC_ID.DSU_ENABLED} class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${getHighlightClasses(SPEC_ID.DSU_ENABLED, highlightedSpec())}`}>
                          <span class="text-gray-600">DSU Enabled</span>
                          <span class={`font-medium ${car()!.enable_dsu ? 'text-green-600' : 'text-red-600'}`}>
                            {car()!.enable_dsu ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div id={SPEC_ID.BSM_ENABLED} class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${getHighlightClasses(SPEC_ID.BSM_ENABLED, highlightedSpec())}`}>
                          <span class="text-gray-600">BSM Enabled</span>
                          <span class={`font-medium ${car()!.enable_bsm ? 'text-green-600' : 'text-red-600'}`}>
                            {car()!.enable_bsm ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div id={SPEC_ID.PCM_CRUISE} class={`flex justify-between items-center py-2 transition-all duration-300 ${getHighlightClasses(SPEC_ID.PCM_CRUISE, highlightedSpec())}`}>
                          <span class="text-gray-600">PCM Cruise</span>
                          <span class={`font-medium ${car()!.pcm_cruise ? 'text-green-600' : 'text-red-600'}`}>
                            {car()!.pcm_cruise ? 'Yes' : 'No'}
                          </span>
                        </div>
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
                  <div
                    id={SPEC_ID.MIN_STEERING_SPEED}
                    class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.MIN_STEERING_SPEED ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                  >
                    <ExpandableSpec
                      label="Min Steering Speed"
                      value={formatSpeed(car()!.min_steer_speed)}
                      description="The minimum speed at which openpilot can provide steering assistance. Below this speed, the driver must steer manually."
                      isEven={false}
                      isOpen={openDesc() === 'min-steering-speed'}
                      onToggle={() => toggleDesc('min-steering-speed')}
                    />
                  </div>
                  <div
                    id={SPEC_ID.FSR_LONGITUDINAL}
                    class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.FSR_LONGITUDINAL ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                  >
                    <ExpandableSpec
                      label="FSR Longitudinal"
                      value={car()!.fsr_longitudinal || '26 mph'}
                      description="Full Self-Driving Capability longitudinal speed threshold. The minimum speed for longitudinal (acceleration/braking) control in FSR mode."
                      isEven={true}
                      isOpen={openDesc() === 'fsr-longitudinal'}
                      onToggle={() => toggleDesc('fsr-longitudinal')}
                    />
                  </div>
                  <div
                    id={SPEC_ID.FSR_STEERING}
                    class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.FSR_STEERING ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                  >
                    <ExpandableSpec
                      label="FSR Steering"
                      value={car()!.fsr_steering || '25 mph'}
                      description="Full Self-Driving Capability steering speed threshold. The minimum speed for steering control in FSR mode."
                      isEven={false}
                      isOpen={openDesc() === 'fsr-steering'}
                      onToggle={() => toggleDesc('fsr-steering')}
                    />
                  </div>
                  <div
                    id={SPEC_ID.LONGITUDINAL_CONTROL}
                    class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.LONGITUDINAL_CONTROL ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                  >
                    <ExpandableSpec
                      label="Longitudinal Control"
                      value={car()!.longitudinal || 'openpilot'}
                      description="The system responsible for acceleration and braking control. 'openpilot' means full longitudinal control, while other values may indicate limited or no longitudinal control."
                      isEven={true}
                      isOpen={openDesc() === 'longitudinal-control'}
                      onToggle={() => toggleDesc('longitudinal-control')}
                    />
                  </div>
                  <div
                    id={SPEC_ID.SUPPORT_TYPE}
                    class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.SUPPORT_TYPE ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                  >
                    <ExpandableSpec
                      label="Support Type"
                      value={car()!.support_type}
                      description="The level of openpilot support for this vehicle. 'Upstream' indicates full official support, while other types may have varying levels of functionality."
                      isEven={false}
                      isOpen={openDesc() === 'support-type'}
                      onToggle={() => toggleDesc('support-type')}
                    />
                  </div>
                  <div
                    id={SPEC_ID.AUTO_RESUME}
                    class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.AUTO_RESUME ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                  >
                    <ExpandableSpec
                      label="Auto Resume"
                      value={car()!.auto_resume ? 'Yes' : 'No'}
                      description="Whether openpilot can automatically resume driving after coming to a complete stop, without driver intervention."
                      isEven={true}
                      isOpen={openDesc() === 'auto-resume'}
                      onToggle={() => toggleDesc('auto-resume')}
                    />
                  </div>
                  <div
                    id={SPEC_ID.STEERING_TORQUE}
                    class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.STEERING_TORQUE ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                  >
                    <ExpandableSpec
                      label="Steering Torque"
                      value={car()!.steering_torque || 'empty'}
                      description="Information about the steering torque characteristics or limitations for this vehicle. 'Empty' typically means no specific torque data is available."
                      isEven={false}
                      isOpen={openDesc() === 'steering-torque'}
                      onToggle={() => toggleDesc('steering-torque')}
                    />
                  </div>
                </AccordionContainer>
              </div>

              {/* Right Sidebar */}
              <div class="space-y-4 w-full lg:flex-shrink-0 lg:w-72">
                {/* Quick Navigation */}
                <AccordionContainer
                  title="Quick Navigation"
                  id="quick-nav"
                  contentClass="p-4 space-y-1 text-sm max-h-96 overflow-y-auto"
                  disableDefaultPadding={true}
                >
                  <For each={Object.entries(NAV_CATEGORIES)}>
                    {([category, specs], index) => (
                      <>
                        <div class={`${index() === 0 ? 'mt-2' : 'mt-4'} mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase`}>
                          {category}
                        </div>
                        <For each={specs}>
                          {(spec) => (
                            <button
                              onClick={() => scrollToSpec(spec.id)}
                              class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300"
                            >
                              {spec.label}
                            </button>
                          )}
                        </For>
                      </>
                    )}
                  </For>
                </AccordionContainer>

                {/* Vehicle Metrics */}
                <AccordionContainer
                  title="Vehicle Metrics"
                  id="vehicle-metrics"
                  disableDefaultPadding={true}
                >
                  <div id={SPEC_ID.CURB_WEIGHT} class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.CURB_WEIGHT ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                    <ExpandableSpec
                      label="Curb Weight"
                      value={`${Math.round(car()!.mass_curb_weight * 2.20462).toLocaleString()} lbs`}
                      description="The weight of the vehicle without passengers or cargo, including all fluids and a full tank of fuel."
                      isEven={false}
                      isOpen={openDesc() === 'curb-weight'}
                      onToggle={() => toggleDesc('curb-weight')}
                    />
                  </div>
                  <div id={SPEC_ID.WHEELBASE} class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.WHEELBASE ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                    <ExpandableSpec
                      label="Wheelbase"
                      value={car()!.wheelbase ? `${(car()!.wheelbase as number).toFixed(2)} m` : '~2.67 m'}
                      description="The distance between the centers of the front and rear wheels. A longer wheelbase typically provides better stability at high speeds."
                      isEven={true}
                      isOpen={openDesc() === 'wheelbase'}
                      onToggle={() => toggleDesc('wheelbase')}
                    />
                  </div>
                  <div id={SPEC_ID.STEER_RATIO} class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.STEER_RATIO ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                    <ExpandableSpec
                      label="Steer Ratio"
                      value={car()!.steer_ratio ? `~${(car()!.steer_ratio as number).toFixed(1)}` : '~18.61'}
                      description="The ratio between the steering wheel angle and the front wheel angle. A higher ratio means more steering wheel turns are needed for the same wheel angle."
                      isEven={false}
                      isOpen={openDesc() === 'steer-ratio'}
                      onToggle={() => toggleDesc('steer-ratio')}
                    />
                  </div>
                  <div id={SPEC_ID.CENTER_FRONT_RATIO} class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.CENTER_FRONT_RATIO ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                    <ExpandableSpec
                      label="Center to Front Ratio"
                      value={car()!.center_to_front_ratio ? `~${(car()!.center_to_front_ratio as number).toFixed(2)}` : '~0.37'}
                      description="The ratio of the distance from the center of gravity to the front axle versus the total wheelbase. Affects weight distribution and handling characteristics."
                      isEven={true}
                      isOpen={openDesc() === 'center-front-ratio'}
                      onToggle={() => toggleDesc('center-front-ratio')}
                    />
                  </div>
                  <div id={SPEC_ID.MAX_LATERAL_ACCEL} class={`transition-all duration-300 ${highlightedSpec() === SPEC_ID.MAX_LATERAL_ACCEL ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                    <ExpandableSpec
                      label="Max Lateral Accel"
                      value={car()!.max_lateral_accel ? `~${(car()!.max_lateral_accel as number).toFixed(2)} m/s²` : '~0.52 m/s²'}
                      description="The maximum lateral acceleration the vehicle can sustain during cornering before losing traction. Higher values indicate better cornering capability."
                      isEven={false}
                      isOpen={openDesc() === 'max-lateral-accel'}
                      onToggle={() => toggleDesc('max-lateral-accel')}
                    />
                  </div>
                </AccordionContainer>
              </div>
            </div>
        </div>
        )
      })()}

      {!car() && (
        <div class="p-8 text-center">
          <h1 class="mb-4 text-2xl font-bold text-gray-900">Car Not Found</h1>
          <p class="mb-6 text-gray-600">The requested vehicle "{params.car}" could not be found in our database.</p>
          <A href="/" class="inline-flex items-center py-2 px-4 text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700">
            ← Back to Car List
          </A>
        </div>
      )}
    </div>
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
