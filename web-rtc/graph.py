import pandas as pd
import matplotlib.pyplot as plt

def plot_rtc(file_name):
    x = 100
    # Read the file and parse timestamps
    recv = pd.read_csv(file_name, names=['time'])
    # Group by second and count messages
    print(recv)
    recv = recv['time'].astype(int)
    print(recv)
    min = recv.min()
    recv = recv.sub(min)
    min = recv.min()
    max = recv.max()

    recv_group = pd.cut(recv, bins=range(min, max+x, x), right=False)

    recv_counts = pd.value_counts(recv_group).sort_index()
    recv_labels = [(interval.left + (x/2))/x for interval in recv_counts.index]
    plt.plot(recv_labels, recv_counts.values, marker='o', linestyle='-')

plot_rtc('recv.data')

plt.xlabel("Time Ranges (Midpoints)")
plt.ylabel("Number of Messages")
plt.title("Distribution of Times Grouped by 100s")
plt.ylim(bottom=0)
plt.grid(True)
plt.show()
