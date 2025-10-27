// Formatters for display values
const MS_TO_MPH = 2.237
const KG_TO_LBS = 2.20462

const formatSpeed = (speedMs: number): string => {
  return speedMs > 0 ? `${Math.round(speedMs * MS_TO_MPH)} mph` : 'any speed'
}

const formatValue = (value: number | undefined, unit: string = ''): string => {
  if (value === undefined) return 'N/A'
  if (Math.abs(value) >= 1000) {
    return `~${Math.round(value).toLocaleString()}${unit}`
  }
  return `~${value.toFixed(2)}${unit}`
}

const formatWeight = (kg: number | undefined): string => {
  if (kg === undefined) return 'N/A'
  const lbs = Math.round(kg * KG_TO_LBS)
  return `${lbs.toLocaleString()} lbs`
}

const formatBoolean = (val: boolean): string => val ? 'Yes' : 'No'
const formatEnabled = (val: boolean): string => val ? 'Enabled' : 'Disabled'

type SpecDefinition = {
  id: string
  label: string
  key: string
  category: string
  accordionId: string
  format?: (val: any) => string
}

export const SPECS: SpecDefinition[] = [
  // Compatibility Info
  { id: 'support-type-badge', label: 'Support Type', key: 'support_type', category: 'Compatibility Info', accordionId: 'compatibility-info' },
  { id: 'adas-package', label: 'ADAS Package', key: 'package', category: 'Compatibility Info', accordionId: 'compatibility-info' },
  { id: 'years', label: 'Years', key: 'years', category: 'Compatibility Info', accordionId: 'compatibility-info' },
  { id: 'fingerprint', label: 'Fingerprint', key: 'car_fingerprint', category: 'Compatibility Info', accordionId: 'compatibility-info' },
  { id: 'harness', label: 'Harness', key: 'harness', category: 'Compatibility Info', accordionId: 'compatibility-info' },

  // Capabilities
  { id: 'min-steering-speed', label: 'Min Steering Speed', key: 'min_steer_speed', format: formatSpeed, category: 'Capabilities', accordionId: 'capabilities' },
  { id: 'min-enable-speed', label: 'Min Enable Speed', key: 'min_enable_speed', format: formatSpeed, category: 'Capabilities', accordionId: 'capabilities' },
  { id: 'longitudinal-control', label: 'Longitudinal Control', key: 'longitudinal', category: 'Capabilities', accordionId: 'capabilities' },
  { id: 'auto-resume', label: 'Auto Resume', key: 'auto_resume', format: formatBoolean, category: 'Capabilities', accordionId: 'capabilities' },
  { id: 'fsr-longitudinal', label: 'FSR Longitudinal', key: 'fsr_longitudinal', category: 'Capabilities', accordionId: 'capabilities' },
  { id: 'fsr-steering', label: 'FSR Steering', key: 'fsr_steering', category: 'Capabilities', accordionId: 'capabilities' },
  { id: 'steering-torque', label: 'Steering Torque', key: 'steering_torque', category: 'Capabilities', accordionId: 'capabilities' },

  // Vehicle Metrics
  { id: 'curb-weight', label: 'Curb Weight', key: 'mass_curb_weight', format: formatWeight, category: 'Vehicle Metrics', accordionId: 'vehicle-metrics' },
  { id: 'wheelbase', label: 'Wheelbase', key: 'wheelbase', format: (val: number) => formatValue(val, ' m'), category: 'Vehicle Metrics', accordionId: 'vehicle-metrics' },
  { id: 'steer-ratio', label: 'Steer Ratio', key: 'steer_ratio', format: (val: number) => formatValue(val), category: 'Vehicle Metrics', accordionId: 'vehicle-metrics' },
  { id: 'center-front-ratio', label: 'Center to Front Ratio', key: 'center_to_front_ratio', format: (val: number) => formatValue(val), category: 'Vehicle Metrics', accordionId: 'vehicle-metrics' },
  { id: 'max-lateral-accel', label: 'Max Lateral Accel', key: 'max_lateral_accel', format: (val: number) => formatValue(val, ' m/s²'), category: 'Vehicle Metrics', accordionId: 'vehicle-metrics' },

  // Technical Parameters
  { id: 'tire-stiffness-factor', label: 'Tire Stiffness Factor', key: 'tire_stiffness_factor', format: (val: number) => formatValue(val), category: 'Technical Parameters', accordionId: 'technical' },
  { id: 'tire-front-stiffness', label: 'Front Stiffness', key: 'tire_stiffness_front', format: (val: number) => formatValue(val), category: 'Technical Parameters', accordionId: 'technical' },
  { id: 'tire-rear-stiffness', label: 'Rear Stiffness', key: 'tire_stiffness_rear', format: (val: number) => formatValue(val), category: 'Technical Parameters', accordionId: 'technical' },
  { id: 'actuator-delay', label: 'Actuator Delay', key: 'steer_actuator_delay', format: (val: number) => formatValue(val, 's'), category: 'Technical Parameters', accordionId: 'technical' },
  { id: 'limit-timer', label: 'Limit Timer', key: 'steer_limit_timer', format: (val: number) => formatValue(val, 's'), category: 'Technical Parameters', accordionId: 'technical' },
  { id: 'control-type', label: 'Control Type', key: 'steer_control_type', category: 'Technical Parameters', accordionId: 'technical' },
  { id: 'stopping-speed', label: 'Stopping Speed', key: 'vEgo_stopping', format: (val: number) => formatValue(val, ' m/s'), category: 'Technical Parameters', accordionId: 'technical' },
  { id: 'starting-speed', label: 'Starting Speed', key: 'vEgo_starting', format: (val: number) => formatValue(val, ' m/s'), category: 'Technical Parameters', accordionId: 'technical' },
  { id: 'stop-accel', label: 'Stop Accel', key: 'stop_accel', format: (val: number) => formatValue(val, ' m/s²'), category: 'Technical Parameters', accordionId: 'technical' },

  // System Configuration
  { id: 'network-location', label: 'Network Location', key: 'network_location', category: 'System Configuration', accordionId: 'system' },
  { id: 'bus-lookup', label: 'Bus Lookup', key: 'bus_lookup', category: 'System Configuration', accordionId: 'system' },
  { id: 'experimental-longitudinal', label: 'Experimental Longitudinal', key: 'experimental_longitudinal_available', format: formatEnabled, category: 'System Configuration', accordionId: 'system' },
  { id: 'dsu-enabled', label: 'DSU Enabled', key: 'enable_dsu', format: formatBoolean, category: 'System Configuration', accordionId: 'system' },
  { id: 'bsm-enabled', label: 'BSM Enabled', key: 'enable_bsm', format: formatBoolean, category: 'System Configuration', accordionId: 'system' },
  { id: 'pcm-cruise', label: 'PCM Cruise', key: 'pcm_cruise', format: formatBoolean, category: 'System Configuration', accordionId: 'system' },
]

