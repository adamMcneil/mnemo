import json
import matplotlib.pyplot as plt
import seaborn as sns
import os
import sys
import math

# Get directory from command-line argument or default to current directory
directory = sys.argv[1] if len(sys.argv) > 1 else "."

# Filter for .json files in the directory
json_files = [f for f in os.listdir(directory) if f.endswith('.json')]
num_files = len(json_files)

# Set up subplot grid (auto square-ish layout)
cols = math.ceil(math.sqrt(num_files))
rows = math.ceil(num_files / cols)

sns.set(style="whitegrid")
fig, axes = plt.subplots(rows, cols, figsize=(cols * 6, rows * 4))
axes = axes.flatten()  # Flatten to 1D array for easy indexing

for i, filename in enumerate(json_files):
    filepath = os.path.join(directory, filename)
    print(filepath)
    with open(filepath) as f:
        data = json.load(f)

    # Extract data
    vus = [entry['vus_max'] for entry in data]
    avg_durations = [entry['latency']['avg'] for entry in data]
    p95_durations = [entry['latency']['p95'] for entry in data]
    # max_durations = [entry['latency']['max'] for entry in data]

    ax = axes[i]
    ax.plot(vus, avg_durations, marker='o', label='Avg')
    ax.plot(vus, p95_durations, marker='x', label='P95')
    # ax.plot(vus, max_durations, marker='s', label='Max')

    ax.set_title(filename)
    ax.set_xlabel("VUs")
    ax.set_ylabel("Latency (ms)")
    ax.legend()
    ax.grid(True)

# Hide any unused subplots
plt.tight_layout()
plt.show()
