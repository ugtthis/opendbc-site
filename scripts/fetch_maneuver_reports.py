#!/usr/bin/env python3
"""Fetch longitudinal or lateral maneuver reports from commaai/opendbc-data README into JSON."""

import argparse
import json
import re
import ssl
import sys
import urllib.request

OPENDBC_DATA_README = "https://raw.githubusercontent.com/commaai/opendbc-data/master/README.md"
GITHUB_PAGES_BASE = "https://commaai.github.io/opendbc-data"

KINDS = {
  "longitudinal": ("Longitudinal", "longitudinal_reports.json"),
  "lateral": ("Lateral", "lateral_reports.json"),
}


def fetch_readme():
  try:
    return urllib.request.urlopen(OPENDBC_DATA_README).read().decode('utf-8')
  except urllib.error.URLError as e:
    if "CERTIFICATE_VERIFY_FAILED" in str(e):
      print("Using unverified SSL for local dev", file=sys.stderr)
      context = ssl._create_unverified_context()
      return urllib.request.urlopen(OPENDBC_DATA_README, context=context).read().decode('utf-8')
    raise


def parse_reports_for_section(readme_text: str, section_name: str) -> dict:
  table_match = re.search(
    rf'## {re.escape(section_name)} maneuver reports\s*\n\s*\|.*?\n\|.*?\n((?:\|.*?\n)+)',
    readme_text,
    re.MULTILINE,
  )
  if not table_match:
    return {}

  reports = {}
  for row in table_match.group(1).strip().split('\n'):
    cols = [c.strip() for c in row.split('|')[1:-1]]
    if len(cols) != 3:
      continue

    platform, description, link_cell = cols
    link_match = re.search(r'\[.*?\]\((.*?)\)', link_cell)
    if not link_match:
      continue

    if platform not in reports:
      reports[platform] = []
    reports[platform].append({
      "description": description,
      "link": f"{GITHUB_PAGES_BASE}/{link_match.group(1)}",
    })

  return reports


def main() -> None:
  parser = argparse.ArgumentParser()
  group = parser.add_mutually_exclusive_group(required=True)
  group.add_argument(
    "--longitudinal",
    action="store_const",
    const="longitudinal",
    dest="report_kind",
  )
  group.add_argument(
    "--lateral",
    action="store_const",
    const="lateral",
    dest="report_kind",
  )
  args = parser.parse_args()

  section_name, out_name = KINDS[args.report_kind]
  readme = fetch_readme()
  reports = parse_reports_for_section(readme, section_name)

  if not reports:
    raise SystemExit("No reports found - README format may have changed")

  with open(out_name, 'w') as f:
    json.dump(reports, f, indent=2, sort_keys=True)

  total = sum(len(r) for r in reports.values())
  print(f"✅ {total} reports across {len(reports)} platforms")


if __name__ == "__main__":
  main()
