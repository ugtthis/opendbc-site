export const SPEC_ID = {
  // Technical Parameters
  TIRE_STIFFNESS_FACTOR: 'tire-stiffness-factor',
  TIRE_FRONT_STIFFNESS: 'tire-front-stiffness',
  TIRE_REAR_STIFFNESS: 'tire-rear-stiffness',
  ACTUATOR_DELAY: 'actuator-delay',
  LIMIT_TIMER: 'limit-timer',
  CONTROL_TYPE: 'control-type',
  STOPPING_SPEED: 'stopping-speed',
  STARTING_SPEED: 'starting-speed',
  STOP_ACCEL: 'stop-accel',
  // System Configuration
  NETWORK_LOCATION: 'network-location',
  BUS_LOOKUP: 'bus-lookup',
  EXPERIMENTAL_LONGITUDINAL: 'experimental-longitudinal',
  DSU_ENABLED: 'dsu-enabled',
  BSM_ENABLED: 'bsm-enabled',
  PCM_CRUISE: 'pcm-cruise',
  // Capabilities
  MIN_STEERING_SPEED: 'min-steering-speed',
  FSR_LONGITUDINAL: 'fsr-longitudinal',
  FSR_STEERING: 'fsr-steering',
  LONGITUDINAL_CONTROL: 'longitudinal-control',
  SUPPORT_TYPE: 'support-type',
  AUTO_RESUME: 'auto-resume',
  STEERING_TORQUE: 'steering-torque',
  // Vehicle Metrics
  CURB_WEIGHT: 'curb-weight',
  WHEELBASE: 'wheelbase',
  STEER_RATIO: 'steer-ratio',
  CENTER_FRONT_RATIO: 'center-front-ratio',
  MAX_LATERAL_ACCEL: 'max-lateral-accel',
} as const

export const QUICK_NAV_SPECS = [
  // Technical Parameters
  { id: SPEC_ID.TIRE_STIFFNESS_FACTOR, label: 'Tire Stiffness Factor', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.TIRE_FRONT_STIFFNESS, label: 'Front Stiffness', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.TIRE_REAR_STIFFNESS, label: 'Rear Stiffness', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.ACTUATOR_DELAY, label: 'Actuator Delay', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.LIMIT_TIMER, label: 'Limit Timer', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.CONTROL_TYPE, label: 'Control Type', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.STOPPING_SPEED, label: 'Stopping Speed', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.STARTING_SPEED, label: 'Starting Speed', section: 'technical', category: 'Technical Parameters' },
  { id: SPEC_ID.STOP_ACCEL, label: 'Stop Accel', section: 'technical', category: 'Technical Parameters' },
  // System Configuration
  { id: SPEC_ID.NETWORK_LOCATION, label: 'Network Location', section: 'system', category: 'System Configuration' },
  { id: SPEC_ID.BUS_LOOKUP, label: 'Bus Lookup', section: 'system', category: 'System Configuration' },
  { id: SPEC_ID.EXPERIMENTAL_LONGITUDINAL, label: 'Experimental Longitudinal', section: 'system', category: 'System Configuration' },
  { id: SPEC_ID.DSU_ENABLED, label: 'DSU Enabled', section: 'system', category: 'System Configuration' },
  { id: SPEC_ID.BSM_ENABLED, label: 'BSM Enabled', section: 'system', category: 'System Configuration' },
  { id: SPEC_ID.PCM_CRUISE, label: 'PCM Cruise', section: 'system', category: 'System Configuration' },
  // Capabilities
  { id: SPEC_ID.MIN_STEERING_SPEED, label: 'Min Steering Speed', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.FSR_LONGITUDINAL, label: 'FSR Longitudinal', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.FSR_STEERING, label: 'FSR Steering', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.LONGITUDINAL_CONTROL, label: 'Longitudinal Control', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.SUPPORT_TYPE, label: 'Support Type', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.AUTO_RESUME, label: 'Auto Resume', section: 'capabilities', category: 'Capabilities' },
  { id: SPEC_ID.STEERING_TORQUE, label: 'Steering Torque', section: 'capabilities', category: 'Capabilities' },
  // Vehicle Metrics
  { id: SPEC_ID.CURB_WEIGHT, label: 'Curb Weight', section: 'vehicle-metrics', category: 'Vehicle Metrics' },
  { id: SPEC_ID.WHEELBASE, label: 'Wheelbase', section: 'vehicle-metrics', category: 'Vehicle Metrics' },
  { id: SPEC_ID.STEER_RATIO, label: 'Steer Ratio', section: 'vehicle-metrics', category: 'Vehicle Metrics' },
  { id: SPEC_ID.CENTER_FRONT_RATIO, label: 'Center to Front Ratio', section: 'vehicle-metrics', category: 'Vehicle Metrics' },
  { id: SPEC_ID.MAX_LATERAL_ACCEL, label: 'Max Lateral Accel', section: 'vehicle-metrics', category: 'Vehicle Metrics' },
] as const

// Group specs by category for navigation rendering (computed once at module load)
export const NAV_CATEGORIES = QUICK_NAV_SPECS.reduce((acc, spec) => {
  if (!acc[spec.category]) acc[spec.category] = []
  acc[spec.category].push(spec)
  return acc
}, {} as Record<string, typeof QUICK_NAV_SPECS[number][]>)

// Helper: Get the section ID for a given spec ID
export const getSpecSection = (specId: string): string | undefined => {
  return QUICK_NAV_SPECS.find(spec => spec.id === specId)?.section
}

// Helper: Get highlight classes for a spec element
export const getHighlightClasses = (specId: string, highlightedSpec: string | null): string => {
  return highlightedSpec === specId
    ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2'
    : ''
}

