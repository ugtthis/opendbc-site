import json
import subprocess
import sys
from collections import defaultdict
from os import environ
from pathlib import Path

METADATA_PATH = "src/data/metadata.json"

updated_metadata = json.loads(Path(METADATA_PATH).read_text())

try:
    committed_metadata = json.loads(subprocess.check_output(["git", "show", f"HEAD:{METADATA_PATH}"], text=True))
except subprocess.CalledProcessError:
    sys.exit(0)

summary = ""

if len(updated_metadata) == len(committed_metadata):
    committed_cars = {car["name"]: car for car in committed_metadata if car.get("name")}
    updated_cars   = {car["name"]: car for car in updated_metadata   if car.get("name")}

    spec_changes = [
        (updated_cars[name].get("car_fingerprint") or "UNKNOWN", name)
        for name in sorted(set(committed_cars) & set(updated_cars))
        if committed_cars[name] != updated_cars[name]
    ]

    if spec_changes:
        cars_by_platform = defaultdict(list)
        for platform, car_name in spec_changes:
            cars_by_platform[platform].append(car_name)

        lines = [f"Spec changes in {len(spec_changes)} car(s) across {len(cars_by_platform)} platform(s):"]
        for platform in sorted(cars_by_platform):
            lines.append(f"- {platform}: {', '.join(sorted(cars_by_platform[platform]))}")
        summary = "\n".join(lines)

with Path(environ["GITHUB_OUTPUT"]).open("a") as github_output:
    github_output.write(f"changed_summary<<EOF\n{summary}\nEOF\n")
