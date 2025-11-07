#!/usr/bin/env python3
import json
import re
import ssl
import urllib.request

OPENDBC_DATA_README = "https://raw.githubusercontent.com/commaai/opendbc-data/master/README.md"
GITHUB_PAGES_BASE = "https://commaai.github.io/opendbc-data"


def fetch_readme():
  """Fetch README from GitHub (with SSL fallback for local dev)."""
  try:
    return urllib.request.urlopen(OPENDBC_DATA_README).read().decode('utf-8')
  except urllib.error.URLError as e:
    if "CERTIFICATE_VERIFY_FAILED" in str(e):
      print("Using unverified SSL for local dev")
      context = ssl._create_unverified_context()
      return urllib.request.urlopen(OPENDBC_DATA_README, context=context).read().decode('utf-8')
    raise


def parse_reports(readme_text):
  """Extract platform -> [reports] mapping from README table."""
  # Find table: ## Longitudinal maneuver reports\n| Platform | Desc | Report |
  table_match = re.search(
    r'## Longitudinal maneuver reports\s*\n\s*\|.*?\n\|.*?\n((?:\|.*?\n)+)',
    readme_text,
    re.MULTILINE
  )
  if not table_match:
    return {}

  reports = {}
  for row in table_match.group(1).strip().split('\n'):
    # Parse: | PLATFORM | description | [View](path.html) |
    cols = [c.strip() for c in row.split('|')[1:-1]]
    if len(cols) != 3:
      continue

    platform, description, link_cell = cols

    # Extract path from [View](path)
    link_match = re.search(r'\[.*?\]\((.*?)\)', link_cell)
    if not link_match:
      continue

    if platform not in reports:
      reports[platform] = []
    reports[platform].append({
      "description": description,
      "link": f"{GITHUB_PAGES_BASE}/{link_match.group(1)}"
    })

  return reports


def main():
  readme = fetch_readme()
  reports = parse_reports(readme)

  if not reports:
    raise ValueError("No reports found - README format may have changed")

  with open("longitudinal_reports.json", 'w') as f:
    json.dump(reports, f, indent=2, sort_keys=True)

  total = sum(len(r) for r in reports.values())
  print(f"✅ {total} reports across {len(reports)} platforms")


if __name__ == "__main__":
  main()
