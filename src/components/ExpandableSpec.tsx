import { Show, type JSX } from 'solid-js';

interface ExpandableSpecProps {
  label: string;
  value?: string | number;
  description: string;
  isEven?: boolean;
  isOpen?: boolean;
  onToggle: () => void;
  layout?: 'horizontal' | 'vertical';
  children?: JSX.Element;
}

export default function ExpandableSpec(props: ExpandableSpecProps) {
  const isVertical = () => props.layout === 'vertical';

  return (
    <div>
      <div
        class={`flex px-3 py-3 min-h-[48px] cursor-pointer hover:bg-amber-50 transition-colors ${
          isVertical() ? 'flex-col' : 'justify-between items-center'
        } ${
          props.isOpen ? 'bg-amber-50' : props.isEven ? 'bg-gray-50' : ''
        }`}
        onClick={props.onToggle}
      >
        <span class={`text-xs ${
          isVertical() ? 'mb-1' : 'flex-1 pr-2 min-w-0'
        } ${
          props.isOpen ? 'text-amber-600 font-medium' : ''
        }`}>
          {props.label}
        </span>
        {props.children || (
          <span class={`text-xs ${
            isVertical() ? 'whitespace-pre-line break-words' : 'whitespace-nowrap shrink-0'
          }`}>
            {props.value}
          </span>
        )}
      </div>

      <Show when={props.isOpen}>
        <div class="px-3 pt-1 pb-3 bg-amber-50 border-l-4 border-amber-400">
          <p class="text-xs leading-relaxed text-gray-600">{props.description}</p>
        </div>
      </Show>
    </div>
  );
}
