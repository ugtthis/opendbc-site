import { type Component, For, Show } from 'solid-js'
import AccordionContainer from '~/components/AccordionContainer'
import LinkNewWindowSvg from '~/lib/icons/link-new-window.svg?raw'
import DownChevronSvg from '~/lib/icons/down-chevron.svg?raw'
import { cn } from '~/lib/utils'
import { openReportModal, type ReportData } from '~/contexts/ReportModalContext'

type ManeuverReportSectionProps = {
  title: string
  id: string
  learnMoreReadmeUrl: string
  reports: () => ReportData[]
  rowModalTitle?: string
  compare?: {
    show: () => boolean
    onClick: () => void
  }
}

const ReportRow: Component<ReportData & { modalTitle?: string }> = (props) => (
  <button
    onClick={() =>
      openReportModal({ description: props.description, link: props.link }, props.modalTitle)
    }
    class={cn(
      'flex items-center justify-between gap-3 w-full py-4 pl-5 pr-5 text-left text-xs',
      'border-b border-gray-200 transition-colors cursor-pointer hover:bg-amber-50',
    )}
  >
    <div>{props.description}</div>
    <div class="h-3 w-3 flex-shrink-0 -rotate-90" innerHTML={DownChevronSvg} />
  </button>
)

const ManeuverReportSection: Component<ManeuverReportSectionProps> = (props) => (
  <AccordionContainer
    title={props.title}
    id={props.id}
    disableDefaultPadding={true}
  >
    <Show
      when={props.reports().length > 0}
      fallback={
        <div class="px-5 pb-10 pt-6 space-y-6">
          <p class="text-sm text-gray-700">
            No report available - click "Learn more" to find out how to create one.
          </p>
          <div class="flex flex-col gap-3">
            <a
              href={props.learnMoreReadmeUrl}
              target="_blank"
              rel="noopener noreferrer"
              class={cn(
                'flex items-center justify-between py-3 px-4',
                'border-2 border-black bg-accent text-white text-sm font-medium',
                'transition-colors cursor-pointer hover:bg-[#727272]',
              )}
            >
              <span>Learn more</span>
              <div class="h-5 w-5 flex-shrink-0 ml-4" innerHTML={LinkNewWindowSvg} />
            </a>
            <a
              href="https://commaai.github.io/opendbc-data/"
              target="_blank"
              rel="noopener noreferrer"
              class={cn(
                'flex items-center justify-between py-3 px-4',
                'border-2 border-black bg-white text-black text-sm font-medium',
                'transition-colors cursor-pointer hover:bg-gray-100',
              )}
            >
              <span>View reports from other models</span>
              <div class="h-5 w-5 flex-shrink-0 ml-4" innerHTML={LinkNewWindowSvg} />
            </a>
          </div>
        </div>
      }
    >
      <For each={props.reports()}>
        {(report) => (
          <ReportRow
            description={report.description}
            link={report.link}
            modalTitle={props.rowModalTitle}
          />
        )}
      </For>

      <Show when={props.compare?.show()}>
        <button
          type="button"
          onClick={() => props.compare?.onClick()}
          class={cn(
            'flex items-center justify-center gap-2 w-full border-t border-gray-200',
            'px-3 py-2 text-xs text-black transition-all duration-200 cursor-pointer',
            'hover:bg-amber-50',
          )}
        >
          <span class="tracking-wide uppercase">Compare reports</span>
        </button>
      </Show>

      <a
        href="https://commaai.github.io/opendbc-data/"
        target="_blank"
        rel="noopener noreferrer"
        class={cn(
          'flex items-center justify-center gap-2 border-t border-black bg-gray-100',
          'px-3 py-2 text-xs text-black transition-all duration-200 cursor-pointer',
          'hover:bg-gray-400 hover:text-white hover:shadow-[inset_0_0_20px_rgba(0,0,0,0.7)]',
        )}
      >
        <span class="tracking-wide uppercase">Explore other car reports</span>
        <div
          class="h-3.5 w-3.5 ml-0.5 mb-0.5"
          innerHTML={LinkNewWindowSvg}
        />
      </a>
    </Show>
  </AccordionContainer>
)

export default ManeuverReportSection
