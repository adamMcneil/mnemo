'use strict';

const fs = require('fs');
const WebSocket = require('ws');
const readline = require('readline');
const createHTTPServer = require('../http-server');

const wss = new WebSocket.Server({ port: 8000 });
const wssServer = new WebSocket.Server({ port: 8001 });

const controllerStates = new Map();

const recieved = `recieved-${Date.now()}.log`;
const sent = `sent-${Date.now()}.log`;
function writeTime(filePath) {
  fs.writeFile(filePath, `${Date.now()}\n`, { flag: 'a' }, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });
}

wssServer.on('connection', function connection(wsServer) {
  wss.on('connection', function connection(ws, req) {
    const clientIP = req.socket.remoteAddress;
    console.log(`Client connected: ${clientIP}`);

    ws.on('message', function incoming(message) {
      writeTime(recieved);
      const messageObject = JSON.parse(message);
      messageObject.action = "update";
      messageObject.ip = clientIP;
      wsServer.send(JSON.stringify(messageObject));
      writeTime(sent);
      controllerStates[messageObject.name] = messageObject;
    });

    ws.on('close', function() {
      console.log(`Client disconnected: ${clientIP}`);
      const message = JSON.stringify({ action: "disconnect", ip: clientIP });
      wsServer.send(message)
    });
  })
});

const httpServer = createHTTPServer(".").start(8080);

// Set up a command-line interface to listen for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Type 'show' to display controllerStates:");
rl.on('line', (input) => {
  if (input.trim().toLowerCase() === 'show') {
    console.log('Current controllerStates:', controllerStates);
  } else {
    console.log("Unknown command. Type 'show' to display controllerStates.");
  }
});
