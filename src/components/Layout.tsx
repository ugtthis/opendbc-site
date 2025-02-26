import { type Component, createMemo } from 'solid-js';
import FilterSidebar, { toggleSidebar, isOpen, filters, sortConfig } from './FilterSidebar';
import type { SortField } from './FilterSidebar';
import type { Car } from '../types/CarDataTypes';
import CarList from './CarList';

type LayoutProps = {
  cars: Car[];
};

const Layout: Component<LayoutProps> = (props) => {
  const filteredAndSortedCars = createMemo(() => {
    let result = [...props.cars];
    
    const currentFilters = filters();
    if (currentFilters.supportLevel) {
      const searchValue = currentFilters.supportLevel;
      result = result.filter(car => car.support_type === searchValue);
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

    // Apply sorting
    const sort = sortConfig();
    result.sort((a, b) => {
      const field: SortField = sort.field;
      let aVal = a[field];
      let bVal = b[field];
      
      if (field === 'year_list') {
        aVal = a.year_list[0];
        bVal = b.year_list[0];
      }
      
      if (sort.order === 'ASC') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  });

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
            class="bg-gray-300 p-2 border border-black z-10 2xl:hidden"
          >
            <img src="/icons/toggleFilterIcon.svg" alt="Toggle Icon" class="w-6 h-6" />
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
