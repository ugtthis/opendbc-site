import { useParams, A } from '@solidjs/router'
import { createMemo, For, createSignal, onMount, onCleanup, type Component } from 'solid-js'
import type { Car } from '~/types/CarDataTypes'
import { getSupportTypeColor } from '~/types/supportType'
import { cn } from '~/lib/utils'
import UpArrowSvg from '~/lib/icons/up-arrow.svg?raw'
import MasterToggle from '~/components/MasterToggle'
import AccordionContainer from '~/components/AccordionContainer'
import { ToggleProvider, useToggle } from '~/contexts/ToggleContext'

import metadata from '~/data/metadata.json'

const MS_TO_MPH = 2.237

const formatSpeed = (speedMs: number): string => {
  return speedMs > 0 ? `${Math.round(speedMs * MS_TO_MPH)} mph` : 'any speed'
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
  const [highlightedMetric, setHighlightedMetric] = createSignal<string | null>(null)
  const [showUpArrow, setShowUpArrow] = createSignal(false)

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

  // Mapping of metric IDs to their parent sections
  const metricToSection: Record<string, string> = {
    // Technical Parameters
    'metric-tire-stiffness-factor': 'technical',
    'metric-tire-front-stiffness': 'technical',
    'metric-tire-rear-stiffness': 'technical',
    'metric-actuator-delay': 'technical',
    'metric-limit-timer': 'technical',
    'metric-control-type': 'technical',
    'metric-stopping-speed': 'technical',
    'metric-starting-speed': 'technical',
    'metric-stop-accel': 'technical',
    // System Configuration
    'metric-network-location': 'system',
    'metric-bus-lookup': 'system',
    'metric-experimental-longitudinal': 'system',
    'metric-dsu-enabled': 'system',
    'metric-bsm-enabled': 'system',
    'metric-pcm-cruise': 'system',
    // Capabilities
    'metric-min-steering-speed': 'capabilities',
    'metric-fsr-longitudinal': 'capabilities',
    'metric-fsr-steering': 'capabilities',
    'metric-longitudinal-control': 'capabilities',
    'metric-support-type': 'capabilities',
    'metric-auto-resume': 'capabilities',
    'metric-steering-torque': 'capabilities',
    // Vehicle Metrics (always visible in sidebar)
    'metric-curb-weight': 'sidebar',
    'metric-wheelbase': 'sidebar',
    'metric-steer-ratio': 'sidebar',
    'metric-center-front-ratio': 'sidebar',
    'metric-max-lateral-accel': 'sidebar'
  }

  const scrollToMetric = (metricId: string) => {
    // First, expand the section if it's collapsed
    const sectionId = metricToSection[metricId]
    const needsExpansion = sectionId && sectionId !== 'sidebar' && !toggle.openSections().has(sectionId)

    if (needsExpansion) {
      toggle.toggleSection(sectionId)
    }

    // Small delay to allow section expansion animation to start
    setTimeout(() => {
      const element = document.getElementById(metricId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setHighlightedMetric(metricId)
        // Clear highlight after 3 seconds
        setTimeout(() => setHighlightedMetric(null), 3000)
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
                        <div id="metric-tire-stiffness-factor" class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${highlightedMetric() === 'metric-tire-stiffness-factor' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
                          <span class="text-gray-600">Stiffness Factor</span>
                          <span class="font-mono font-medium">{car()!.tire_stiffness_factor ?? 0.72}</span>
                        </div>
                        <div id="metric-tire-front-stiffness" class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${highlightedMetric() === 'metric-tire-front-stiffness' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
                          <span class="text-gray-600">Front Stiffness</span>
                          <span class="font-mono font-medium">{car()!.tire_stiffness_front ? Math.round(car()!.tire_stiffness_front as number).toLocaleString() : '155,002'}</span>
                        </div>
                        <div id="metric-tire-rear-stiffness" class={`flex justify-between items-center py-2 transition-all duration-300 ${highlightedMetric() === 'metric-tire-rear-stiffness' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
                          <span class="text-gray-600">Rear Stiffness</span>
                          <span class="font-mono font-medium">{car()!.tire_stiffness_rear ? Math.round(car()!.tire_stiffness_rear as number).toLocaleString() : '142,048'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 class="mb-4 font-semibold tracking-wide text-gray-900 uppercase">VEHICLE CONTROL:</h4>
                      <div class="space-y-3">
                        <div id="metric-actuator-delay" class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${highlightedMetric() === 'metric-actuator-delay' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
                          <span class="text-gray-600">Actuator Delay</span>
                          <span class="font-mono font-medium">{car()!.steer_actuator_delay ? `${car()!.steer_actuator_delay}s` : '0.10s'}</span>
                        </div>
                        <div id="metric-limit-timer" class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${highlightedMetric() === 'metric-limit-timer' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
                          <span class="text-gray-600">Limit Timer</span>
                          <span class="font-mono font-medium">{car()!.steer_limit_timer ? `${car()!.steer_limit_timer}s` : '0.80s'}</span>
                        </div>
                        <div id="metric-control-type" class={`flex justify-between items-center py-2 transition-all duration-300 ${highlightedMetric() === 'metric-control-type' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
                          <span class="text-gray-600">Control Type</span>
                          <span class="font-mono font-medium">{car()!.steer_control_type || 'torque'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 class="mb-4 font-semibold tracking-wide text-gray-900 uppercase">SPEED PARAMETERS:</h4>
                      <div class="space-y-3">
                        <div id="metric-stopping-speed" class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${highlightedMetric() === 'metric-stopping-speed' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
                          <span class="text-gray-600">Stopping Speed</span>
                          <span class="font-mono font-medium">{car()!.vEgo_stopping ? `${car()!.vEgo_stopping} m/s` : '0.50 m/s'}</span>
                        </div>
                        <div id="metric-starting-speed" class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${highlightedMetric() === 'metric-starting-speed' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
                          <span class="text-gray-600">Starting Speed</span>
                          <span class="font-mono font-medium">{car()!.vEgo_starting ? `${car()!.vEgo_starting} m/s` : '0.50 m/s'}</span>
                        </div>
                        <div id="metric-stop-accel" class={`flex justify-between items-center py-2 transition-all duration-300 ${highlightedMetric() === 'metric-stop-accel' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
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
                        <div id="metric-network-location" class={`transition-all duration-300 ${highlightedMetric() === 'metric-network-location' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2 py-2 -my-2' : ''}`}>
                          <div class="mb-1 text-xs tracking-wide text-gray-600 uppercase">Network Location</div>
                          <div class="py-2 px-3 font-mono text-gray-900 bg-gray-50 rounded border">{car()!.network_location || 'fwdCamera'}</div>
                        </div>
                        <div id="metric-bus-lookup" class={`transition-all duration-300 ${highlightedMetric() === 'metric-bus-lookup' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2 py-2 -my-2' : ''}`}>
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
                        <div id="metric-experimental-longitudinal" class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${highlightedMetric() === 'metric-experimental-longitudinal' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
                          <span class="text-gray-600">Experimental Longitudinal</span>
                          <span class={`font-medium ${car()!.experimental_longitudinal_available ? 'text-green-600' : 'text-red-600'}`}>
                            {car()!.experimental_longitudinal_available ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                        <div id="metric-dsu-enabled" class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${highlightedMetric() === 'metric-dsu-enabled' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
                          <span class="text-gray-600">DSU Enabled</span>
                          <span class={`font-medium ${car()!.enable_dsu ? 'text-green-600' : 'text-red-600'}`}>
                            {car()!.enable_dsu ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div id="metric-bsm-enabled" class={`flex justify-between items-center py-2 border-b border-gray-100 transition-all duration-300 ${highlightedMetric() === 'metric-bsm-enabled' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
                          <span class="text-gray-600">BSM Enabled</span>
                          <span class={`font-medium ${car()!.enable_bsm ? 'text-green-600' : 'text-red-600'}`}>
                            {car()!.enable_bsm ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div id="metric-pcm-cruise" class={`flex justify-between items-center py-2 transition-all duration-300 ${highlightedMetric() === 'metric-pcm-cruise' ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2' : ''}`}>
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
                  contentClass="p-4"
                >
                  <div class="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                    <div id="metric-min-steering-speed" class={`text-center p-3 md:p-4 bg-gray-50 rounded-lg border transition-all duration-300 ${highlightedMetric() === 'metric-min-steering-speed' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">Min Steering Speed</div>
                      <div class="text-lg font-bold md:text-xl">{formatSpeed(car()!.min_steer_speed)}</div>
                    </div>
                    <div id="metric-fsr-longitudinal" class={`text-center p-3 md:p-4 bg-gray-50 rounded-lg border transition-all duration-300 ${highlightedMetric() === 'metric-fsr-longitudinal' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">FSR Longitudinal</div>
                      <div class="text-lg font-bold md:text-xl">{car()!.fsr_longitudinal || '26 mph'}</div>
                    </div>
                    <div id="metric-fsr-steering" class={`text-center p-3 md:p-4 bg-gray-50 rounded-lg border transition-all duration-300 ${highlightedMetric() === 'metric-fsr-steering' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">FSR Steering</div>
                      <div class="text-lg font-bold md:text-xl">{car()!.fsr_steering || '25 mph'}</div>
                    </div>
                    <div id="metric-longitudinal-control" class={`text-center p-3 md:p-4 bg-gray-50 rounded-lg border transition-all duration-300 ${highlightedMetric() === 'metric-longitudinal-control' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">Longitudinal Control</div>
                      <div class="text-lg font-bold md:text-xl">{car()!.longitudinal || 'openpilot'}</div>
                    </div>
                    <div id="metric-support-type" class={`text-center p-3 md:p-4 bg-gray-50 rounded-lg border transition-all duration-300 ${highlightedMetric() === 'metric-support-type' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">Support Type</div>
                      <div class="text-lg font-bold md:text-xl">{car()!.support_type}</div>
                    </div>
                    <div id="metric-auto-resume" class={`text-center p-3 md:p-4 bg-gray-50 rounded-lg border transition-all duration-300 ${highlightedMetric() === 'metric-auto-resume' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">Auto Resume</div>
                      <div class={`text-lg md:text-xl font-bold`}>
                        {car()!.auto_resume ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div id="metric-steering-torque" class={`text-center p-3 md:p-4 bg-gray-50 rounded-lg border transition-all duration-300 ${highlightedMetric() === 'metric-steering-torque' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-2 text-xs tracking-wide text-gray-500 uppercase">Steering Torque</div>
                      <div class="text-lg font-bold text-gray-700">{car()!.steering_torque || 'empty'}</div>
                    </div>
                  </div>
                </AccordionContainer>
              </div>

              {/* Right Sidebar */}
              <div class="space-y-4 w-full lg:flex-shrink-0 lg:w-72">
                {/* Metrics Navigation */}
                <AccordionContainer
                  title="Quick Navigation"
                  id="quick-nav"
                  contentClass="p-4 space-y-1 text-sm max-h-96 overflow-y-auto"
                  disableDefaultPadding={true}
                >
                    {/* Technical Parameters */}
                    <div class="mt-2 mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Technical Parameters</div>
                    <button onClick={() => scrollToMetric('metric-tire-stiffness-factor')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Tire Stiffness Factor</button>
                    <button onClick={() => scrollToMetric('metric-tire-front-stiffness')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Front Stiffness</button>
                    <button onClick={() => scrollToMetric('metric-tire-rear-stiffness')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Rear Stiffness</button>
                    <button onClick={() => scrollToMetric('metric-actuator-delay')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Actuator Delay</button>
                    <button onClick={() => scrollToMetric('metric-limit-timer')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Limit Timer</button>
                    <button onClick={() => scrollToMetric('metric-control-type')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Control Type</button>
                    <button onClick={() => scrollToMetric('metric-stopping-speed')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Stopping Speed</button>
                    <button onClick={() => scrollToMetric('metric-starting-speed')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Starting Speed</button>
                    <button onClick={() => scrollToMetric('metric-stop-accel')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Stop Accel</button>

                    {/* System Configuration */}
                    <div class="mt-4 mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">System Configuration</div>
                    <button onClick={() => scrollToMetric('metric-network-location')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Network Location</button>
                    <button onClick={() => scrollToMetric('metric-bus-lookup')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Bus Lookup</button>
                    <button onClick={() => scrollToMetric('metric-experimental-longitudinal')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Experimental Longitudinal</button>
                    <button onClick={() => scrollToMetric('metric-dsu-enabled')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">DSU Enabled</button>
                    <button onClick={() => scrollToMetric('metric-bsm-enabled')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">BSM Enabled</button>
                    <button onClick={() => scrollToMetric('metric-pcm-cruise')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">PCM Cruise</button>

                    {/* Capabilities */}
                    <div class="mt-4 mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Capabilities</div>
                    <button onClick={() => scrollToMetric('metric-min-steering-speed')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Min Steering Speed</button>
                    <button onClick={() => scrollToMetric('metric-fsr-longitudinal')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">FSR Longitudinal</button>
                    <button onClick={() => scrollToMetric('metric-fsr-steering')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">FSR Steering</button>
                    <button onClick={() => scrollToMetric('metric-longitudinal-control')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Longitudinal Control</button>
                    <button onClick={() => scrollToMetric('metric-support-type')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Support Type</button>
                    <button onClick={() => scrollToMetric('metric-auto-resume')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Auto Resume</button>
                    <button onClick={() => scrollToMetric('metric-steering-torque')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Steering Torque</button>

                    {/* Vehicle Metrics */}
                    <div class="mt-4 mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">Vehicle Metrics</div>
                    <button onClick={() => scrollToMetric('metric-curb-weight')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Curb Weight</button>
                    <button onClick={() => scrollToMetric('metric-wheelbase')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Wheelbase</button>
                    <button onClick={() => scrollToMetric('metric-steer-ratio')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Steer Ratio</button>
                    <button onClick={() => scrollToMetric('metric-center-front-ratio')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Center to Front Ratio</button>
                    <button onClick={() => scrollToMetric('metric-max-lateral-accel')} class="py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors hover:bg-gray-100 hover:border-gray-300">Max Lateral Accel</button>
                </AccordionContainer>

                {/* Vehicle Metrics */}
                <AccordionContainer
                  title="Vehicle Metrics"
                  id="vehicle-metrics"
                  contentClass="p-4 space-y-4 text-sm"
                  disableDefaultPadding={true}
                >
                    <div id="metric-curb-weight" class={`p-3 bg-gray-50 rounded border transition-all duration-300 ${highlightedMetric() === 'metric-curb-weight' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-1 text-xs tracking-wide text-gray-500 uppercase">Curb Weight</div>
                      <div class="text-base font-bold text-gray-900 md:text-lg">{Math.round(car()!.mass_curb_weight * 2.20462).toLocaleString()} lbs</div>
                    </div>
                    <div id="metric-wheelbase" class={`p-3 bg-gray-50 rounded border transition-all duration-300 ${highlightedMetric() === 'metric-wheelbase' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-1 text-xs tracking-wide text-gray-500 uppercase">Wheelbase</div>
                      <div class="text-base font-bold text-gray-900 md:text-lg">{car()!.wheelbase ? `${(car()!.wheelbase as number).toFixed(2)} m` : '2.67 m'}</div>
                    </div>
                    <div id="metric-steer-ratio" class={`p-3 bg-gray-50 rounded border transition-all duration-300 ${highlightedMetric() === 'metric-steer-ratio' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-1 text-xs tracking-wide text-gray-500 uppercase">Steer Ratio</div>
                      <div class="text-base font-bold text-gray-900 md:text-lg">{car()!.steer_ratio ? (car()!.steer_ratio as number).toFixed(1) : '18.61'}</div>
                    </div>
                    <div id="metric-center-front-ratio" class={`p-3 bg-gray-50 rounded border transition-all duration-300 ${highlightedMetric() === 'metric-center-front-ratio' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-1 text-xs tracking-wide text-gray-500 uppercase">Center to Front Ratio</div>
                      <div class="text-base font-bold text-gray-900 md:text-lg">{car()!.center_to_front_ratio ? (car()!.center_to_front_ratio as number).toFixed(2) : '0.37'}</div>
                    </div>
                    <div id="metric-max-lateral-accel" class={`p-3 bg-gray-50 rounded border transition-all duration-300 ${highlightedMetric() === 'metric-max-lateral-accel' ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
                      <div class="mb-1 text-xs tracking-wide text-gray-500 uppercase">Max Lateral Accel</div>
                      <div class="text-base font-bold text-gray-900 md:text-lg">
                        {car()!.max_lateral_accel ? `${(car()!.max_lateral_accel as number).toFixed(2)} m/s²` : '0.52 m/s²'}
                      </div>
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
