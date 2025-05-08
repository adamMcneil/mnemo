const http = require('http');
const { performance } = require('perf_hooks');

const options = {
	hostname: 'localhost',
	port: 3000,
	path: '/api/movement',
	method: 'POST',
};

const numberOfMessages = 10000;

function timeMessages() {
	let startTime = performance.now();
	for (let i = 0; i < numberOfMessages; i++) {
		sendPost();
	}
	let endTime = performance.now();
	console.log(startTime)
	let latency = endTime - startTime;
	console.log(`Latency: ${latency.toFixed(2)} ms`);
}

function sendPost() {
	const req = http.request(options, (res) => {
		res.on('data', () => {
			// Consume response data to ensure 'end' event is triggered
		});

		res.on('end', () => {
		});
	});

	req.on('error', (error) => {
		console.error(`Error: ${error.message}`);
	});

	req.end();
}

timeMessages()
