import json
import matplotlib.pyplot as plt
import seaborn as sns

# Load JSON data
with open('combined_results.json') as f:
    data = json.load(f)

# Extract data
vus = [entry['vus'] for entry in data]
avg_durations = [entry['latency']['avg'] for entry in data]
p95_durations = [entry['latency']['p95'] for entry in data]
max_durations = [entry['latency']['max'] for entry in data]

# Plot
sns.set(style="whitegrid")
plt.figure(figsize=(10, 6))

plt.plot(vus, avg_durations, marker='o', label='Avg Duration (ms)')
plt.plot(vus, p95_durations, marker='x', label='95th Percentile (ms)')
plt.plot(vus, max_durations, marker='s', label='Max Duration (ms)')

plt.title("HTTP Request Latency vs Number of Virtual Users (VUs)")
plt.xlabel("Number of VUs")
plt.ylabel("Latency (ms)")
plt.legend()
plt.tight_layout()
plt.grid(True)
plt.show()
