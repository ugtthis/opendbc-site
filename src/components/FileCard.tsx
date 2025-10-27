import { type Component, createSignal, createEffect } from 'solid-js'

import type { Car } from '~/types/CarDataTypes'

import GradientButton from '~/components/ui/GradientButton'
import HighlightText from '~/components/ui/HighlightText'
import { getSupportTypeColor } from '~/types/supportType'
import { cn, slugify } from '~/lib/utils'
import { useModelComparison } from '~/contexts/ModelComparisonContext'

import DownChevronSvg from '~/lib/icons/down-chevron.svg?raw'
import OpenFolderSvg from '~/lib/icons/open-folder.svg?raw'
import VideoCameraSvg from '~/lib/icons/video-camera.svg?raw'
import PlayVideoSvg from '~/lib/icons/play-video.svg?raw'
import CheckSvg from '~/lib/icons/checkmark.svg?raw'
import Checkmark2Svg from '~/lib/icons/checkmark-2.svg?raw'

const MS_TO_MPH = 2.237

const formatEngageSpeed = (speedMs: number): string => {
  return speedMs > 0 ? `${Math.round(speedMs * MS_TO_MPH)} mph` : 'any speed'
}

const getACCDescription = (longitudinal: string, minEngageSpeed: number): string => {
  const speed = formatEngageSpeed(minEngageSpeed)

  switch (longitudinal) {
    case 'openpilot':
      return `Full openpilot Adaptive Cruise Control (ACC) with automatic speed and following distance control. openpilot handles all longitudinal control including acceleration, deceleration, and maintaining safe following distances. Minimum engagement speed: ${speed}.`
    case 'openpilot available':
      return `openpilot Adaptive Cruise Control (ACC) is available as an option but requires enabling. When enabled, openpilot provides enhanced longitudinal control with automatic speed and following distance management. Minimum engagement speed: ${speed}.`
    case 'Stock':
      return `Uses the vehicle's factory Adaptive Cruise Control (ACC) system. openpilot provides steering assistance but relies on the car's built-in cruise control for speed management. Minimum engagement speed: ${speed}.`
    default:
      return `Adaptive Cruise Control (ACC) maintains a safe following distance from the vehicle ahead. Minimum engagement speed: ${speed}.`
  }
}

const getAutoResumeDescription = (autoResume: boolean): string => {
  if (autoResume) {
    return `Automatically resumes from a complete stop when traffic ahead starts moving again. This feature works with openpilot's Adaptive Cruise Control and eliminates the need to manually restart cruise control after coming to a stop in traffic.`
  } else {
    return `Does not automatically resume from a complete stop. When traffic stops, you'll need to manually press the accelerator or cruise control button to resume after the vehicle ahead starts moving again.`
  }
}

type CardProps = {
  car: Car
  searchQuery: string
  compareMode?: boolean
}

type InfoBoxProps = {
  label: string
  value: string
  class?: string
}

const InfoBox = (props: InfoBoxProps) => {
  return (
    <div class={cn('flex flex-col justify-center py-4 px-4 border border-black bg-surface min-h-[80px]', props.class)}>
      <div class="text-sm font-medium">{props.label}</div>
      <div class="mt-1 text-lg font-semibold">{props.value}</div>
    </div>
  )
}

type ExpandableRowProps = {
  label: string
  value: string
  description: string
  class?: string
  icon?: string
  isExpanded: boolean
  onToggle: () => void
}

