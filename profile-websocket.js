import ws from 'k6/ws';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Define a custom metric to track latency from professor sending the question to receiving a student answer.
export let professorLatency = new Trend("professor_latency", true);

// Base URL for the WebSocket endpoint.
const urlIn = 'ws://10.5.6.176:8000';
const urlOut = 'ws://10.5.6.176:8001';

export function fakeClient() {
  let questionSentTime = 0;

  ws.connect(urlOut, null, function(socket) {
    socket.on('open', () => {
    });

    socket.on('message', (data) => {
      try {
        const response = JSON.parse(data);
        // Expect student replies broadcasted as "new_message"
        const latency = Date.now() - questionSentTime;
        professorLatency.add(latency);
        console.log(`Received student answer; latency: ${latency} ms`);
      } catch (e) {
        console.log('Professor error parsing message:', e);
      }
    });

    socket.on('close', () => console.log('Professor disconnected'));

    socket.setTimeout(() => { socket.close(); }, 15000);
  });

  ws.connect(urlIn, null, function(socket) {
    socket.on('open', () => {
      console.log('Student connected');
      sleep(5);
      questionSentTime = Date.now()
      socket.send(JSON.stringify({
        name: "Adam",
        action: "update",
        x: 0.5426558912,
        y: 0.5426558912
      }));
    });

    socket.on('message', (data) => {
      // You can add logic here if you want to verify incoming broadcasts.
    });

    socket.on('close', () => console.log('Student disconnected'));

    socket.setTimeout(() => { socket.close(); }, 15000);
  });

}

// Use separate scenarios: one for the professor and one for the students.
export let options = {
  scenarios: {
    fake: {
      executor: 'constant-vus',
      vus: 100,
      duration: '20s',
      exec: 'fakeClient',
    }
    // professor: {
    //   executor: 'constant-vus',
    //   vus: 1,
    //   duration: '20s',
    //   exec: 'professorClient',
    // },
    // students: {
    //   executor: 'constant-vus',
    //   vus: 99, // Total: 1 professor + 99 students = 100 clients.
    //   duration: '20s',
    //   exec: 'studentClient',
    // },
  },
};
