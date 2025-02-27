import { type Component, For } from 'solid-js';
import type { Car } from '../types/CarDataTypes';
import Card from './Card';

type CarListProps = {
  cars: Car[];
};

const CarList: Component<CarListProps> = (props) => {
  return (
    <div class="flex-1 overflow-auto -webkit-overflow-scrolling-touch">
      <div class="responsive-grid gap-4">
        <For each={props.cars}>
          {(car) => (
            <div class="align-self-start">
              <Card car={car} />
            </div>
          )}
        </For>
      </div>

      <style>{`
        .responsive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(var(--min-card-width), 100%), 1fr));
        }

        @media (min-width: 768px) {
          .responsive-grid {
            --min-card-width: 380px;
          }
        }

        @media (min-width: 1024px) {
          .responsive-grid {
            --min-card-width: 380px;
          }
        }

        @media (min-width: 1622px) {
          .responsive-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default CarList;