const ExpandableRow = (props: ExpandableRowProps) => {
  const [isScrolledToBottom, setIsScrolledToBottom] = createSignal(false)
  let scrollRef: HTMLDivElement | undefined

  const resetScrollOnOpen = () => {
    if (props.isExpanded && scrollRef) {
      scrollRef.scrollTop = 0
      setIsScrolledToBottom(false)
    }
  }

  createEffect(resetScrollOnOpen)

  const handleScroll = (e: Event) => {
    const target = e.target as HTMLDivElement
    const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 1
    setIsScrolledToBottom(isAtBottom)
  }

  return (
    <div class={cn('border border-black bg-surface', props.class)}>
      {/* Toggle header */}
      <div
        class="flex justify-between items-center py-4 px-4 transition-colors duration-200 cursor-pointer hover:text-white hover:bg-accent"
        onClick={props.onToggle}
      >
        <div class="text-sm font-medium">{props.label}</div>
        <div class="flex gap-3 items-center">
          {props.icon ? (
            <div class="w-5 h-5" innerHTML={props.icon} />
          ) : (
            <div class="text-sm font-semibold">{props.value}</div>
          )}
          <div
            class={`w-2 h-2 transition-transform duration-200 ${props.isExpanded ? 'rotate-180' : ''}`}
            innerHTML={DownChevronSvg}
          />
        </div>
      </div>

      {/* Expandable description */}
      <div class={`overflow-hidden transition-all duration-300 ${props.isExpanded ? 'max-h-20' : 'max-h-0'}`}>
        <div class="relative">
          <div
            ref={scrollRef}
            class="overflow-y-auto py-3 px-4 text-sm text-black h-row-height bg-surface-secondary"
            onScroll={handleScroll}
          >
            {props.description}
          </div>
          {/* Scroll gradient indicator */}
          <div class={`absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/50 to-transparent pointer-events-none transition-opacity duration-200 ${isScrolledToBottom() ? 'opacity-0' : 'opacity-100'}`} />
        </div>
      </div>
    </div>
  )
}

