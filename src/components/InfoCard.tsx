import { onMount, onCleanup, type Component, createEffect } from 'solid-js';
import { initializeCard, isCardExpanded, toggleCard } from '../store/toggleStore';

interface InfoCardProps {
  label: string;
  defaultExpanded?: boolean;
  class?: string;
  children?: any;
  id?: string;
}

const InfoCard: Component<InfoCardProps> = (props) => {
  const cardId = props.id || props.label.toLowerCase().replace(/\s+/g, '-');
  let contentRef: HTMLDivElement | undefined;

  onMount(() => {
    if (!contentRef) return;
    initializeCard(cardId, props.defaultExpanded ?? true);
    updateHeight();
  });

  createEffect(() => {
    const expanded = isCardExpanded(cardId);
    if (contentRef) {
      updateHeight();
    }
  });

  const updateHeight = () => {
    if (!contentRef) return;
    
    if (isCardExpanded(cardId)) {
      contentRef.style.height = 'auto';
      const height = contentRef.scrollHeight;
      contentRef.style.height = `${height}px`;
    } else {
      contentRef.style.height = '0';
    }
  };

  return (
    <div class={`flex flex-col w-full mb-6 ${props.class || ''}`} data-info-card id={cardId}>
      <div class="flex items-stretch">
        <div class="bg-neutral-900 text-white border-r-4 border-gray-700 px-4 py-2 flex-grow flex items-center">
          <h2 class="text-md">{props.label}</h2>
        </div>
        <button
          type="button"
          class="w-10 h-10 flex items-center justify-center bg-[#969696] hover:bg-gray-300 transition-colors flex-shrink-0"
          onClick={() => toggleCard(cardId)}
          aria-expanded={isCardExpanded(cardId)}
        >
          <span 
            class="transform transition-transform duration-300"
            style={{ transform: isCardExpanded(cardId) ? 'rotate(0deg)' : 'rotate(180deg)' }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
        </button>
      </div>
      <div
        ref={contentRef}
        class="bg-white overflow-hidden transition-all duration-300"
      >
        {props.children}
      </div>
    </div>
  );
};

export default InfoCard; 