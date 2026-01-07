#!/bin/bash
# Calculate duration between ISO timestamp and now
# Usage: duration.sh "2026-01-06T12:00:00.000Z"
# Output: "1h 23m" or "45m"

start_iso="$1"

if [[ -z "$start_iso" ]]; then
  echo "Usage: duration.sh <iso-timestamp>"
  exit 1
fi

# Strip milliseconds and Z suffix for parsing
start_clean="${start_iso%.*}"
start_clean="${start_clean%Z}"

# Get current time in seconds
now=$(date -u +%s)

# Parse start time (macOS/BSD vs Linux/GNU)
if date -j &>/dev/null; then
  # macOS/BSD
  start_epoch=$(date -j -u -f "%Y-%m-%dT%H:%M:%S" "$start_clean" +%s 2>/dev/null)
else
  # Linux/GNU
  start_epoch=$(date -u -d "${start_clean}" +%s 2>/dev/null)
fi

if [[ -z "$start_epoch" ]]; then
  echo "Error: Could not parse timestamp"
  exit 1
fi

# Calculate difference
diff=$((now - start_epoch))

# Handle negative (clock skew or future timestamp)
if [[ $diff -lt 0 ]]; then
  diff=0
fi

hours=$((diff / 3600))
minutes=$(((diff % 3600) / 60))

# Format output
if [[ $hours -gt 0 ]]; then
  echo "${hours}h ${minutes}m"
else
  echo "${minutes}m"
fi
