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
            <div class="h-6"/> 
            {/* spacer for future drivetrain label */}
          </div>
        </div>

        <input type="checkbox" id={`toggle-${props.car.name}-${props.car.car_fingerprint}`} class="hidden peer" />

        <div class="bg-[#D9D9D9] overflow-hidden max-h-0 peer-checked:max-h-[400px] peer-checked:border-t peer-checked:border-black">
          <div class="p-4 grid grid-cols-2 gap-4">
            <div class="flex justify-between bg-white px-4 py-2 border border-black items-center h-[60px]">
              <span class="text-sm">Mass</span>
              <span>~{Number.isInteger(props.car.mass) ? Math.round(props.car.mass).toLocaleString() : Number(props.car.mass).toFixed(1).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} kg</span>
            </div>
            <div class="flex justify-between bg-white px-4 py-2 border border-black items-center h-[60px]">
              <span class="text-sm">Harness</span>
              <p>{props.car.harness ? props.car.harness : 'N/A'}</p>
            </div>
            <div class="flex justify-between bg-white px-4 py-2 border border-black items-center h-[60px]">
              <span class="text-sm">Auto<br />Resume</span>
              <span>{props.car.auto_resume ? 'Yes' : 'No'}</span>
            </div>
            <div class="flex justify-between bg-white px-4 py-2 border border-black items-center h-[60px]">
              <span class="text-sm">Steer<br />Ratio</span>
              <span>~{Number.isInteger(props.car.steer_ratio) ? props.car.steer_ratio : Number(props.car.steer_ratio).toFixed(2)}</span>
            </div>
          </div>
          <div class="flex justify-between px-4 pb-4 items-center">
            <a href={`/cars/${props.car.make}-${props.car.model}`.toLowerCase()} class="w-full bg-[#969696] border border-black uppercase text-white py-4 text-center flex items-center justify-center gap-3">
              <svg width="28" height="24" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg" class="translate-y-[-1px]">
                <path d="M2.46405 5.60547L0 9.82796V2.05524C0 1.07462 0.797274 0.277344 1.77789 0.277344H5.04199C5.51425 0.277344 5.96705 0.463467 6.30041 0.796822L7.03657 1.53298C7.36992 1.86634 7.82273 2.05246 8.29498 2.05246L11.5563 2.05524C12.5369 2.05524 13.3342 2.85251 13.3342 3.83313V4.72208H4.00026C3.36689 4.72208 2.78351 5.05821 2.46405 5.60547ZM3.23077 6.05272C3.39189 5.7777 3.68357 5.61102 4.00026 5.61102H15.1121C15.4316 5.61102 15.7232 5.78048 15.8816 6.05827C16.0399 6.33607 16.0399 6.67498 15.8788 6.95L12.7675 12.2837C12.6092 12.5559 12.3175 12.7226 12.0008 12.7226H0.888947C0.569481 12.7226 0.277796 12.5531 0.119452 12.2753C-0.0388914 11.9975 -0.0388914 11.6586 0.12223 11.3836L3.23354 6.04994L3.23077 6.05272Z" fill="black"/>
              </svg>
              Open full details
            </a>
          </div>
        </div>

        <label for={`toggle-${props.car.name}-${props.car.car_fingerprint}`} class="flex justify-center bg-[#969696] peer-checked:bg-[#D9D9D9] border-t border-black mt-auto py-1 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="4 6 12 8" fill="none" stroke="#2D2D2D" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
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