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
const streams = []; // In-memory data store for streams
const comments = []; // In-memory data store for comments

// Event emitter for real-time updates
import { EventEmitter } from 'events';
const eventEmitter = new EventEmitter();

// Use body-parser for parsing JSON bodies
app.use(bodyParser.json());

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
    res.json(streams); // Return the in-memory streams
});

app.post('/streams', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ status: 'error', message: 'Stream name is required' });
    }
    const newStream = { id: streams.length + 1, name };
    streams.push(newStream);
    console.log('REST: New stream created:', newStream);
    res.status(201).json({ status: 'ok', message: 'Stream created', stream: newStream });
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

// New endpoint to add comments and broadcast via SSE
app.post('/comments', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ status: 'error', message: 'Comment text is required' });
    }
    const newComment = { id: comments.length + 1, text, timestamp: new Date().toISOString() };
    comments.push(newComment);
    eventEmitter.emit('newComment', newComment); // Emit event for SSE clients
    console.log('SSE: New comment added:', newComment);
    res.status(201).json({ status: 'ok', message: 'Comment added', comment: newComment });
});

// SSE Endpoint
app.get('/events', (req, res) => {
    console.log('SSE: Client connected.');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send existing comments on connection
    comments.forEach(comment => {
        res.write(`data: ${JSON.stringify(comment)}

`);
    });

    // Function to send new comments
    const sendNewComment = (comment) => {
        res.write(`data: ${JSON.stringify(comment)}

`);
        console.log(`SSE: Sent new comment: ${JSON.stringify(comment)}`);
    };

    // Listen for new comments and send them to this client
    eventEmitter.on('newComment', sendNewComment);

    // Handle client disconnection
    req.on('close', () => {
        eventEmitter.removeListener('newComment', sendNewComment);
        console.log('SSE: Client disconnected.');
    });
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
