import { createSignal, createEffect } from 'solid-js';
import ExpandableDetail from './ExpandableDetail';

interface VehicleMetricsProps {
  carData: any;
}

export default function VehicleMetrics(props: VehicleMetricsProps) {
  const [openMetric, setOpenMetric] = createSignal<string | null>(null);

  const handleToggle = (metricKey: string) => {
    setOpenMetric(current => current === metricKey ? null : metricKey);
  };

  // Force parent InfoCard to recalculate height when descriptions change
  createEffect(() => {
    openMetric();
    // Small delay to ensure DOM has updated
    setTimeout(() => {
      const event = new CustomEvent('recalculateHeight');
      document.dispatchEvent(event);
    }, 50);
  });

  return (
    <div>
      <ExpandableDetail 
        label="Curb Weight"
        value={`${Math.round(props.carData.mass_curb_weight).toLocaleString()} kg`}
        description="Vehicle weight without passengers or cargo, including fluids."
        isEven={true}
        isOpen={openMetric() === 'curb-weight'}
        onToggle={() => handleToggle('curb-weight')}
      />
      <ExpandableDetail 
        label="Wheelbase"
        value={`~${Number(props.carData.wheelbase).toFixed(2)} m`}
        description="The distance between the front and rear axles."
        isEven={false}
        isOpen={openMetric() === 'wheelbase'}
        onToggle={() => handleToggle('wheelbase')}
      />
      <ExpandableDetail 
        label="Steer Ratio"
        value={`~${Number(props.carData.steer_ratio).toFixed(2)}`}
        description="Ratio of steering wheel rotation to front wheel turn angle."
        isEven={true}
        isOpen={openMetric() === 'steer-ratio'}
        onToggle={() => handleToggle('steer-ratio')}
      />
      <ExpandableDetail 
        label="Center to Front Ratio"
        value={`~${Number(props.carData.center_to_front_ratio).toFixed(2)}`}
        description="Distance from center of gravity to front axle divided by wheelbase."
        isEven={false}
        isOpen={openMetric() === 'center-to-front-ratio'}
        onToggle={() => handleToggle('center-to-front-ratio')}
      />
      <ExpandableDetail 
        label="Max Lateral Accel"
        value={`~${Number(props.carData.max_lateral_accel).toFixed(2)} m/s²`}
        description="Maximum lateral acceleration during cornering."
        isEven={true}
        isOpen={openMetric() === 'max-lateral-accel'}
        onToggle={() => handleToggle('max-lateral-accel')}
      />
    </div>
  );
} 