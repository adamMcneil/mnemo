import pandas as pd
import matplotlib.pyplot as plt

def plot_rtc(file_name):
    x = 100
    # Read the file and parse timestamps
    recv = pd.read_csv(file_name, names=['time'])

    # Group by second and count messages
    recv = recv['time'].astype(int)
    min = recv.min()
    recv = recv.sub(min)
    min = recv.min()
    max = recv.max()

    recv_group = pd.cut(recv, bins=range(min, max+x, x), right=False)

    recv_counts = pd.value_counts(recv_group).sort_index()
    recv_labels = [interval.left + (x/2) for interval in recv_counts.index]
    plt.plot(recv_labels, recv_counts.values, marker='o', linestyle='-', label='WebRTC')

def plot_socket(recv_name, sent_name):
    x = 100
    # Read the file and parse timestamps
    recv = pd.read_csv(recv_name, names=['time'])
    sent = pd.read_csv(sent_name, names=['time'])

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

    plt.plot(recv_labels, recv_counts.values, marker='o', linestyle='-', label='WebSocket')
    # plt.plot(sent_labels, sent_counts.values, marker='o', linestyle='-')

plot_socket('web-socket/recieved-1743195755769.log', 'web-socket/sent-1743195755769.log')
plot_rtc('web-rtc/recv.log')
plt.xlabel("Time Ranges (Midpoints)")
plt.ylabel("Number of Messages")
plt.title("Distribution of Times Grouped by 100s")
plt.ylim(bottom=0)
plt.grid(True)
plt.legend(loc='upper left')
plt.show()

