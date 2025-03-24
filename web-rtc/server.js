const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
	console.log("connected")
	ws.on('message', (message) => {
		console.log("recieved message:", message.toString())
		// Broadcast message to all connected clients except sender
		wss.clients.forEach(client => {
			if (client !== ws && client.readyState === WebSocket.OPEN) {

				client.send(message.toString());
			}
		});
	});
});

console.log("WebSocket server running on ws://localhost:8080");
