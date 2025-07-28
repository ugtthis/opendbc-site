import { type Component, createMemo } from 'solid-js';
import FilterSidebar, { toggleSidebar, isOpen, getFilteredAndSortedCars } from './FilterSidebar';
import type { Car } from '../types/CarDataTypes';
import CarList from './CarList';

type LayoutProps = {
  cars: Car[];
};

const Layout: Component<LayoutProps> = (props) => {
  const filteredAndSortedCars = createMemo(() => getFilteredAndSortedCars());

  return (
    <div class="flex overflow-hidden relative">
      <FilterSidebar />
      <main class={`w-full ${isOpen() ? 'md:ml-[380px]' : 'ml-0'}`}>
        <div class="flex justify-between items-center px-4 mb-5">
          <div class="text-lg font-semibold font-mono">
            {filteredAndSortedCars().length} CARS IN RESULTS
          </div>
          <button
            onClick={toggleSidebar}
            class="bg-[#969696] p-2 border-4 border-[#d9d9d9] z-10 2xl:hidden"
          >
            <img src="/icons/toggleFilterIcon.svg" alt="Toggle Icon" class="w-4 h-4" />
          </button>
        </div>
        <div class="px-4">
          <CarList cars={filteredAndSortedCars()} />
        </div>
      </main>
    </div>
  );
};

export default Layout;
