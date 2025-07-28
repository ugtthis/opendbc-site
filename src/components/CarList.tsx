import { type Component, For } from 'solid-js';
import type { Car } from '../types/CarDataTypes';
import Card from './Card';
import { viewMode } from '../store/toggleStore';

type CarListProps = {
  cars: Car[];
};

const CarList: Component<CarListProps> = (props) => {
  return (
    <div class={`${viewMode() === 'grid' ? 'flex-1 overflow-auto -webkit-overflow-scrolling-touch' : 'h-full overflow-auto'}`}>
      {viewMode() === 'grid' ? (
        <div class="responsive-grid gap-4">
          <For each={props.cars}>
            {(car) => (
              <div class="align-self-start">
                <Card car={car} />
              </div>
            )}
          </For>
        </div>
      ) : (
        <div class="w-full">
          <div class="overflow-x-auto overflow-y-visible mx-4 border border-black bg-[#F3F3F3]" style="scrollbar-width: thin; scrollbar-color: #9CA3AF #E5E7EB; -webkit-overflow-scrolling: touch;">
            <div class="car-data-grid">
              {/* Header row */}
              <div class="car-row bg-[#d9d9d9]">
                <div class="car-cell border border-black px-2 py-2 text-left text-sm font-semibold">
                  Supported Package
                </div>
                <div class="car-cell border border-black px-2 py-2 text-left text-sm font-semibold">
                  Make
                </div>
                <div class="car-cell border border-black px-2 py-2 text-left text-sm font-semibold">
                  Model
                </div>
                <div class="car-cell border border-black px-2 py-2 text-left text-sm font-semibold">
                  Years
                </div>
                <div class="car-cell border border-black px-2 py-2 text-left text-sm font-semibold">
                  ACC
                </div>
                <div class="car-cell border border-black px-2 py-2 text-left text-sm font-semibold leading-tight">
                  No ACC<br/>accel below
                </div>
                <div class="car-cell border border-black px-2 py-2 text-left text-sm font-semibold leading-tight">
                  No ALC<br/>below
                </div>
                <div class="car-cell border border-black px-2 py-2 text-left text-sm font-semibold leading-tight">
                  Steering<br/>Torque
                </div>
                <div class="car-cell border border-black px-2 py-2 text-left text-sm font-semibold leading-tight">
                  Resume from<br/>stop
                </div>
                <div class="car-cell border border-black px-2 py-2 text-left text-sm font-semibold">
                  Video
                </div>
              </div>

              {/* Data rows */}
              <For each={props.cars}>
                {(car) => (
                  <div class="car-row hover:bg-[#e9e9e9] transition-colors relative">
                    {/* Main link to individual car page */}
                    <a 
                      href={`/cars/${car.name.replace(/\s+/g, '-')}`}
                      class="car-main-link"
                    >
                      <div class="car-cell border border-black px-2 py-2">
                        <div class="flex flex-col gap-1 w-full">
                          <span class={`py-1 px-2 text-xs uppercase inline-block rounded-sm ${getSupportTypeColor(car.support_type)}`}>
                            {car.support_type}
                          </span>
                          <span class="text-xs pl-1 text-gray-600 break-words leading-tight">
                            {car.package}
                          </span>
                        </div>
                      </div>
                      <div class="car-cell border border-black px-2 py-2 font-semibold text-sm">
                        <div class="truncate w-full" title={car.make}>
                          {car.make}
                        </div>
                      </div>
                      <div class="car-cell border border-black px-2 py-2 text-sm">
                        <div class="w-full leading-tight" title={car.model}>
                          {car.model}
                        </div>
                      </div>
                      <div class="car-cell border border-black px-2 py-2 text-sm">
                        <div class="truncate w-full" title={car.years}>
                          {car.years}
                        </div>
                      </div>
                      <div class="car-cell border border-black px-2 py-2 text-center flex items-center justify-center">
                        {getACCIcon(car.longitudinal)}
                      </div>
                      <div class="car-cell border border-black px-2 py-2 text-center text-sm flex items-center justify-center">
                        <div class="w-full text-center" title={car.fsr_longitudinal}>
                          {car.fsr_longitudinal && car.fsr_longitudinal !== "0 mph" ? car.fsr_longitudinal : <DashIcon />}
                        </div>
                      </div>
                      <div class="car-cell border border-black px-2 py-2 text-center text-sm flex items-center justify-center">
                        <div class="w-full text-center" title={car.fsr_steering}>
                          {car.fsr_steering && car.fsr_steering !== "0 mph" ? car.fsr_steering : <DashIcon />}
                        </div>
                      </div>
                      <div class="car-cell border border-black px-2 py-2 text-center flex items-center justify-center">
                        {getSteeringTorqueIcon(car.steering_torque)}
                      </div>
                      <div class="car-cell border border-black px-2 py-2 text-center flex items-center justify-center">
                        {getAutoResumeIcon(car.auto_resume)}
                      </div>
                    </a>

                    {/* Youtube Link */}
                    <div class="car-cell border border-black px-2 py-2 text-center flex items-center justify-center">
                      {car.video ? (
                        <a 
                          href={car.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="video-icon-link inline-flex items-center bg-[#969696] bg-opacity-80 hover:bg-red-600 hover:bg-opacity-100 text-white text-opacity-90 hover:text-opacity-100 p-1 hover:shadow-lg transition-all duration-200 cursor-pointer relative z-10"
                          title="Watch user video on YouTube"
                        >
                          <svg class="camera-icon w-4 h-4 transition-opacity duration-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 6h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1zm15 3l4-2a1 1 0 011 1v8a1 1 0 01-1 1l-4-2v-6z"/>
                          </svg>
                          <svg class="play-icon w-4 h-4 absolute opacity-0 transition-opacity duration-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </a>
                      ) : (
                        <DashIcon />
                      )}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      )}

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

        .video-icon-link:hover .camera-icon {
          opacity: 0;
        }
        
        .video-icon-link:hover .play-icon {
          opacity: 1;
        }

        .car-data-grid {
          display: flex;
          flex-direction: column;
          min-width: 990px; /* sum of minmax values in car-row */
        }

        .car-row {
          display: grid;
          grid-template-columns: 
            minmax(140px, 1fr)    /* Supported Package */
            minmax(80px, 0.5fr)   /* Make */
            minmax(115px, 1fr)    /* Model */
            minmax(115px, 0.5fr)   /* Years */
            minmax(90px, 0.5fr)   /* ACC */
            minmax(90px, 0.5fr)   /* No ACC accel */
            minmax(90px, 0.5fr)   /* No ALC */
            minmax(90px, 0.5fr)   /* Steering Torque */
            minmax(90px, 0.5fr)   /* Resume */
            minmax(90px, 0.5fr);  /* Video */
        }

        .car-main-link {
          display: contents;
        }

        .car-cell {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

const getSupportTypeColor = (supportType: string) => {
  switch (supportType) {
    case 'Upstream': return 'bg-green-200 text-green-800';
    case 'Under review': return 'bg-blue-200 text-blue-800'; 
    case 'Community': return 'bg-blue-100 text-blue-700';
    case 'Dashcam mode': return 'bg-gray-300 text-gray-700';
    case 'Not compatible': return 'bg-red-200 text-red-800';
    default: return 'bg-gray-200 text-gray-800';
  }
};

const StarIcon = () => (
  <svg class="w-4 h-4 text-yellow-500 mx-auto" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const DashIcon = () => <span class="text-gray-400">—</span>;

const getACCIcon = (longitudinal: string) => {
  if (longitudinal === 'openpilot') {
    return (
      <svg class="w-4 h-4 text-green-600 mx-auto" fill="none" stroke="currentColor" stroke-width="4" viewBox="0 0 24 24">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    );
  }
  return <DashIcon />;
};

const getSteeringTorqueIcon = (steeringTorque: string) => 
  steeringTorque === 'full' ? <StarIcon /> : <DashIcon />;

const getAutoResumeIcon = (autoResume: boolean) => 
  autoResume ? <StarIcon /> : <DashIcon />;

export default CarList;
