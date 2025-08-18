import { type Component, type ParentProps } from 'solid-js'

import type { Car } from '~/types/CarDataTypes'

import GradientButton from '~/components/ui/GradientButton'
import HighlightText from '~/components/ui/HighlightText'
import { getSupportTypeColor } from '~/types/supportType'
import { cn } from '~/lib/utils'

const MS_TO_MPH = 2.237

const formatEngageSpeed = (speedMs: number): string => {
  return speedMs >= 0 ? `${Math.round(speedMs * MS_TO_MPH)} mph` : 'any speed'
}

import DownChevronSvg from '~/lib/icons/down-chevron.svg?raw'
import OpenFolderSvg from '~/lib/icons/open-folder.svg?raw'
import VideoCameraSvg from '~/lib/icons/video-camera.svg?raw'
import PlayVideoSvg from '~/lib/icons/play-video.svg?raw'

type CardProps = {
  car: Car
  searchQuery: string
}

type StatBoxProps = ParentProps<{
  class?: string
  label: string
}>

const StatBox = (props: StatBoxProps) => {
  return (
    <div class={cn('flex flex-col py-3 px-4 border border-black bg-[#F3F3F3] min-h-[80px] shadow-elev-1', props.class)}>
      <span class={'font-medium text-md'}>{props.label}</span>
      <div class={'mt-2 text-xs md:text-sm'}>{props.children}</div>
    </div>
  )
}

const Card: Component<CardProps> = (props) => {
  const supportLabelClass = cn(
    'py-1 px-6 inline-block border border-black border-b-0 text-center',
    getSupportTypeColor(props.car.support_type),
  )

  return (
    <>
      {/* Support label */}
      <div class={supportLabelClass}>
        <p class="uppercase text-[16px]">
          <HighlightText text={props.car.support_type} query={props.searchQuery} />
        </p>
      </div>

      {/* Card body */}
      <div class="flex flex-col border border-black bg-[#F3F3F3] shadow-elev-1 min-h-[180px]">
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
                    hover:bg-red-600 hover:shadow-xl group bg-[#969696]
                  `}
                >
                  <div class="block w-5 h-5 transition-opacity duration-200 group-hover:hidden" innerHTML={VideoCameraSvg} />
                  <div class="hidden w-5 h-5 transition-opacity duration-200 group-hover:block" innerHTML={PlayVideoSvg} />
                </a>
              </div>
            </div>
          </div>

          <div class="py-2.5 px-2 border-b border-black h-[60px]">
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
        <div class="overflow-hidden max-h-0 bg-[#D9D9D9] peer-checked:max-h-[400px] peer-checked:border-t peer-checked:border-black">
          <div class="grid grid-cols-2 gap-4 p-4">
            <StatBox label="Curb Weight">{Math.round(props.car.mass_curb_weight).toLocaleString()} kg</StatBox>
            <StatBox label="Harness">{props.car.harness ? props.car.harness : 'N/A'}</StatBox>
            <StatBox label="Auto Resume">{props.car.auto_resume ? 'Yes' : 'No'}</StatBox>
            <StatBox label="Steer Ratio">~{Number(props.car.steer_ratio).toFixed(2)}</StatBox>
          </div>
          <div class="px-4 pb-4">
            {/* Open model details button */}
            <GradientButton href={`/cars/${props.car.name.replace(/\s+/g, '-')}`}>
              <div
                class={`
                  text-black transition-all duration-200 ease-in w-[28px] h-[24px]
                  translate-y-[-1px] group-hover:translate-x-[2px] group-hover:text-[#F3F3F3]
                `}
                innerHTML={OpenFolderSvg}
              />
            </GradientButton>
          </div>
        </div>

        {/* Chevron button */}
        <label
          for={`toggle-${props.car.name}`}
          class={`
            flex justify-center py-1 border-t border-black cursor-pointer
            bg-[#969696] peer-checked:bg-[#D9D9D9] peer-checked:[&>div]:rotate-180
          `}
        >
          <div class="w-5 h-5" innerHTML={DownChevronSvg} />
        </label>
      </div>
    </>
  )
}

export default Card
