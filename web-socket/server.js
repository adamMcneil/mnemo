'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const WebSocket = require('./lib/websocket');
const readline = require('readline');
const os = require('os');

WebSocket.createWebSocketStream = require('./lib/stream');
WebSocket.Server = require('./lib/websocket-server');
WebSocket.Receiver = require('./lib/receiver');
WebSocket.Sender = require('./lib/sender');

WebSocket.WebSocket = WebSocket;
WebSocket.WebSocketServer = WebSocket.Server;

module.exports = WebSocket;

const wss = new WebSocket.Server({ port: 8000 });
const wssServer = new WebSocket.Server({ port: 8001 });

const controllerStates = new Map();

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

wssServer.on('connection', function connection(x) {
  wss.on('connection', function connection(ws, req) {
    const clientIP = req.socket.remoteAddress
    console.log(`Client connected: ${clientIP}`);

    ws.on('message', function incoming(message) {
      const messageObject = JSON.parse(message);
      messageObject.action = "update";
      messageObject.ip = clientIP;
      x.send(JSON.stringify(messageObject));

      controllerStates[messageObject.name] = messageObject;
    });


    ws.on('close', function() {
      console.log(`Client disconnected: ${clientIP}`);
      const message = JSON.stringify({ action: "disconnect", ip: clientIP });
      x.send(message)
    });
  })
});


server.listen(8080, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:8080');
});

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
