import { type Component, createMemo } from 'solid-js';
import FilterSidebar, { toggleSidebar, isOpen, getFilteredAndSortedCars } from './FilterSidebar';
import CarList from './CarList';
import { viewMode, toggleViewMode } from '../store/toggleStore';
import type { Car } from '../types/CarDataTypes';

type LayoutProps = {
  cars: Car[];
};

const HeaderControls: Component<{ resultCount: number }> = (props) => (
  <div class="flex justify-between items-center px-4 mb-5">
    <div class="text-lg font-semibold font-mono">
      {props.resultCount} CARS IN RESULTS
    </div>
    <div class="flex gap-2">
      {/* View toggle switch */}
      <div class="relative border-4 border-[#dadada] h-11">
        <button
          onClick={toggleViewMode}
          class="relative bg-[#F3F3F3] w-20 h-full rounded-none overflow-hidden transition-all duration-200 hover:border-[#969696] hover:shadow-sm"
          title={`Switch to ${viewMode() === 'grid' ? 'list' : 'grid'} view`}
        >
          {/* Background icons */}
          <div class="absolute inset-0 flex">
            {/* Grid icon area */}
            <div class="flex-1 flex items-center justify-center">
              <svg class="w-4 h-4 text-[#A0A0A0]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
            </div>
            {/* List icon area */}
            <div class="flex-1 flex items-center justify-center">
              <svg class="w-4 h-4 text-[#A0A0A0]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm0 6h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 011-1zm0 6h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 011-1z"/>
              </svg>
            </div>
          </div>
          
          {/* Sliding thumb */}
          <div 
            class={`absolute top-0 w-1/2 h-full bg-gradient-to-b from-[#686868] to-[#4A4A4A] transition-transform duration-200 ease-in-out flex items-center justify-center shadow-md ${
              viewMode() === 'grid' ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {viewMode() === 'grid' ? (
              <svg class="w-4 h-4 text-[#F3F3F3]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
              </svg>
            ) : (
              <svg class="w-4 h-4 text-[#F3F3F3]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm0 6h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 011-1zm0 6h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 011-1z"/>
              </svg>
            )}
          </div>
        </button>
      </div>
      {/* Sidebar toggle button */}
      <button
        onClick={toggleSidebar}
        class="bg-[#969696] hover:bg-[#787878] p-2 border-4 border-[#d9d9d9] hover:border-[#c9c9c9] z-10 2xl:hidden transition-all duration-200"
        aria-label="Toggle filters"
      >
        <svg class="w-5 h-5 text-white group-hover:text-gray-100 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
);

const Layout: Component<LayoutProps> = (props) => {
  const filteredAndSortedCars = createMemo(() => getFilteredAndSortedCars());

  return (
    <div class="flex relative min-h-screen">
      <FilterSidebar />
      <main class={`w-full ${isOpen() ? 'md:ml-[380px]' : 'ml-0'}`}>
        {viewMode() === 'grid' ? (
          <>
            <HeaderControls resultCount={filteredAndSortedCars().length} />
            <div class="px-4">
              <CarList cars={filteredAndSortedCars()} />
            </div>
          </>
        ) : (
          <div class="flex flex-col h-full">
            <HeaderControls resultCount={filteredAndSortedCars().length} />
            <div class="flex-1 overflow-hidden">
              <CarList cars={filteredAndSortedCars()} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Layout;
