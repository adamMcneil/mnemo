'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const readline = require('readline');
const os = require('os');

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
