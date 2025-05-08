const http = require('http');
const { performance } = require('perf_hooks');

const options = {
	hostname: 'localhost',
	port: 3000,
	path: '/api/movement',
	method: 'POST',
};
console.log(process.argv)
const numberOfMessages = parseInt(process.argv[2]);

function timeMessages() {
	for (let i = 0; i < numberOfMessages; i++) {
		sendPost();
	}
}

function sendPost() {
	let startTime = performance.now();
	const req = http.request(options, (res) => {
		res.on('data', () => {
			// Consume response data to ensure 'end' event is triggered
		});

		res.on('end', () => {
			let endTime = performance.now();
			let latency = endTime - startTime;
			// console.log(`Latency: ${latency.toFixed(2)} ms`);
			// console.log(`Latency: ${latency / numberOfMessages.toFixed(2)} ms`);
			return latency;
		});
	});

	req.on('error', (error) => {
		console.error(`Error: ${error.message}`);
	});

	req.end();
}

timeMessages()
