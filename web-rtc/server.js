const fs = require('fs');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const os = require('os');

const wss = new WebSocket.Server({ port: 8081 });

let serverConnection = null

wss.on('connection', (ws) => {
	if (serverConnection == null) {
		console.log("Game server is connected");
		serverConnection = ws;
	}

	ws.on('message', (message) => {
		const object = JSON.parse(message.toString())
		if (object.offer) {
			console.log("offer");
		} else if (object.answer) {
			console.log("answer");
		} else if (object.iceCandidate) {
			console.log("iceCandidate");
		}
		if (ws == serverConnection) {
			console.log("forwarding to everybody else")
			wss.clients.forEach(client => {
				if (client !== serverConnection && client.readyState === WebSocket.OPEN) {
					client.send(message.toString());
				}
			});
		} else {
			console.log("forwarding to game server")
			serverConnection.send(message.toString())
		}
	});
});

console.log("WebSocket server running on ws://localhost:8080");

const server = http.createServer((req, res) => {
	let filePath;

	// Determine which page to serve based on the URL path
	if (req.url === '/game') {
		filePath = path.join(__dirname, './game.html');  // The server front end
	} else {
		filePath = path.join(__dirname, './controller.html');  // The client front end
	}

	fs.readFile(filePath, (err, content) => {
		if (err) {
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end('Internal Server Error');
		} else {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(content, 'utf-8');
		}
	});
});

function getLocalIP() {
	const interfaces = os.networkInterfaces();
	for (const interfaceName in interfaces) {
		for (const iface of interfaces[interfaceName]) {
			if (iface.family === "IPv4" && !iface.internal) {
				return iface.address;
			}
		}
	}
	return "127.0.0.1"; // Default if no network interface is found
}

server.listen(8080, '0.0.0.0', () => {
	console.log(`Server running at http://${getLocalIP()}:8080/game`);
});

