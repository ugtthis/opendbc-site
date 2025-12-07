#!/usr/bin/env python3
import json
import os
import sys
from typing import Any
from opendbc.car.docs import get_all_car_docs, get_params_for_docs
from opendbc.car.docs_definitions import CarDocs, Tool, BaseCarHarness, Column
from opendbc.car.values import PLATFORMS


def extract_metadata(car_doc: CarDocs) -> dict[str, Any] | None:
  try:
    platform = PLATFORMS.get(car_doc.car_fingerprint)
    if not platform:
      return None

    CP = get_params_for_docs(platform)

    # Handle special cases from comma body
    min_steer_speed = None if car_doc.min_steer_speed == float("-inf") else car_doc.min_steer_speed
    max_lateral_accel = None if getattr(CP, "maxLateralAccel", None) == float("inf") else getattr(CP, "maxLateralAccel", None)

    model_metadata = {
      "name": car_doc.name,
      "make": car_doc.make,
      "model": car_doc.model,
      "years": car_doc.years,
      "year_list": car_doc.year_list,
      "package": car_doc.package,
      "video": car_doc.video,
      "setup_video": car_doc.setup_video,
      "footnotes": [fn.value.text for fn in car_doc.footnotes] if car_doc.footnotes else [],
      "min_steer_speed": min_steer_speed,
      "min_enable_speed": car_doc.min_enable_speed,
      "auto_resume": car_doc.auto_resume,
      "merged": car_doc.merged,
      "support_type": car_doc.support_type.value,
      "support_link": car_doc.support_link,
      "detail_sentence": car_doc.detail_sentence,
      "car_fingerprint": car_doc.car_fingerprint,
      "brand": car_doc.brand, # The parent company
      "buy_link": f"https://comma.ai/shop/comma-four?harness={car_doc.name.replace(' ', '%20')}",

      # Capability info
      "longitudinal": car_doc.row.get(Column.LONGITUDINAL),
      "fsr_longitudinal": car_doc.row.get(Column.FSR_LONGITUDINAL, "0 mph"),
      "fsr_steering": car_doc.row.get(Column.FSR_STEERING, "0 mph"),
      "steering_torque": car_doc.row[Column.STEERING_TORQUE].value,
      "auto_resume_star": "full" if car_doc.auto_resume else "empty",

      # CarParams
      "mass": CP.mass, # Includes STD_CARGO_KG = 136
      "wheelbase": CP.wheelbase,
      "steer_ratio": CP.steerRatio,
      "radar_delay": CP.radarDelay,
      "wheel_speed_factor": CP.wheelSpeedFactor,
      "start_accel": CP.startAccel,
      "steer_actuator_delay": CP.steerActuatorDelay,
      "steer_ratio_rear": CP.steerRatioRear,
      "steer_limit_timer": CP.steerLimitTimer,
      "tire_stiffness_factor": CP.tireStiffnessFactor,
      "tire_stiffness_front": CP.tireStiffnessFront,
      "tire_stiffness_rear": CP.tireStiffnessRear,
      "rotational_inertia": CP.rotationalInertia,
      "experimental_longitudinal_available": CP.alphaLongitudinalAvailable,
      "openpilot_longitudinal_control": CP.openpilotLongitudinalControl,
      "dashcam_only": CP.dashcamOnly,
      "enable_bsm": CP.enableBsm,
      "pcm_cruise": CP.pcmCruise,
      "flags": CP.flags,
      "auto_resume_sng": CP.autoResumeSng,
      "radarUnavailable": CP.radarUnavailable,
      "passive": CP.passive,
      "stopping_decel_rate": CP.stoppingDecelRate,
      "vEgo_stopping": CP.vEgoStopping,
      "vEgo_starting": CP.vEgoStarting,
      "stop_accel": CP.stopAccel,
      "longitudinal_actuator_delay": CP.longitudinalActuatorDelay,
      "max_lateral_accel": max_lateral_accel,
      "network_location": str(getattr(CP, "networkLocation", None)),
      "steer_control_type": str(CP.steerControlType),

      # Platform Config
      "mass_curb_weight": platform.config.specs.mass,
      "center_to_front_ratio_base": platform.config.specs.centerToFrontRatio,
      "bus_lookup": platform.config.dbc_dict,
      "min_steer_speed_base": platform.config.specs.minSteerSpeed,
      "min_enable_speed_base": platform.config.specs.minEnableSpeed,
      "tire_stiffness_factor_base": platform.config.specs.tireStiffnessFactor,
      "center_to_front_ratio": platform.config.specs.centerToFrontRatio,
    }

    # Parts info
    all_parts = car_doc.car_parts.all_parts() if car_doc.car_parts and car_doc.car_parts.parts else []
    parts = [p for p in all_parts if not isinstance(p, Tool)]
    tools = [p for p in all_parts if isinstance(p, Tool)]

    model_metadata.update({
      "harness": next((p.name for p in all_parts if isinstance(p.value, BaseCarHarness)), None),
      "tools_required": [{"name": t.value.name, "count": tools.count(t)} for t in dict.fromkeys(tools)],
      "parts": [{"name": p.value.name, "type": p.part_type.name, "count": parts.count(p)} for p in dict.fromkeys(parts)],
    })

    return model_metadata
  except Exception as e:
    print(f"{car_doc.name}: {e}", file=sys.stderr)
    return None


if __name__ == "__main__":
  upstream_only = "--upstream" in sys.argv

  all_cars = get_all_car_docs()
  if upstream_only:
    excluded_types = ["Not compatible", "Community"]
    all_cars = [car for car in all_cars if car.support_type.value not in excluded_types]

  metadata = [data for car_doc in all_cars if (data := extract_metadata(car_doc)) is not None]
  metadata.sort(key=lambda car: (car.get("make") or "", car.get("model") or ""))

  if len(metadata) == 0:
    print("No cars extracted", file=sys.stderr)
    sys.exit(1)

  filename = "metadata.json"
  with open(filename, "w") as f:
    json.dump(metadata, f, indent=2, ensure_ascii=False)

  print(f"Generated {len(metadata)}/{len(all_cars)} cars and written to {os.path.abspath(filename)}")
