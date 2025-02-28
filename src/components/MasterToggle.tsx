import { type Component } from 'solid-js';
import { expandedCards, toggleAllCards } from '../store/toggleStore';

const MasterToggle: Component = () => {
  return (
    <button
      type="button"
      onClick={toggleAllCards}
      class="w-14 flex items-stretch justify-center bg-[#4A4A4A] hover:bg-[#3A3A3A] transition-colors flex-shrink-0"
      aria-label="Toggle all sections"
    >
      <span 
        class="transform transition-transform duration-300 flex items-center justify-center w-full"
        style={{ transform: expandedCards().size > 0 ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          class="w-8 h-8"
          fill="none"
          stroke-width="2"
        >
          <path d="M7 13l5 5 5-5" stroke="#969696"/>
          <path d="M7 6l5 5 5-5" stroke="white"/>
        </svg>
      </span>
    </button>
  );
};

export default MasterToggle; 