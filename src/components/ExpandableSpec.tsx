import { Show, type JSX } from 'solid-js';
import { useQuickNavScrollTarget, HIGHLIGHT_STYLES as QuickNavColors } from './QuickNavHighlight';
import { cn } from '~/lib/utils';

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
        class={cn(
          'flex min-h-[48px] px-3 py-3 cursor-pointer',
          isVertical ? 'flex-col' : 'items-center justify-between',
          hover(),
          bg(),
          border(),
        )}
        onClick={props.onToggle}
      >
        <span class={cn(
          'text-xs',
          isVertical ? 'mb-1' : 'min-w-0 flex-1 pr-2',
          props.isOpen && 'font-medium text-amber-600',
        )}>
          {props.label}
        </span>
        {props.children || (
          <span class={cn(
            'text-xs',
            isVertical ? 'break-words' : 'shrink-0 whitespace-nowrap',
          )}>
            {props.value ?? 'N/A'}
          </span>
        )}
      </div>

      <Show when={props.isOpen}>
        <div class={cn(
          'border-l-4 px-3 pt-1 pb-3',
          quickNavTarget.isActive()
            ? `${QuickNavColors.bg} ${QuickNavColors.borderColor}`
            : 'border-amber-400 bg-amber-50',
        )}>
          <p class="text-xs leading-relaxed text-gray-600">{props.description}</p>
        </div>
      </Show>
    </div>
  )
}
