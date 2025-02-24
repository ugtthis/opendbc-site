import { type Component } from 'solid-js';
import type { Car } from '../types/CarDataTypes';
import { getSupportTypeColor } from '../utils/supportType';

type CardProps = {
  car: Car;
};

const Card: Component<CardProps> = (props) => {
  return (
    <>
      {/* Support label */}
      <div class={`py-1 px-6 inline-block border border-black border-b-0 text-center ${getSupportTypeColor(props.car.support_type)}`}>
        <p class="text-[16px] uppercase">{props.car.support_type}</p>
      </div>

      {/* Card body */}
      <div class="border border-black bg-[#F3F3F3] shadow min-h-[180px] flex flex-col">
        <div class="flex-grow">
          {/* Year and Model */}
          <div class="flex border-b border-black">
            <div class="px-2 py-2.5 border-r border-black flex items-center">
              <h2 class="text-lg">{props.car.years}</h2>
            </div>
            <div class="px-2 py-2.5">
              <h1 class="text-xl font-semibold">{props.car.make} {props.car.model}</h1>
            </div>
          </div>

          <div class="px-2 py-2.5 border-b border-black h-[60px]">
            <p class="text-sm"><strong>ADAS Package:</strong> {props.car.package}</p>
          </div>
          <div class="px-2 py-2.5 border-b border-black">
            <p class="text-sm"><strong>Fingerprint:</strong> {props.car.car_fingerprint}</p>
          </div>

          <div class="flex flex-row justify-start divide-x divide-black">
            <p class="text-sm px-3 py-2">AWD</p>
            <p class="text-sm px-3 py-2">Gas</p>
            <p class="text-sm px-3 py-2">Hybrid</p>
          </div>
        </div>

        <input type="checkbox" id={`toggle-${props.car.name}-${props.car.car_fingerprint}`} class="hidden peer" />

        <div class="bg-[#D9D9D9] overflow-hidden max-h-0 peer-checked:max-h-[400px] peer-checked:border-t peer-checked:border-black">
          <div class="p-4 grid grid-cols-2 gap-4">
            <div class="flex justify-between bg-white px-4 py-2 border border-black items-center">
              <span class="text-sm">Steering<br />Torque</span>
              <span>2048</span>
            </div>
            <div class="flex justify-between bg-white px-4 py-2 border border-black items-center">
              <span class="text-sm">Harness</span>
              <p>{props.car.harness ? props.car.harness : 'N/A'}</p>
            </div>
            <div class="flex justify-between bg-white px-4 py-2 border border-black items-center">
              <span class="text-sm">Lat<br />Control</span>
              <span>N/A</span>
            </div>
            <div class="flex justify-between bg-white px-4 py-2 border border-black items-center">
              <span class="text-sm">Long<br />Control</span>
              <span>N/A</span>
            </div>
          </div>
          <div class="flex justify-between px-4 pb-4 items-center">
            <a href={`/cars/${props.car.make}-${props.car.model}`.toLowerCase()} class="w-full bg-[#969696] border border-black text-white py-4 text-center">
              Open full details
            </a>
          </div>
        </div>

        <label for={`toggle-${props.car.name}-${props.car.car_fingerprint}`} class="flex justify-center bg-[#969696] peer-checked:bg-[#D9D9D9] border-t border-black mt-auto py-1 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="4 6 12 8" fill="none" stroke="white" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
            <path d="M5.293 7.293L10 11.586l4.707-4.293" />
          </svg>
        </label>
      </div>

      <style>{`
        input:checked + div + label svg {
          transform: rotate(180deg);
          stroke: black;
        }
      `}</style>
    </>
  );
};

export default Card;