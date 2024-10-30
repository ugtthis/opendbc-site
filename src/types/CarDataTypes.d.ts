export interface Car {
  // Basic Information
  name: string;
  make: string;
  model: string;
  years: string;
  year_list: string[];
  package: string;
  requirements: string | null;
  video_link: string | null;
  footnotes: number[];

  // Performance and Features
  min_steer_speed: number;
  min_enable_speed: number;
  auto_resume: boolean;
  car_parts: string[];
  harness: string | null;
  merged: boolean;
  support_type: string;
  support_link: string;
  detail_sentence: string;

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

  // Control Capabilities
  tire_stiffness_factor: number | null;
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
