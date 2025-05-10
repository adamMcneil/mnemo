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
sns.set_context("notebook", font_scale=1.25)
fig, axes = plt.subplots(rows, cols, figsize=(cols * 6, rows * 4))
axes = axes.flatten()  # Flatten to 1D array for easy indexing

file_list = [
    "ws_global.json",
    "ws_lan.json",
    "ws_machine.json",
    "http_global.json",
    "http_lan.json",
    "http_machine.json",
]

for i, filename in enumerate(file_list):
    filepath = os.path.join(directory, filename)
    print(filepath)
    with open(filepath) as f:
        data = json.load(f)

    # Extract data
    vus = [entry['vus_max'] for entry in data]
    avg_durations = [entry['latency']['avg'] for entry in data]
    p95_durations = [entry['latency']['p95'] for entry in data]
    # max_durations = [entry['latency']['max'] for entry in data]

    ax = axes[i%3]
    http = True
    if (i < 3):
        http = False

    if http:
        ax.plot(vus, avg_durations, marker='o', label='Avg http', color='red')
        ax.plot(vus, p95_durations, marker='x', label='P95 http', color='red')
    else:
        ax.plot(vus, avg_durations, marker='.', label='Avg ws', color='blue')
        ax.plot(vus, p95_durations, marker='X', label='P95 ws', color='blue')

    # ax.plot(vus, max_durations, marker='s', label='Max')
    if (i == 0):
        ax.set_title(filename)
    elif (i == 1):
        ax.set_title("Latency vs VUs connected with LAN")
    elif (i == 2):
        ax.set_title("Latency vs VUs on the same machine")

    ax.set_xlabel("# of VUs")
    ax.set_ylabel("Latency (ms)")
    ax.legend()
    ax.grid(True)

# Hide any unused subplots
plt.tight_layout()
plt.show()
