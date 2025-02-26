import { createSignal, onMount, onCleanup, For } from 'solid-js';
import { isServer } from 'solid-js/web';
import carData from '../data/car_data.json';
import type { Car } from '../types/CarDataTypes';

export const [isOpen, setIsOpen] = createSignal(false);
export const toggleSidebar = () => setIsOpen(!isOpen());

export const [filters, setFilters] = createSignal({
  supportLevel: '',
  make: '',
  model: '',
  year: ''
});

export type SortField = keyof Pick<Car, 'make' | 'model' | 'support_type' | 'year_list'>;

export const [sortConfig, setSortConfig] = createSignal({
  field: 'make' as SortField,
  order: 'ASC' as 'ASC' | 'DESC'
});

const supportLevels = [
  'Upstream',
  'Under review',
  'Community',
  'Dashcam mode',
  'Not compatible'
];

// Extract unique makes, models, and years from car data
const makes = [...new Set(carData.map(car => car.make))].sort();
const models = [...new Set(carData.map(car => car.model))].sort();
const years = [...new Set(carData.flatMap(car => car.year_list))].sort();

type FilterKeys = 'supportLevel' | 'make' | 'model' | 'year';

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

  const handleSortChange = (field: SortField) => {
    setSortConfig(prev => ({ ...prev, field }));
  };

  const handleSortOrderChange = (order: 'ASC' | 'DESC') => {
    setSortConfig(prev => ({ ...prev, order }));
  };

  const handleFilterChange = (key: FilterKeys, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

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
        class="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100"
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
            <select 
              class="appearance-none border border-black p-4 w-full pr-10"
              value={sortConfig().field}
              onChange={(e) => handleSortChange(e.currentTarget.value as SortField)}
            >
              <option value="make">Make</option>
              <option value="model">Model</option>
              <option value="year_list">Year</option>
              <option value="support_type">Support Level</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div class="relative w-1/2">
            <select 
              class="appearance-none border border-black p-4 w-full pr-10"
              value={sortConfig().order}
              onChange={(e) => handleSortOrderChange(e.currentTarget.value as 'ASC' | 'DESC')}
            >
              <option value="ASC">ASC</option>
              <option value="DESC">DESC</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 9l-7 7-7-7" />
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
          {/* Support Level Filter */}
          <div>
            <span class="block mb-2">Support Level</span>
            <div class="border border-black relative">
              <select 
                class="w-full p-4 bg-transparent appearance-none pr-10"
                value={filters().supportLevel}
                onChange={(e) => handleFilterChange('supportLevel', e.currentTarget.value)}
              >
                <option value="">All</option>
                <For each={supportLevels}>
                  {level => <option value={level}>{level}</option>}
                </For>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Make Filter */}
          <div>
            <span class="block mb-2">Make</span>
            <div class="border border-black relative">
              <select 
                class="w-full p-4 bg-transparent appearance-none pr-10"
                value={filters().make}
                onChange={(e) => handleFilterChange('make', e.currentTarget.value)}
              >
                <option value="">All</option>
                <For each={makes}>
                  {make => <option value={make}>{make}</option>}
                </For>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Model Filter */}
          <div>
            <span class="block mb-2">Model</span>
            <div class="border border-black relative">
              <select 
                class="w-full p-4 bg-transparent appearance-none pr-10"
                value={filters().model}
                onChange={(e) => handleFilterChange('model', e.currentTarget.value)}
              >
                <option value="">All</option>
                <For each={models}>
                  {model => <option value={model}>{model}</option>}
                </For>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <span class="block mb-2">Year</span>
            <div class="border border-black relative">
              <select 
                class="w-full p-4 bg-transparent appearance-none pr-10"
                value={filters().year}
                onChange={(e) => handleFilterChange('year', e.currentTarget.value)}
              >
                <option value="">All</option>
                <For each={years}>
                  {year => <option value={year}>{year}</option>}
                </For>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 