const http = require('http');
const { performance } = require('perf_hooks');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/movement',
  method: 'POST',
};

const startTime = performance.now();

const req = http.request(options, (res) => {
  res.on('data', () => {
    // Consume response data to ensure 'end' event is triggered
  });

  res.on('end', () => {
    const endTime = performance.now();
    const latency = endTime - startTime;
    console.log(`Latency: ${latency.toFixed(2)} ms`);
  });
});

req.on('error', (error) => {
  console.error(`Error: ${error.message}`);
});

req.end();
