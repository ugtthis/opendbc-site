import { createSignal, onMount, onCleanup, For, Show, createEffect } from 'solid-js';
import { isServer } from 'solid-js/web';
import carData from '../data/car_data.json';
import type { Car } from '../types/CarDataTypes';
import sortOrderIcon from '../assets/icons/sort-order-icon.svg?url';
import rotateLeftIcon from '../assets/icons/rotate-left.svg?url';

export const [isOpen, setIsOpen] = createSignal(false);
export const toggleSidebar = () => setIsOpen(!isOpen());

export const [filters, setFilters] = createSignal({
  supportLevel: '',
  make: '',
  model: '',
  year: ''
});

export type SortField = keyof Pick<Car, 'make' | 'support_type' | 'year_list'>;

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

const makes = [...new Set(carData.map(car => car.make))].sort();
const models = [...new Set(carData.map(car => car.model))].sort();
const years = [...new Set(carData.flatMap(car => car.year_list))].sort();

type DropdownProps = {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  isOpen: boolean;
  onToggle: () => void;
};

function CustomDropdown(props: DropdownProps) {
  let dropdownRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;
  const [searchTerm, setSearchTerm] = createSignal('');
  const [highlightedIndex, setHighlightedIndex] = createSignal(-1);
  
  const filteredOptions = () => {
    const term = searchTerm().toLowerCase();
    return term ? props.options.filter(option => option.toLowerCase().includes(term)) : props.options;
  };

  createEffect(() => {
    filteredOptions();
    setHighlightedIndex(-1);
  });

  const handleClickOutside = (e: MouseEvent) => {
    if (props.isOpen && dropdownRef && !dropdownRef.contains(e.target as Node)) {
      closeDropdown();
    }
  };

  const closeDropdown = () => {
    props.onToggle();
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  onMount(() => !isServer && document.addEventListener('mousedown', handleClickOutside));
  onCleanup(() => !isServer && document.removeEventListener('mousedown', handleClickOutside));

  const handleSelect = (value: string) => {
    props.onChange(value);
    closeDropdown();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const options = ['', ...filteredOptions()];
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => prev < options.length - 1 ? prev + 1 : 0);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : options.length - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex() >= 0) {
          handleSelect(options[highlightedIndex()]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
    }
  };

  createEffect(() => {
    if (props.isOpen && inputRef) {
      inputRef.focus();
    }
  });

  return (
    <div class="space-y-2" ref={dropdownRef}>
      <span class="block">{props.label}</span>
      <div class="w-full">
        <button
          type="button"
          onClick={props.onToggle}
          class="w-full p-4 text-left border border-black bg-white flex justify-between items-center"
        >
          <span>{props.value || 'All'}</span>
          <svg
            class={`w-6 h-6 transition-transform ${props.isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        <Show when={props.isOpen}>
          <div class="w-full bg-white border border-t-0 border-black">
            <div class="max-h-[180px] overflow-y-auto">
              <div class="sticky top-0 bg-white p-2 border-b border-gray-200">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm()}
                  onInput={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  class="w-full p-2 border border-gray-200 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <button
                  class={`w-full h-10 px-4 text-left hover:bg-gray-100 ${
                    !props.value ? 'bg-gray-100' : ''
                  } ${highlightedIndex() === 0 ? 'bg-gray-200' : ''}`}
                  onClick={() => handleSelect('')}
                  onMouseEnter={() => setHighlightedIndex(0)}
                >
                  All
                </button>
                <For each={filteredOptions()}>
                  {(option, index) => (
                    <button
                      class={`w-full h-10 px-4 text-left hover:bg-gray-100 ${
                        props.value === option ? 'bg-gray-100' : ''
                      } ${highlightedIndex() === index() + 1 ? 'bg-gray-200' : ''}`}
                      onClick={() => handleSelect(option)}
                      onMouseEnter={() => setHighlightedIndex(index() + 1)}
                    >
                      {option}
                    </button>
                  )}
                </For>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

export default function FilterSidebar() {
  const handleMediaQuery = () => {
    if (window.matchMedia('(min-width: 1536px)').matches) {
      setIsOpen(true);
    }
  };

  onMount(() => {
    if (!isServer) {
      handleMediaQuery();
      window.addEventListener('resize', handleMediaQuery);
    }
  });

  onCleanup(() => {
    if (!isServer) {
      window.removeEventListener('resize', handleMediaQuery);
    }
  });

  const [openDropdown, setOpenDropdown] = createSignal<string | null>(null);
  const toggleDropdown = (id: string) => setOpenDropdown(current => current === id ? null : id);

  const filteredResults = () => {
    let result = [...carData];
    const currentFilters = filters();
    
    if (currentFilters.supportLevel) {
      result = result.filter(car => car.support_type === currentFilters.supportLevel);
    }
    if (currentFilters.make) {
      result = result.filter(car => car.make === currentFilters.make);
    }
    if (currentFilters.model) {
      result = result.filter(car => car.model === currentFilters.model);
    }
    if (currentFilters.year) {
      result = result.filter(car => car.year_list.includes(currentFilters.year));
    }
    
    return result.length;
  };

  const hasActiveFilters = () => {
    const currentFilters = filters();
    return Object.values(currentFilters).some(value => value !== '');
  };

  const getResultsStyle = (count: number) => {
    if (count === 0) return 'bg-black text-[#FF5733]'; // Red text
    if (count <= 5) return 'bg-black text-[#FFD700]'; // Yellow text
    return 'bg-black text-[#32E347]'; // Green text
  };

  return (
    <div
      id="sidebar"
      class={`fixed left-0 md:top-[99px] top-0 md:h-[calc(100vh-99px)] h-screen bg-[#FBFBFB] shadow-m shadow-gray-400 
          w-full md:w-[380px] border-r-4 border-white z-50
          2xl:translate-x-0 flex flex-col
          ${isOpen() ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Scrollable content area */}
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-y-auto px-9 pt-4 pb-48">
          {/* Close button */}
          <div class="flex justify-end mb-6 lg:hidden">
            <button
              class="p-2 hover:bg-gray-100"
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
          </div>

          <div class="mb-6">
            <h2 class="text-lg font-semibold mb-4">SORT BY:</h2>
            <div class="flex gap-2">
              <div class="relative w-2/3">
                <select 
                  class="appearance-none border border-black p-4 w-full pr-10"
                  value={sortConfig().field}
                  onChange={(e) => setSortConfig(prev => ({ ...prev, field: e.currentTarget.value as SortField }))}
                >
                  <option value="make">Make</option>
                  {/* Model sort will be added in a future update */}
                  <option value="year_list">Year</option>
                  <option value="support_type">Support Level</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setSortConfig(prev => ({ 
                  ...prev, 
                  order: prev.order === 'ASC' ? 'DESC' : 'ASC' 
                }))}
                class="w-1/3 border border-black p-3 flex items-center justify-center hover:bg-gray-50"
                aria-label={`Toggle sort order: currently ${sortConfig().order === 'ASC' ? 'Ascending' : 'Descending'}`}
              >
                <img 
                  src={sortOrderIcon} 
                  alt="" 
                  width="32"
                  height="28"
                  class={`${sortConfig().order === 'DESC' ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <div class="w-full h-[1px] bg-gray-200 my-4" />

          <div>
            <h2 class="text-lg font-semibold mb-4">FILTER BY:</h2>
            <div class="space-y-3">
              <CustomDropdown
                label="Support Level"
                options={supportLevels}
                value={filters().supportLevel}
                onChange={(value) => setFilters(prev => ({ ...prev, supportLevel: value }))}
                isOpen={openDropdown() === 'support-level'}
                onToggle={() => toggleDropdown('support-level')}
              />

              <CustomDropdown
                label="Make"
                options={makes}
                value={filters().make}
                onChange={(value) => setFilters(prev => ({ ...prev, make: value }))}
                isOpen={openDropdown() === 'make'}
                onToggle={() => toggleDropdown('make')}
              />

              <CustomDropdown
                label="Model"
                options={models}
                value={filters().model}
                onChange={(value) => setFilters(prev => ({ ...prev, model: value }))}
                isOpen={openDropdown() === 'model'}
                onToggle={() => toggleDropdown('model')}
              />

              <CustomDropdown
                label="Year"
                options={years}
                value={filters().year}
                onChange={(value) => setFilters(prev => ({ ...prev, year: value }))}
                isOpen={openDropdown() === 'year'}
                onToggle={() => toggleDropdown('year')}
              />
            </div>
          </div>
        </div>

        {/* Fixed footer with results counter and action buttons */}
        <div class="absolute bottom-0 left-0 right-0 bg-[#FBFBFB] px-9 pb-6 pt-4 z-20">
          <div class={`p-2 border border-white text-center font-semibold ${getResultsStyle(filteredResults())}`}>
            {filteredResults()} RESULT{filteredResults() !== 1 ? 'S' : ''}
          </div>
          <div class="flex gap-2 mt-4">
            <button
              onClick={() => hasActiveFilters() && setFilters({ supportLevel: '', make: '', model: '', year: '' })}
              disabled={!hasActiveFilters()}
              class={`flex-1 p-3 border border-black bg-white hover:bg-gray-50 font-medium flex items-center justify-center gap-2 
                ${!hasActiveFilters() ? 'opacity-50 cursor-not-allowed hover:bg-white' : ''}`}
            >
              <img 
                src={rotateLeftIcon} 
                alt="" 
                width="24"
                height="24"
                class="opacity-90"
                aria-hidden="true"
              />
              <span>RESET</span>
            </button>
            <button
              onClick={() => setIsOpen(false)}
              class="md:hidden flex-1 p-3 border border-black bg-white hover:bg-gray-50 font-medium flex items-center justify-center gap-2"
            >
              <span>VIEW</span>
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 