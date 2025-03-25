const { json } = require('stream/consumers');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

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
