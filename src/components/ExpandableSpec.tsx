import { Show, type JSX } from 'solid-js';
import { useQuickNavScrollTarget, HIGHLIGHT_STYLES as QuickNavColors } from './QuickNavHighlight';

interface ExpandableSpecProps {
  label: string;
  value?: string | number | null;
  description: string;
  isEven?: boolean;
  isOpen?: boolean;
  onToggle: () => void;
  layout?: 'vertical';
  children?: JSX.Element;
}

export default function ExpandableSpec(props: ExpandableSpecProps) {
  const quickNavTarget = useQuickNavScrollTarget()
  const isVertical = props.layout === 'vertical'

  const bg = () => {
    if (quickNavTarget.isActive()) return QuickNavColors.bg
    if (props.isOpen) return 'bg-amber-50'
    if (props.isEven) return 'bg-gray-50'
    return ''
  }

  const hover = () => quickNavTarget.isActive() ? '' : 'hover:bg-amber-50'

  const border = () => {
    if (!quickNavTarget.isActive()) return ''
    return `${QuickNavColors.border} ${QuickNavColors.transition}`
  }

  return (
    <div>
      <div
        class={`flex px-3 py-3 min-h-[48px] cursor-pointer ${hover()} ${bg()} ${border()} ${
          isVertical ? 'flex-col' : 'justify-between items-center'
        }`}
        onClick={props.onToggle}
      >
        <span class={`text-xs ${
          isVertical ? 'mb-1' : 'flex-1 pr-2 min-w-0'
        } ${
          props.isOpen ? 'text-amber-600 font-medium' : ''
        }`}>
          {props.label}
        </span>
        {props.children || (
          <span class={`text-xs ${
            isVertical ? 'break-words' : 'whitespace-nowrap shrink-0'
          }`}>
            {props.value ?? 'N/A'}
          </span>
        )}
      </div>

      <Show when={props.isOpen}>
        <div class={`px-3 pt-1 pb-3 border-l-4 ${
          quickNavTarget.isActive()
            ? `${QuickNavColors.bg} ${QuickNavColors.borderColor}`
            : 'bg-amber-50 border-amber-400'
        }`}>
          <p class="text-xs leading-relaxed text-gray-600">{props.description}</p>
        </div>
      </Show>
    </div>
  )
}
