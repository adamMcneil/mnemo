import ws from 'k6/ws';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

export const latencyTrend = new Trend('ws_message_latency', true);

export const options = {
	vus: 250,
	duration: '1s',
};


export default function() {
	const url = 'ws://172.22.154.230:8000';
	const params = { tags: { test_type: 'latency_measurement' } };
	const maxMessages = 1000;
	let messageId = 0;
	let startTime = 0;

	const res = ws.connect(url, params, function(socket) {

		socket.on('open', function() {
			startTime = Date.now();
			socket.send('hello')
		});

		socket.on('message', function(message) {
			if (messageId++ < maxMessages) {
				socket.close()
			}
			latencyTrend.add(Date.now() - startTime);
			startTime = Date.now()
			socket.send("hello");

		});
		socket.on('close');
	});
}

export function handleSummary(data) {
	const latency = data.metrics['ws_message_latency']?.values || {};
	const vus = data.metrics['vus']?.values?.value || 0;
	const vusMax = data.metrics['vus_max']?.values?.value || 0;

	return {
		'summary.json': JSON.stringify({
			latency: {
				avg: latency.avg,
				min: latency.min,
				med: latency.med,
				max: latency.max,
				p90: latency['p(90)'],
				p95: latency['p(95)'],
			},
			vus,
			vus_max: vusMax,
		}, null, 2),
	};
}
