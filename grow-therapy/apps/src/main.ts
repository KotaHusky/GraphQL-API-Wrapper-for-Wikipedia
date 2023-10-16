// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { makeExecutableSchema } from '@graphql-tools/schema'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup a logger function which outputs standards amazon format to console and file
const logger = (message: string) => {
  const log = `${new Date().toISOString()} ${message}`;
  console.log(log);
  fs.appendFileSync('logs.txt', `${log}\n`);
};

interface MyContext {
  token?: string;
}

// Prep GraphQL Schema

const importTypesAndResolvers = async (dir: string) => {
  console.log("Importing types and resolvers from:", dir);
  const files = fs.readdirSync(dir);
  log("Files:", files);
  const allTypeDefs = [];
  const allResolvers = {};
  for (const file of files) {
    if (file.endsWith('.type.ts') || file.endsWith('.type.js')) {
      const filePath = path.join(dir, file);
      log("Importing:", filePath);
      const { typeDefs, resolvers } = await import(filePath);
      allTypeDefs.push(typeDefs);
      Object.assign(allResolvers, resolvers);
    }
  }
  return { allTypeDefs, allResolvers };
};

const { allTypeDefs, allResolvers } = await importTypesAndResolvers(path.join(__dirname, './graphql/types'));

// Debugging steps
log("allTypeDefs:", allTypeDefs);
log("allResolvers:", allResolvers);

// Create GraphQL schema
const schema = makeExecutableSchema({ typeDefs: allTypeDefs, resolvers: allResolvers });

const app = express();

// Init Apollo & Express
const httpServer = http.createServer(app);
const server = new ApolloServer<MyContext>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Ensure we wait for the server to start
await server.start();

// Set up the Express middleware to handle CORS, body parsing,
// and the expressMiddleware function.
app.use(
  '/',
  cors<cors.CorsRequest>(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);

// Start the server
await new Promise<void>((resolve) => httpServer.listen({
  port: process.env.PORT || 4000,
}, resolve));
log(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}`);
