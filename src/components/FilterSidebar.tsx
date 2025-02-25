import { createSignal, onMount, onCleanup, For } from 'solid-js';
import { isServer } from 'solid-js/web';
import carData from '../data/car_data.json';
import type { Car } from '../types/CarDataTypes';

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

// Filter state
export const [filters, setFilters] = createSignal({
  supportLevel: '',
  make: '',
  model: '',
  year: ''
});

// Search query state
export const [searchQueries, setSearchQueries] = createSignal({
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

// Support level options
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

  const handleSearchChange = (key: FilterKeys, value: string) => {
    setSearchQueries(prev => ({ ...prev, [key]: value }));
    
    // Filter the options based on search
    const filteredValue = value.toLowerCase();
    let matchingValue = '';
    
    switch(key) {
      case 'supportLevel':
        matchingValue = supportLevels.find(level => 
          level.toLowerCase().includes(filteredValue)
        ) || '';
        break;
      case 'make':
        matchingValue = makes.find(make => 
          make.toLowerCase().includes(filteredValue)
        ) || '';
        break;
      case 'model':
        matchingValue = models.find(model => 
          model.toLowerCase().includes(filteredValue)
        ) || '';
        break;
      case 'year':
        matchingValue = years.find(year => 
          year.toString().includes(filteredValue)
        )?.toString() || '';
        break;
    }
    
    setFilters(prev => ({ ...prev, [key]: matchingValue }));
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
        <input
          type="text"
          placeholder="Search support level..."
          value={searchQueries().supportLevel}
          onInput={(e) => handleSearchChange('supportLevel', e.target.value)}
          class="w-full p-4 bg-transparent pr-10"
        />
        {searchQueries().supportLevel && filters().supportLevel && (
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <span class="text-green-600">✓</span>
          </div>
        )}
      </div>
    </div>

    {/* Make Filter */}
    <div>
      <span class="block mb-2">Make</span>
      <div class="border border-black relative">
        <input
          type="text"
          placeholder="Search make..."
          value={searchQueries().make}
          onInput={(e) => handleSearchChange('make', e.target.value)}
          class="w-full p-4 bg-transparent pr-10"
        />
        {searchQueries().make && filters().make && (
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <span class="text-green-600">✓</span>
          </div>
        )}
      </div>
    </div>

    {/* Model Filter */}
    <div>
      <span class="block mb-2">Model</span>
      <div class="border border-black relative">
        <input
          type="text"
          placeholder="Search model..."
          value={searchQueries().model}
          onInput={(e) => handleSearchChange('model', e.target.value)}
          class="w-full p-4 bg-transparent pr-10"
        />
        {searchQueries().model && filters().model && (
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <span class="text-green-600">✓</span>
          </div>
        )}
      </div>
    </div>

    {/* Year Filter */}
    <div>
      <span class="block mb-2">Year</span>
      <div class="border border-black relative">
        <input
          type="text"
          placeholder="Search year..."
          value={searchQueries().year}
          onInput={(e) => handleSearchChange('year', e.target.value)}
          class="w-full p-4 bg-transparent pr-10"
        />
        {searchQueries().year && filters().year && (
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <span class="text-green-600">✓</span>
          </div>
        )}
      </div>
    </div>
  </div>
</div>  
    </div>
  );
} 