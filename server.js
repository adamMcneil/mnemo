'use strict';

const fs = require('fs');
const readline = require('readline');
const WebSocket = require('ws');
const yargs = require('yargs');
const argv = yargs.argv;
const createHTTPServer = require('../http-server');

const wss = new WebSocket.Server({ port: 8000 });
const wssServer = new WebSocket.Server({ port: 8001 });

const controllerStates = new Map();

const recieved = `recieved-${Date.now()}.log`;
const sent = `sent-${Date.now()}.log`;
const recvFileStream = fs.createWriteStream(recieved, { flags: 'a' });
const sentFileStream = fs.createWriteStream(sent, { flags: 'a' });

wssServer.on('connection', function connection(wsServer) {
	wss.on('connection', function connection(ws, req) {

		const clientIP = req.socket.remoteAddress;
		console.log(`Client connected: ${clientIP}`);

		ws.on('message', function incoming(message) {
			if (argv.record) {
				recvFileStream.write(`${Date.now()}\n`)
			}
			const messageObject = JSON.parse(message);
			messageObject.action = "update";
			messageObject.ip = clientIP;
			controllerStates.set(messageObject.name, messageObject);
			wsServer.send(JSON.stringify(messageObject));
			if (argv.record) {
				sentFileStream.write(`${Date.now()}\n`)
			}
		});

		ws.on('close', function() {
			console.log(`Client disconnected: ${clientIP}`);
			controllerStates.forEach((value, name) => {
				if (value.ip = clientIP) {
					const message = JSON.stringify({ action: "disconnect", ip: clientIP, name: name });
					wsServer.send(message);
					controllerStates.delete(name);
				}
			});
		});
	})
});

