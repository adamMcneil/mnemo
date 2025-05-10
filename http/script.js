import http from 'k6/http';
import ws from 'k6/ws';
import { sleep } from 'k6';

export let options = {
	vus: 1,       // virtual users
	duration: '10s',
	// noConnectionReuse: true,
};

export default function() {
	http.post('http://172.22.150.210:3000/api/movement');
	sleep(1.0 / 60.0);
}

export function handleSummary(data) {
	const metrics = data.metrics;
	const vus = data.metrics['vus']?.values?.value || 0;
	const vusMax = data.metrics['vus_max']?.values?.value || 0;

	return {
		'summary.json': JSON.stringify(
			{
				latency: {
					avg: metrics.http_req_duration.values.avg,
					min: metrics.http_req_duration.values.min,
					max: metrics.http_req_duration.values.max,
					p95: metrics.http_req_duration.values["p(95)"],
				},
				http_req_blocked: {
					avg: metrics.http_req_blocked.values.avg,
					max: metrics.http_req_blocked.values.max,
				},
				http_req_connecting: {
					avg: metrics.http_req_connecting.values.avg,
					max: metrics.http_req_connecting.values.max,
				},
				http_req_failed: {
					rate: metrics.http_req_failed.values.rate,
					fails: metrics.http_req_failed.values.fails,
				},
				vus,
				vus_max: vusMax,
			},
			null,
			2 // pretty-print with 2-space indentation
		),
	};
}
