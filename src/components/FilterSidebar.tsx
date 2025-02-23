import { createSignal, onMount, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';

type FilterSection = {
  title: string;
  options: string[];
};

const filterSections: FilterSection[] = [
  { title: 'Support Level', options: [] },
  { title: 'Transmission', options: [] },
  { title: 'Make', options: [] },
  { title: 'Model', options: [] },
  { title: 'Year', options: [] },
  { title: 'Car Type', options: [] },
  { title: 'Drive Train', options: [] }
];

// Move the signal outside the component
export const [isOpen, setIsOpen] = createSignal(false);
export const toggleSidebar = () => setIsOpen(!isOpen());

export default function FilterSidebar() {
  // Function to check screen size and set isOpen accordingly
  const handleMediaQuery = () => {
    if (window.matchMedia('(min-width: 1536px)').matches) { // 2xl breakpoint
      setIsOpen(true);
    }
  };

  // On mount, run our media query check and attach a resize listener
  onMount(() => {
    if (!isServer) {
      handleMediaQuery();
      window.addEventListener('resize', handleMediaQuery);
    }
  });

  // Clean up the event listener on unmount
  onCleanup(() => {
    if (!isServer) {
      window.removeEventListener('resize', handleMediaQuery);
    }
  });

  return (
    <div
      id="sidebar"
      class={`fixed left-0 top-[99px] h-[calc(100vh-99px)] bg-[#FBFBFB] shadow-m shadow-gray-400 
          w-full md:w-[380px] p-9 border-r-4 border-white z-50 overflow-y-auto
          2xl:translate-x-0
          ${isOpen() ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Close button (hidden on large screens) */}
      <button
        class="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        onClick={() => setIsOpen(false)}
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Sort By */}
      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-4">SORT BY:</h2>
        <div class="flex gap-2">
          <div class="relative w-1/2">
            <select class="appearance-none border border-black p-4 w-full pr-10">
              <option>Make</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          <div class="relative w-1/2">
            <select class="appearance-none border border-black p-4 w-full pr-10">
              <option>ASC</option>
              <option>DESC</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full h-[1px] bg-gray-200 my-4" />

      {/* Filter By */}
      <div>
        <h2 class="text-lg font-semibold mb-4">FILTER BY:</h2>
        <div class="space-y-3">
          {filterSections.map((section) => (
            <div>
              <button class="w-full flex items-center justify-between border border-black p-4 hover:bg-gray-50">
                <span>{section.title}</span>
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 