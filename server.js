import express from 'express';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { WebSocketServer } from 'ws';
import dgram from 'dgram';

const app = express();
const httpServer = http.createServer(app);
const port = 3000;

let reactionsCount = 0; // In-memory reactions counter

// GraphQL Schema
const typeDefs = `#graphql
  type Stream {
    id: ID!
    name: String
  }
  type Query {
    streams: [Stream]
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    streams: () => {
      throw new Error('GraphQL API is not yet implemented');
    },
  },
};

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server and apply middleware
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

console.log(`🚀  Server ready at: ${url}`);

app.use(express.static('public'));

// Stubbed REST API
app.get('/streams', (req, res) => {
    res.json({ status: 'ok', message: 'REST API is not yet implemented' });
});

app.post('/streams', (req, res) => {
    res.json({ status: 'ok', message: 'REST API is not yet implemented' });
});

// New endpoint to simulate sending UDP from client
app.post('/udp-send', (req, res) => {
    const message = Buffer.from('like'); // Simulate a 'like' message
    udpServer.send(message, udpPort, 'localhost', (err) => {
        if (err) {
            console.error('UDP send error:', err);
            res.status(500).json({ status: 'error', message: 'Failed to send UDP message' });
        } else {
            console.log('UDP message sent by server (simulated client).');
            res.json({ status: 'ok', message: 'UDP message simulated' });
        }
    });
});

// New endpoint to get reactions count
app.get('/reactions', (req, res) => {
    res.json({ count: reactionsCount });
});

// Stubbed SSE Endpoint
app.get('/events', (req, res) => {
    console.log('SSE: Client connected.');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    const message = 'Connection established';
    res.write(`data: ${message}\n\n`);
    console.log(`SSE: Sent event: ${message}`);
    res.end(); // Close the connection after sending one event
    console.log('SSE: Connection closed.');
});

// Stubbed WebSocket Server
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', ws => {
    console.log('WebSocket: Client connected.');

    ws.on('message', message => {
        console.log(`WebSocket: Received message: ${message}`);
    });

    ws.on('close', () => {
        console.log('WebSocket: Client disconnected.');
    });

    ws.on('error', error => {
        console.error('WebSocket: Error:', error);
    });
});

// Stubbed UDP Socket
const udpPort = 4001; // Choose a different port for UDP
const udpServer = dgram.createSocket('udp4');

udpServer.on('error', (err) => {
    console.error(`UDP server error:\n${err.stack}`);
    udpServer.close();
});

udpServer.on('message', (msg, rinfo) => {
    console.log(`UDP server received ${msg} from ${rinfo.address}:${rinfo.port}`);
    reactionsCount++;
    console.log(`Reactions count: ${reactionsCount}`);
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`UDP server listening ${address.address}:${address.port}`);
});

udpServer.bind(udpPort);

httpServer.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
