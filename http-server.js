const express = require('express');
const os = require('os');

function getLocalIP() {
	return Object.values(os.networkInterfaces())
		.flat()
		.find(iface => iface.family === "IPv4" && !iface.internal)?.address
		|| "127.0.0.1";
}

function createHTTPServer(base) {
	const port = 8080;
	const app = express();
	app.use(express.static(base));
	return app.listen(port, () => {
		console.log(`Server running at http://${getLocalIP()}:${port}/game.html`);
	});
}

module.exports = createHTTPServer;
