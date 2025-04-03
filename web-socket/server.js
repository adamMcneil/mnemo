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
      if (argv.record) {
        writeTime(recieved);
      }
      const messageObject = JSON.parse(message);
      messageObject.action = "update";
      messageObject.ip = clientIP;
      controllerStates.set(messageObject.name, messageObject);
      wsServer.send(JSON.stringify(messageObject));
      if (argv.record) {
        writeTime(sent);
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

const httpServer = createHTTPServer('.');

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
