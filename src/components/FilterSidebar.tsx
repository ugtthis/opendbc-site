import { createSignal, onMount, onCleanup, For, Show, createEffect } from 'solid-js';
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
            <div class="sticky top-0 bg-white p-2 border-b border-gray-200 z-10">
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
            <div class="max-h-[180px] overflow-y-auto">
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

  return (
    <div
      id="sidebar"
      class={`fixed left-0 top-[99px] h-[calc(100vh-99px)] bg-[#FBFBFB] shadow-m shadow-gray-400 
          w-full md:w-[380px] p-9 border-r-4 border-white z-50 overflow-y-auto
          2xl:translate-x-0
          ${isOpen() ? 'translate-x-0' : '-translate-x-full'}`}
    >
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

      <div class="mb-6">
        <h2 class="text-lg font-semibold mb-4">SORT BY:</h2>
        <div class="flex gap-2">
          <div class="relative w-1/2">
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
          <div class="relative w-1/2">
            <select 
              class="appearance-none border border-black p-4 w-full pr-10"
              value={sortConfig().order}
              onChange={(e) => setSortConfig(prev => ({ ...prev, order: e.currentTarget.value as 'ASC' | 'DESC' }))}
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
  );
} 