#!/bin/bash

# Empty or initialize the output file
echo "[" > combined_results.json

# List of VU counts
for vus in 1 10 25 50 75 100 150 200 ; do
  echo "Running test with $vus VUs..."
  k6 run script.js --vus $vus > /dev/null

  # Append summary.json into combined_results.json
  cat summary.json >> combined_results.json

  # Add a comma unless it's the last run
  if [ "$vus" != "100" ]; then
    echo "," >> combined_results.json
  fi
done

# Close the JSON array
echo "]" >> combined_results.json
