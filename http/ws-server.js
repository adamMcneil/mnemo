'use strict';

const WebSocket = require('ws');
console.log("server start")

const wss = new WebSocket.Server({ port: 8000 });

wss.on('connection', function connection(ws, req) {
	console.log('connected')

	ws.on('message', function incoming(message) {
		// console.log(message)
		ws.send(message)
	});

	ws.on('close', function() {
		console.log("close");
	});
})
