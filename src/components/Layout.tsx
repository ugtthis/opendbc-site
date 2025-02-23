import { type Component } from 'solid-js';
import FilterSidebar, { toggleSidebar, isOpen } from './FilterSidebar';
import type { Car } from '../types/CarDataTypes';
import CarList from './CarList';

type LayoutProps = {
  cars: Car[];
};

const Layout: Component<LayoutProps> = (props) => {
  return (
    <div class="flex overflow-hidden relative">
      <FilterSidebar />
      <main class={`w-full ${isOpen() ? 'md:ml-[380px]' : 'ml-0'}`}>
        <div class="flex justify-between items-center px-4 mb-5">
          <div class="text-lg font-semibold font-mono">123 CARS IN RESULTS</div>
          <button
            onClick={toggleSidebar}
            class="bg-gray-300 p-2 border border-black z-10 2xl:hidden"
          >
            <img src="/icons/toggleFilterIcon.svg" alt="Toggle Icon" class="w-6 h-6" />
          </button>
        </div>
        <div class="px-4">
          <CarList cars={props.cars} />
        </div>
      </main>
    </div>
  );
};

export default Layout;
