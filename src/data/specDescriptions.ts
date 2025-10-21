import { SPEC_ID } from './quickNavSpecs'

type SpecIdValue = typeof SPEC_ID[keyof typeof SPEC_ID]

export const DESCRIPTIONS: Record<SpecIdValue, string> = {
  // Compatibility Info
  [SPEC_ID.SUPPORT_TYPE_BADGE]: `The level of openpilot support for this vehicle. 'Upstream' indicates full official support with active
maintenance, while other types may have varying levels of functionality and community support.`,

  [SPEC_ID.ADAS_PACKAGE]: `The required ADAS package/trim that needs to comes with this vehicle to be compatible with openpilot.`,

  [SPEC_ID.FINGERPRINT]: `The unique identifier openpilot uses to detect and configure itself for this specific
vehicle model. This fingerprint is based on CAN message patterns and ensures proper compatibility.`,

  [SPEC_ID.HARNESS]: `Type of car harness that is compatible with this vehicle. comma's car harness is a universal interface to your car.
Use the car harness to connect your comma device to your vehicle.`,

  // Technical Parameters
  [SPEC_ID.TIRE_STIFFNESS_FACTOR]: `A multiplier applied to the tire stiffness values to adjust handling characteristics. This factor
fine-tunes how the vehicle's tires respond to steering inputs and road conditions.`,

  [SPEC_ID.TIRE_FRONT_STIFFNESS]: `The cornering stiffness of the front tires measured in N/rad. Higher values indicate stiffer tires that
resist lateral deformation more, affecting steering response and front-end grip.`,

  [SPEC_ID.TIRE_REAR_STIFFNESS]: `The cornering stiffness of the rear tires measured in N/rad. This value affects rear-end stability and
the vehicle's tendency to understeer or oversteer during cornering.`,

  [SPEC_ID.ACTUATOR_DELAY]: `The time delay between when openpilot sends a steering command and when the vehicle's steering actuator
responds. This accounts for mechanical and electrical latency in the steering system.`,

  [SPEC_ID.LIMIT_TIMER]: `The duration for which steering torque limits are enforced before the system may request reduced steering
authority. This prevents sustained excessive steering commands that could trigger safety interventions.`,

  [SPEC_ID.CONTROL_TYPE]: `The method openpilot uses to control steering. 'Torque' control commands steering wheel torque directly, while
'angle' control commands specific steering angles. Most vehicles use torque-based control.`,

  [SPEC_ID.STOPPING_SPEED]: `The speed threshold below which the vehicle is considered stopped. This is used to determine when to apply
different control strategies, such as holding the vehicle at a complete stop.`,

  [SPEC_ID.STARTING_SPEED]: `The speed threshold above which the vehicle is considered moving after a stop. This hysteresis prevents rapid
toggling between stopped and moving states when the vehicle is barely moving.`,

  [SPEC_ID.STOP_ACCEL]: `The deceleration rate applied when bringing the vehicle to a stop. This negative acceleration value determines
how aggressively the vehicle brakes when coming to a complete stop.`,

  // System Configuration
  [SPEC_ID.NETWORK_LOCATION]: `Specifies which CAN gateway the comma device connects to.`,

  [SPEC_ID.BUS_LOOKUP]: `Maps message types to physical CAN bus numbers. For example, 'pt' (powertrain) messages on bus 0, 'radar' messages
on bus 1. This tells openpilot which physical CAN bus carries each type of vehicle data.`,

  [SPEC_ID.EXPERIMENTAL_LONGITUDINAL]: `If vehicle supports experimental mode's longitudinal control and is enabled, openpilot will drive
the speed that the model thinks a human would drive. This includes slowing down for turns, stopping at stop signs and traffic lights, etc.`,

  [SPEC_ID.DSU_ENABLED]: `Toyota-specific: The DSU (Driving Support Unit) is the radar/ACC module on pre-TSS2 Toyotas. When enabled,
openpilot sends longitudinal control commands through the DSU instead of directly to the PCM. Only relevant for certain Toyota models.`,

  [SPEC_ID.BSM_ENABLED]: `Indicates if the vehicle has BSM (Blind Spot Monitoring) capability that openpilot can read from the CAN bus.`,

  [SPEC_ID.PCM_CRUISE]: `Indicates if the vehicle uses PCM (Powertrain Control Module) cruise control vs camera-based cruise. PCM cruise
is the traditional setup where the engine computer handles cruise control. This affects which CAN messages openpilot uses for
longitudinal control.`,

  // Capabilities
  [SPEC_ID.MIN_STEERING_SPEED]: `The minimum speed at which openpilot can provide steering assistance. Below this speed, the driver must
steer manually.`,

  [SPEC_ID.FSR_LONGITUDINAL]: `Full Self-Driving Capability longitudinal speed threshold. The minimum speed for longitudinal
(acceleration/braking) control in FSR mode.`,

  [SPEC_ID.FSR_STEERING]: `Full Self-Driving Capability steering speed threshold. The minimum speed for steering control in FSR mode.`,

  [SPEC_ID.LONGITUDINAL_CONTROL]: `The system responsible for acceleration and braking control. 'openpilot' means full longitudinal
control, while other values may indicate limited or no longitudinal control.`,

  [SPEC_ID.SUPPORT_TYPE]: `The level of openpilot support for this vehicle. 'Upstream' indicates full official support, while other types
may have varying levels of functionality.`,

  [SPEC_ID.AUTO_RESUME]: `Whether openpilot can automatically resume driving after coming to a complete stop, without driver intervention.`,

  [SPEC_ID.STEERING_TORQUE]: `Information about the steering torque characteristics or limitations for this vehicle. 'Empty' typically
means no specific torque data is available.`,

  // Vehicle Metrics
  [SPEC_ID.CURB_WEIGHT]: `The weight of the vehicle without passengers or cargo, including all fluids and a full tank of fuel.`,

  [SPEC_ID.WHEELBASE]: `The distance between the centers of the front and rear wheels. A longer wheelbase typically provides better
stability at high speeds.`,

  [SPEC_ID.STEER_RATIO]: `The ratio between the steering wheel angle and the front wheel angle. A higher ratio means more steering wheel
turns are needed for the same wheel angle.`,

  [SPEC_ID.CENTER_FRONT_RATIO]: `The ratio of the distance from the center of gravity to the front axle versus the total wheelbase. Affects
weight distribution and handling characteristics.`,

  [SPEC_ID.MAX_LATERAL_ACCEL]: `The maximum lateral acceleration the vehicle can sustain during cornering before losing traction. Higher
values indicate better cornering capability.`,
}

