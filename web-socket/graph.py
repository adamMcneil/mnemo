import pandas as pd
import matplotlib.pyplot as plt

x = 100
# Read the file and parse timestamps
recv = pd.read_csv('recieved-1743195755769.log', names=['time'])
sent = pd.read_csv('sent-1743195755769.log', names=['time'])

# Group by second and count messages
recv = recv['time'].astype(int)
sent = sent['time'].astype(int)
min = recv.min()
recv = recv.sub(min)
sent = sent.sub(min)
min = recv.min()
max = sent.max()

recv_group = pd.cut(recv, bins=range(min, max+x, x), right=False)
sent_group = pd.cut(sent, bins=range(min, max+x, x), right=False)

recv_counts = pd.value_counts(recv_group).sort_index()
recv_labels = [interval.left + (x/2) for interval in recv_counts.index]

sent_counts = pd.value_counts(sent_group).sort_index()
sent_labels = [interval.left + (x/2) for interval in sent_counts.index]

plt.plot(recv_labels, recv_counts.values, marker='o', linestyle='-')
plt.plot(sent_labels, sent_counts.values, marker='o', linestyle='-')

plt.xlabel("Time Ranges (Midpoints)")
plt.ylabel("Number of Messages")
plt.title("Distribution of Times Grouped by 100s")
plt.ylim(bottom=0)
plt.grid(True)
plt.show()

