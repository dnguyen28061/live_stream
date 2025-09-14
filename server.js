import express from 'express';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const httpServer = http.createServer(app);
const port = 3000;

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

httpServer.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
