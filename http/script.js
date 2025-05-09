import http from 'k6/http';
import ws from 'k6/ws';
import { sleep } from 'k6';

export let options = {
	vus: 1000,       // virtual users
	duration: '1s',
	noConnectionReuse: true,
};

export default function() {
	http.post('http://localhost:3000/api/movement');
	sleep(1.0 / 60.0);
}

export function handleSummary(data) {
	const metrics = data.metrics;

	return {
		'summary.json': JSON.stringify(
			{
				http_req_duration: {
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
				vus: metrics.vus.values.value,
				iterations: metrics.iterations.values.count,
				duration_ms: data.state.testRunDurationMs
			},
			null,
			2 // pretty-print with 2-space indentation
		),
	};
}