export const SPECS_BY_CATEGORY = SPECS.reduce((acc, spec) => {
  let group = acc.find(g => g.category === spec.category)
  if (!group) {
    group = { category: spec.category, specs: [] }
    acc.push(group)
  }
  group.specs.push(spec)
  return acc
}, [] as Array<{ category: string; specs: SpecDefinition[] }>)

export const getAccordionIdForSpec = (specId: string): string | undefined => {
  return SPECS.find(spec => spec.id === specId)?.accordionId
}

// Constants for lookup - explicitly typed for autocomplete
export const SPEC_ID = {
  SUPPORT_TYPE_BADGE: 'support-type-badge',
  ADAS_PACKAGE: 'adas-package',
  YEARS: 'years',
  FINGERPRINT: 'fingerprint',
  HARNESS: 'harness',
  MIN_STEERING_SPEED: 'min-steering-speed',
  MIN_ENABLE_SPEED: 'min-enable-speed',
  LONGITUDINAL_CONTROL: 'longitudinal-control',
  AUTO_RESUME: 'auto-resume',
  FSR_LONGITUDINAL: 'fsr-longitudinal',
  FSR_STEERING: 'fsr-steering',
  STEERING_TORQUE: 'steering-torque',
  TIRE_STIFFNESS_FACTOR: 'tire-stiffness-factor',
  TIRE_FRONT_STIFFNESS: 'tire-front-stiffness',
  TIRE_REAR_STIFFNESS: 'tire-rear-stiffness',
  ACTUATOR_DELAY: 'actuator-delay',
  LIMIT_TIMER: 'limit-timer',
  CONTROL_TYPE: 'control-type',
  STOPPING_SPEED: 'stopping-speed',
  STARTING_SPEED: 'starting-speed',
  STOP_ACCEL: 'stop-accel',
  NETWORK_LOCATION: 'network-location',
  BUS_LOOKUP: 'bus-lookup',
  EXPERIMENTAL_LONGITUDINAL: 'experimental-longitudinal',
  DSU_ENABLED: 'dsu-enabled',
  BSM_ENABLED: 'bsm-enabled',
  PCM_CRUISE: 'pcm-cruise',
  CURB_WEIGHT: 'curb-weight',
  WHEELBASE: 'wheelbase',
  STEER_RATIO: 'steer-ratio',
  CENTER_FRONT_RATIO: 'center-front-ratio',
  MAX_LATERAL_ACCEL: 'max-lateral-accel',
} as const

