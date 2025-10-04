/**
 * Quick Navigation Configuration
 *
 * Defines all navigable specs in the car detail page.
 * This file is pure data and helper functions - no UI, no state, no side effects.
 *
 * Usage:
 * - SPEC_ID: Use for HTML element IDs throughout the car detail page
 * - QUICK_NAV_SPECS: Configuration for the navigation sidebar
 * - SPECS_GROUPED_BY_CATEGORY: Grouped specs for rendering navigation sections
 * - getAccordionIdForSpec: Lookup which accordion section contains a spec
 * - getHighlightClasses: Generate CSS classes for highlighting
 */

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
  { id: SPEC_ID.TIRE_STIFFNESS_FACTOR, buttonLabel: 'Tire Stiffness Factor', accordionId: 'technical', uiSectionHeader: 'Technical Parameters' },
  { id: SPEC_ID.TIRE_FRONT_STIFFNESS, buttonLabel: 'Front Stiffness', accordionId: 'technical', uiSectionHeader: 'Technical Parameters' },
  { id: SPEC_ID.TIRE_REAR_STIFFNESS, buttonLabel: 'Rear Stiffness', accordionId: 'technical', uiSectionHeader: 'Technical Parameters' },
  { id: SPEC_ID.ACTUATOR_DELAY, buttonLabel: 'Actuator Delay', accordionId: 'technical', uiSectionHeader: 'Technical Parameters' },
  { id: SPEC_ID.LIMIT_TIMER, buttonLabel: 'Limit Timer', accordionId: 'technical', uiSectionHeader: 'Technical Parameters' },
  { id: SPEC_ID.CONTROL_TYPE, buttonLabel: 'Control Type', accordionId: 'technical', uiSectionHeader: 'Technical Parameters' },
  { id: SPEC_ID.STOPPING_SPEED, buttonLabel: 'Stopping Speed', accordionId: 'technical', uiSectionHeader: 'Technical Parameters' },
  { id: SPEC_ID.STARTING_SPEED, buttonLabel: 'Starting Speed', accordionId: 'technical', uiSectionHeader: 'Technical Parameters' },
  { id: SPEC_ID.STOP_ACCEL, buttonLabel: 'Stop Accel', accordionId: 'technical', uiSectionHeader: 'Technical Parameters' },
  // System Configuration
  { id: SPEC_ID.NETWORK_LOCATION, buttonLabel: 'Network Location', accordionId: 'system', uiSectionHeader: 'System Configuration' },
  { id: SPEC_ID.BUS_LOOKUP, buttonLabel: 'Bus Lookup', accordionId: 'system', uiSectionHeader: 'System Configuration' },
  { id: SPEC_ID.EXPERIMENTAL_LONGITUDINAL, buttonLabel: 'Experimental Longitudinal', accordionId: 'system', uiSectionHeader: 'System Configuration' },
  { id: SPEC_ID.DSU_ENABLED, buttonLabel: 'DSU Enabled', accordionId: 'system', uiSectionHeader: 'System Configuration' },
  { id: SPEC_ID.BSM_ENABLED, buttonLabel: 'BSM Enabled', accordionId: 'system', uiSectionHeader: 'System Configuration' },
  { id: SPEC_ID.PCM_CRUISE, buttonLabel: 'PCM Cruise', accordionId: 'system', uiSectionHeader: 'System Configuration' },
  // Capabilities
  { id: SPEC_ID.MIN_STEERING_SPEED, buttonLabel: 'Min Steering Speed', accordionId: 'capabilities', uiSectionHeader: 'Capabilities' },
  { id: SPEC_ID.FSR_LONGITUDINAL, buttonLabel: 'FSR Longitudinal', accordionId: 'capabilities', uiSectionHeader: 'Capabilities' },
  { id: SPEC_ID.FSR_STEERING, buttonLabel: 'FSR Steering', accordionId: 'capabilities', uiSectionHeader: 'Capabilities' },
  { id: SPEC_ID.LONGITUDINAL_CONTROL, buttonLabel: 'Longitudinal Control', accordionId: 'capabilities', uiSectionHeader: 'Capabilities' },
  { id: SPEC_ID.SUPPORT_TYPE, buttonLabel: 'Support Type', accordionId: 'capabilities', uiSectionHeader: 'Capabilities' },
  { id: SPEC_ID.AUTO_RESUME, buttonLabel: 'Auto Resume', accordionId: 'capabilities', uiSectionHeader: 'Capabilities' },
  { id: SPEC_ID.STEERING_TORQUE, buttonLabel: 'Steering Torque', accordionId: 'capabilities', uiSectionHeader: 'Capabilities' },
  // Vehicle Metrics
  { id: SPEC_ID.CURB_WEIGHT, buttonLabel: 'Curb Weight', accordionId: 'vehicle-metrics', uiSectionHeader: 'Vehicle Metrics' },
  { id: SPEC_ID.WHEELBASE, buttonLabel: 'Wheelbase', accordionId: 'vehicle-metrics', uiSectionHeader: 'Vehicle Metrics' },
  { id: SPEC_ID.STEER_RATIO, buttonLabel: 'Steer Ratio', accordionId: 'vehicle-metrics', uiSectionHeader: 'Vehicle Metrics' },
  { id: SPEC_ID.CENTER_FRONT_RATIO, buttonLabel: 'Center to Front Ratio', accordionId: 'vehicle-metrics', uiSectionHeader: 'Vehicle Metrics' },
  { id: SPEC_ID.MAX_LATERAL_ACCEL, buttonLabel: 'Max Lateral Accel', accordionId: 'vehicle-metrics', uiSectionHeader: 'Vehicle Metrics' },
] as const

// Group specs by UI section header for navigation rendering (computed once at module load)
export const SPECS_GROUPED_BY_CATEGORY = QUICK_NAV_SPECS.reduce((acc, spec) => {
  if (!acc[spec.uiSectionHeader]) acc[spec.uiSectionHeader] = []
  acc[spec.uiSectionHeader].push(spec)
  return acc
}, {} as Record<string, typeof QUICK_NAV_SPECS[number][]>)

// Helper: Get the accordion ID that contains a given spec
export const getAccordionIdForSpec = (specId: string): string | undefined => {
  return QUICK_NAV_SPECS.find(spec => spec.id === specId)?.accordionId
}

// Helper: Get highlight classes for a spec element
export const getHighlightClasses = (specId: string, highlightedSpec: string | null): string => {
  return highlightedSpec === specId
    ? 'bg-blue-50 border-2 border-blue-500 rounded px-2 -mx-2'
    : ''
}
