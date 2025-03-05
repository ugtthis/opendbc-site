import cars from '../data/car_data.json';

export type Car = typeof cars[number];

// Optional: You can still document the shape with a separate interface
export interface CarDocumentation {
  // Basic Information
  name: string;
  make: string;
  model: string;
  years: string;
  year_list: string[];
  package: string;
  requirements: string | null;
  video_link: string | null;
  footnotes: string[];

  // Performance and Features
  min_steer_speed: number;
  min_enable_speed: number;
  auto_resume: boolean;
  car_parts: string[];
  detailed_parts?: {
    count: number;
    name: string;
    type: string;
    enum_name: string;
  }[];
  harness: string | null;
  merged: boolean;
  support_type: string;
  support_link: string;
  detail_sentence: string;
  mass: number;
  wheelbase: number;
  steer_ratio: number;

  // Identification
  car_name: string;
  car_fingerprint: string;

  // Capabilities
  longitudinal: string;
  fsr_longitudinal: string;
  fsr_steering: string;
  steering_torque: string;
  auto_resume_star: string;

  // Hardware
  hardware: string;
  video: string | null;

  // Technical Parameters
  center_to_front_ratio: number;
  max_lateral_accel: number;
  tire_stiffness_factor: number;
  tire_stiffness_front: number;
  tire_stiffness_rear: number;
  steer_actuator_delay: number;
  steer_limit_timer: number;
  steer_control_type: string;
  vEgo_stopping: number;
  vEgo_starting: number;
  stop_accel: number;

  // System Configuration
  network_location: string;
  transmissionType: string;
  bus_lookup: Record<string, string>;
  experimental_longitudinal_available: boolean;
  enable_dsu: boolean;
  enable_bsm: boolean;
  pcm_cruise: boolean;

  // Control Capabilities
  has_lat_control: boolean | null;
  has_long_control: boolean | null;
  has_auto_resume: boolean | null;
  has_stop_and_go: boolean | null;
  has_steering_control: boolean | null;
  has_acc_long: boolean | null;
  has_acc_cruise: boolean | null;
  has_nda: boolean | null;

  // Customization Flags
  has_custom_torque: boolean | null;
  has_custom_lat_controller: boolean | null;
  has_custom_long_controller: boolean | null;
  has_custom_car_controller: boolean | null;
  has_custom_interface: boolean | null;
  has_custom_radar_interface: boolean | null;
  has_custom_hud: boolean | null;
  has_custom_ui: boolean | null;
  has_custom_ui_control: boolean | null;
  has_custom_ui_buttons: boolean | null;
  has_custom_ui_alerts: boolean | null;
  has_custom_ui_extras: boolean | null;
  has_custom_ui_sounds: boolean | null;
  has_custom_ui_status: boolean | null;
}
