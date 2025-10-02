import { Show } from 'solid-js';

interface ExpandableSpecProps {
  label: string;
  value: string | number;
  description: string;
  isEven?: boolean;
  isOpen?: boolean;
  onToggle: () => void;
}

export default function ExpandableSpec(props: ExpandableSpecProps) {
  return (
    <>
      <div
        class={`flex justify-between items-center px-4 py-3 border-t border-gray-200 first:border-t-0 min-h-[48px]
                cursor-pointer hover:bg-amber-50 transition-colors ${
          props.isOpen ? 'bg-amber-50' : props.isEven ? 'bg-gray-50' : ''
        }`}
        onClick={props.onToggle}
      >
        <span class={`text-xs sm:text-sm font-medium flex-1 pr-2 ${
          props.isOpen ? 'text-amber-600' : ''
        }`}>
          {props.label}
        </span>
        <span class="font-mono text-xs sm:text-sm shrink-0">{props.value}</span>
      </div>

      <Show when={props.isOpen}>
        <div class="overflow-hidden px-4 pt-1 pb-3 bg-amber-50 border-l-4 border-amber-400">
          <p class="text-xs leading-relaxed text-gray-600">{props.description}</p>
        </div>
      </Show>
    </>
  );
}
