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

/**
 * Converts the URL of the current module to a file path string.
 * 
 * @param {URL} import.meta.url - The URL of the current module.
 * @returns {string} - The file path string of the current module.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Logs a message to the console and appends it to a log file.
 * @param message - The message to log.
 * @param context - Optional context to include in the log message.
 */
const logger = (message: string, context?: any) => {
  const log = `${new Date().toISOString()} ${message} ${context ? JSON.stringify(context) : ''}`;
  console.log(log);
  fs.appendFileSync('logs.txt', `${log}\n`);
};

/**
 * The context object for the Apollo GraphQL server.
 * 
 * @remarks
 * The `token` property is an optional string that can be used to authenticate requests.
 * 
 * @see https://www.apollographql.com/docs/apollo-server/api/apollo-server/#context
 */
interface MyContext {
  token?: string;
}

// Prep GraphQL Schema

/**
 * Imports all type definitions and resolvers from a given directory.
 * @param dir - The directory to import from.
 * @returns An object containing all type definitions and resolvers.
 */
const importTypesAndResolvers = async (dir: string) => {
  logger("Importing types and resolvers from:", dir);
  const files = fs.readdirSync(dir);
  logger("Files:", files);
  const allTypeDefs: string[] = [];
  const allResolvers = {};
  for (const file of files) {
    if (file.endsWith('.type.ts') || file.endsWith('.type.js')) {
      const filePath = path.join(dir, file);
      logger("Importing:", filePath);
      const { typeDefs, resolvers } = await import(filePath);
      allTypeDefs.push(typeDefs);
      Object.assign(allResolvers, resolvers);
    }
  }
  return { allTypeDefs, allResolvers };
};

/**
 * Import all type definitions and resolvers from the specified file path.
 * @param {string} path - The file path to import from.
 * @returns {Promise<{ allTypeDefs: any, allResolvers: any }>} - A promise that resolves to an object containing all type definitions and resolvers.
 */
const { allTypeDefs, allResolvers } = await importTypesAndResolvers(path.join(__dirname, './graphql/types'));

// Debugging steps
logger("allTypeDefs:", allTypeDefs);
logger("allResolvers:", allResolvers);

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
logger(`🚀 Server ready at http://localhost:${process.env.PORT || 4000}`);
