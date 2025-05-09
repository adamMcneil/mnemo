#!/bin/bash

# Arg 1: "ws" or "http"
protocol_type=$1

# Arg 2: optional setting (not used in this snippet)
setting=$2

output_dir="json_data"

# Ensure output directory exists
mkdir -p "$output_dir"

# Empty or initialize the output file
echo "[" > "${output_dir}/${protocol_type}_${setting}.json"

# List of VU counts
for vus in 1 50 100 150 200 250 300 350 500; do
  echo "Running test with $vus VUs..."

  if [ "$protocol_type" == "http" ]; then
    k6 run script.js --vus $vus > /dev/null
  else
    k6 run ws-script.js --vus $vus > /dev/null
  fi

  # Append summary.json into combined_results.json
  cat summary.json >> "${output_dir}/${protocol_type}_${setting}.json"

  # Add a comma unless it's the last run
  if [ "$vus" != "500" ]; then
    echo "," >> "${output_dir}/${protocol_type}_${setting}.json"
  fi

  sleep 1
done

# Close the JSON array
echo "]" >> "${output_dir}/${protocol_type}_${setting}.json"
