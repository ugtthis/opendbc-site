import { Show } from 'solid-js';

interface ExpandableDetailProps {
  label: string;
  value: string | number;
  description?: string;
  isEven?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export default function ExpandableDetail(props: ExpandableDetailProps) {
  const toggleDescription = () => {
    if (props.description && props.onToggle) {
      props.onToggle();
    }
  };

  return (
    <>
      <div 
        class={`flex justify-between items-center px-4 py-3 border-t border-gray-200 first:border-t-0 min-h-[48px] ${
          props.isOpen ? 'bg-amber-50' : props.isEven ? 'bg-gray-50' : ''
        } ${
          props.description ? 'cursor-pointer hover:bg-amber-50 transition-colors' : ''
        }`}
        onClick={toggleDescription}
      >
        <span class={`text-xs sm:text-sm font-medium flex-1 pr-2 ${
          props.isOpen ? 'text-amber-600' : ''
        }`}>
          {props.label}
        </span>
        <span class="text-xs sm:text-sm font-mono shrink-0">{props.value}</span>
      </div>
      <Show when={props.description && props.isOpen} fallback={null}>
        <div class="px-4 pt-1 pb-3 bg-amber-50 border-l-4 border-amber-400 overflow-hidden">
          <p class="text-xs text-gray-600 leading-relaxed">{props.description}</p>
        </div>
      </Show>
    </>
  );
} 