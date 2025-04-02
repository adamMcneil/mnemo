const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

function createHTTPServer(base) {
	const server = http.createServer((req, res) => {
		const filePath = path.join(base,
			req.url === '/game' ? '/game.html' : './controller.html'
		);
		fs.readFile(filePath, (err, content) => {
			err ? res.end('Internal Server Error')
				: res.end(content, 'utf-8');
		});
	});

	function getLocalIP() {
		return Object.values(os.networkInterfaces())
			.flat()
			.find(iface => iface.family === "IPv4" && !iface.internal)?.address
			|| "127.0.0.1";
	}

	return {
		start: (port) => {
			server.listen(port, '0.0.0.0', () => {
				console.log(`Server running at http://${getLocalIP()}:${port}/game`);
			});
			return server;
		}
	};
}

module.exports = createHTTPServer;