const Card: Component<CardProps> = (props) => {
  const [expandedRow, setExpandedRow] = createSignal<string | null>(null)
  const { selectedCars, toggleCarSelection } = useModelComparison()

  const resumeRowProps = {
    label: "Resume from stop",
    value: "NA",
    icon: props.car.auto_resume ? CheckSvg : undefined,
    description: getAutoResumeDescription(props.car.auto_resume),
    class: "border-2 border-border-soft"
  }

  const accRowProps = {
    label: "ACC",
    value: props.car.longitudinal as string || "Stock",
    description: getACCDescription(props.car.longitudinal as string || "Stock", props.car.min_enable_speed),
    class: "border-2 border-border-soft"
  }

  const steeringRowProps = {
    label: "Steering Ratio",
    value: props.car.steer_ratio.toFixed(2),
    description: "The steering ratio is the relationship between steering wheel rotation and front wheel angle. A lower ratio means more responsive steering - less steering wheel input needed for the same wheel movement.",
    class: "border-2 border-border-soft"
  }

  const toggleRow = (rowId: string) => {
    setExpandedRow(expandedRow() === rowId ? null : rowId)
  }

  const supportLabelClass = cn(
    'py-1 px-6 inline-block border border-black border-b-0 text-center',
    getSupportTypeColor(props.car.support_type),
  )

  return (
    <>
      {/* Thin card for compare mode */}
      {props.compareMode ? (
        <div class="flex w-full border border-black bg-surface shadow-elev-1">
          {/* Checkbox */}
          <div class="flex justify-center items-center px-2 md:px-3">
            <label class="inline-block relative cursor-pointer select-none size-7">
              <input
                type="checkbox"
                checked={selectedCars().includes(props.car.name)}
                onChange={() => toggleCarSelection(props.car.name)}
                disabled={!selectedCars().includes(props.car.name) && selectedCars().length >= 6}
                class="relative appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed size-7 border-3 border-black/70 peer checked:bg-[#2e5232] checked:border-[#102f0c] checked:shadow-elev-1 hover:bg-[#2e5232]"
                aria-label={`Select ${props.car.make} ${props.car.model}`}
              />
              <div class="absolute inset-0 opacity-0 transition-opacity duration-75 pointer-events-none peer-checked:opacity-100">
                <div class="flex justify-center items-center size-7 text-[#65e063]" innerHTML={Checkmark2Svg} />
              </div>
            </label>
          </div>

          {/* Mobile wrapper - stacks vertically below 370px, horizontal at 370px+ */}
          <div class="flex flex-col flex-1 border-r border-l border-black md:hidden min-[370px]:flex-row">
            {/* Year and Model - Mobile only */}
            <div class="flex flex-1 items-center py-2.5 px-2 border-b border-black min-[370px]:border-b-0 min-[370px]:border-r">
              <h1 class="text-xs font-semibold leading-tight">
                <HighlightText text={props.car.years} query={props.searchQuery} yearList={props.car.year_list as string[]} />
                {' '}
                <HighlightText text={`${props.car.make} ${props.car.model}`} query={props.searchQuery} />
              </h1>
            </div>

            {/* Support type - Mobile only */}
            <div class={cn(
              'flex items-center justify-center py-1.5 min-[370px]:py-2.5 px-2 w-full min-[370px]:w-[100px] text-center',
              getSupportTypeColor(props.car.support_type),
            )}>
              <span class="text-xs font-semibold leading-tight uppercase">
                <HighlightText text={props.car.support_type} query={props.searchQuery} />
              </span>
            </div>
          </div>

          {/* Year - Desktop only */}
          <div class="hidden items-center py-2.5 px-3 border-r border-l border-black md:flex w-[110px]">
            <h2 class="text-base font-medium leading-tight">
              <HighlightText text={props.car.years} query={props.searchQuery} yearList={props.car.year_list as string[]} />
            </h2>
          </div>

          {/* Model name - Desktop only */}
          <div class="hidden flex-1 items-center py-2.5 px-3 border-r border-black md:flex">
            <h1 class="text-lg font-semibold">
              <HighlightText text={`${props.car.make} ${props.car.model}`} query={props.searchQuery} />
            </h1>
          </div>

          {/* Support type - Desktop only */}
          <div class={cn(
            'hidden md:flex items-center justify-center py-2.5 px-3 w-[160px] text-center border-r border-black',
            getSupportTypeColor(props.car.support_type),
          )}>
            <span class="text-sm font-semibold leading-tight uppercase whitespace-nowrap">
              <HighlightText text={props.car.support_type} query={props.searchQuery} />
            </span>
          </div>

          {/* Arrow button to detailed page */}
          <a
            href={`/cars/${slugify(props.car.name)}`}
            class="flex justify-center items-center py-2.5 px-3 transition-colors md:px-4 bg-accent min-w-[48px] hover:bg-[#727272] hover:shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]"
            title="View details"
          >
            <div class="w-5 h-5 text-white md:w-6 md:h-6" innerHTML={OpenFolderSvg} />
          </a>
        </div>
      ) : (
        // Regular card (non-compare mode)
        <>
          {/* Support label */}
      <div class={supportLabelClass}>
        <p class="uppercase text-[16px]">
          <HighlightText text={props.car.support_type} query={props.searchQuery} />
        </p>
      </div>

      {/* Card body */}
      <div class="flex flex-col border border-black bg-surface shadow-elev-1 min-h-[180px]">
        <div class="flex-grow">
          {/* Year and Model */}
          <div class="flex border-b border-black">
            <div class="flex items-center py-2.5 px-2 border-r border-black">
              <h2 class="text-lg">
                <HighlightText text={props.car.years} query={props.searchQuery} yearList={props.car.year_list as string[]} />
              </h2>
            </div>
            <div class="flex flex-1 justify-between items-center py-2.5 px-3 min-h-[60px]">
              <h1 class="flex-1 pr-3 text-xl font-semibold">
                <HighlightText text={`${props.car.make} ${props.car.model}`} query={props.searchQuery} />
              </h1>
              <div class={`flex-shrink-0 ml-2 ${!props.car.video ? 'invisible' : ''}`}>
                <a
                  href={props.car.video || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  class={`
                    flex items-center p-2 text-white transition-all duration-300 cursor-pointer
                    hover:bg-red-600 hover:shadow-xl group bg-accent
                  `}
                >
                  <div class="block w-5 h-5 transition-opacity duration-200 group-hover:hidden" innerHTML={VideoCameraSvg} />
                  <div class="hidden w-5 h-5 transition-opacity duration-200 group-hover:block" innerHTML={PlayVideoSvg} />
                </a>
              </div>
            </div>
          </div>

          <div class="py-2.5 px-2 border-b border-black min-h-[60px]">
            <p class="font-sans text-sm">
              <strong>ADAS Package:</strong> <HighlightText text={props.car.package} query={props.searchQuery} />
            </p>
          </div>
          <div class="flex p-3 border-b border-black @container">
            <div class="flex flex-1 items-center min-w-0">
              <p class="leading-tight text-md">
                <strong>
                  Minimum<br/>
                  <span>Engage <span class="@max-xs:block">Speed</span></span>
                </strong>
              </p>
            </div>
            <div class="flex flex-col gap-2 flex-[1.618]">
              <div class="flex flex-col flex-1 justify-center py-1 px-2 bg-white border border-black">
                <p class="text-sm">
                  <strong>ALC:</strong> {formatEngageSpeed(props.car.min_steer_speed)}
                </p>
                <p class="text-xs text-gray-500">Automated Lane Centering</p>
              </div>
              <div class="flex flex-col flex-1 justify-center py-1 px-2 bg-white border border-black">
                <p class="text-sm">
                  <strong>ACC:</strong> {formatEngageSpeed(props.car.min_enable_speed)}
                </p>
                <p class="text-xs text-gray-500">Adaptive Cruise Control</p>
              </div>
            </div>
          </div>

          <div class="h-6" />
          {/* spacer for future drivetrain label */}
        </div>

        <input type="checkbox" id={`toggle-${props.car.name}`} class="hidden peer" />

        {/* Expanded Card Body */}
        <div class="overflow-hidden max-h-0 transition-all duration-300 bg-surface-secondary peer-checked:max-h-card-height peer-checked:border-t peer-checked:border-black">
          <div class="p-4">
            <div class="flex flex-col gap-2">
              {/* Row 1 */}
              <ExpandableRow
                {...resumeRowProps}
                isExpanded={expandedRow() === "resume"}
                onToggle={() => toggleRow("resume")}
              />

              {/* Two info boxes side by side */}
              <div class="flex gap-2">
                <InfoBox
                  label="curb weight"
                  value={`${Math.round(props.car.mass_curb_weight).toLocaleString()}lb`}
                  class="flex-1 border-2 border-border-soft"
                />
                <InfoBox
                  label="Install video"
                  value="NA"
                  class="flex-1 border-2 border-border-soft"
                />
              </div>

              {/* Row 2 */}
              <ExpandableRow
                {...accRowProps}
                isExpanded={expandedRow() === "acc"}
                onToggle={() => toggleRow("acc")}
              />

              {/* Row 3 */}
              <ExpandableRow
                {...steeringRowProps}
                isExpanded={expandedRow() === "steering"}
                onToggle={() => toggleRow("steering")}
              />
            </div>

            {/* Gradient Button */}
            <div class="mt-4">
              <GradientButton href={`/cars/${slugify(props.car.name)}`}>
                <div
                  class={`
                    text-black transition-all duration-200 ease-in w-[28px] h-[24px]
                    translate-y-[-1px] group-hover:translate-x-[2px] group-hover:text-surface
                  `}
                  innerHTML={OpenFolderSvg}
                />
              </GradientButton>
            </div>
          </div>
        </div>

        {/* Chevron button */}
        <label
          for={`toggle-${props.car.name}`}
          class={`
            flex justify-center py-1 border-t border-black cursor-pointer
            bg-accent peer-checked:bg-surface-secondary peer-checked:[&>div]:rotate-180
            max-md:bg-[#727272] max-md:shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]
            peer-checked:max-md:shadow-none
            hover:bg-[#727272] hover:duration-300
            hover:shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]
          `}
        >
          <div class="w-5 h-5" innerHTML={DownChevronSvg} />
        </label>
      </div>
        </>
      )}
    </>
  )
}

export default Card
