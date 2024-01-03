# GraphQL API Wrapper for Wikipedia<!-- omit in toc -->

![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=flat&logo=apollo-graphql)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)
![Express](https://img.shields.io/badge/express-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB)
![Nx](https://img.shields.io/badge/nx-143055?style=flat&logo=nx&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![Yarn](https://img.shields.io/badge/yarn-%232187B6.svg?style=flat&logo=yarn&logoColor=white)

This project is a GraphQL API wrapper for the Wikipedia API.

Author: Jordan Levesque - @KotaHusky

License: [MIT](./LICENSE)

## Table of Contents<!-- omit in toc -->

- [Project Requirements](#project-requirements)
- [Usage](#usage)
  - [Installation](#installation)
  - [Run the server via local devserver](#run-the-server-via-local-devserver)
  - [Run the server via Docker](#run-the-server-via-docker)
  - [Explore the GraphQL Sandbox](#explore-the-graphql-sandbox)
  - [Querying the server](#querying-the-server)
    - [Example 1: Plain GraphQL Query](#example-1-plain-graphql-query)
    - [Example 2: Querying the server using curl](#example-2-querying-the-server-using-curl)
- [GraphQL](#graphql)
  - [Extending GraphQL](#extending-graphql)
- [Nx](#nx)
  - [Example Commands](#example-commands)
- [Future Improvements and Production Considerations](#future-improvements-and-production-considerations)
  - [Corner Cases](#corner-cases)
  - [Performance](#performance)
  - [Security](#security)
  - [Reliability](#reliability)
  - [Scalability \& Extensibility](#scalability--extensibility)
  - [Best Practices](#best-practices)
- [References \& Resources](#references--resources)

## Project Requirements
<img width="483" alt="image" src="https://github.com/KotaHusky/GraphQL-API-Wrapper-for-Wikipedia/assets/100734465/9d6ddc26-f48d-48e1-9da4-0117afba7ad2">

## Usage

### Installation

```bash
yarn install
```

### Run the server via local devserver

```bash
yarn serve
```

### Run the server via Docker

```bash
yarn serve:docker
```

or

```bash
make -f apps/Makefile docker-all
```

### Explore the GraphQL Sandbox

Once the server is running, you can explore the GraphQL API using the **Sandbox** at `http://localhost:4000/`.

The Sandbox allows you to:

- View and reference the GraphQL schema
- Create, run, and manage GraphQL queries
- View schema diff (if logged in and enabled on Apollo Studio)

### Querying the server

#### Example 1: Plain GraphQL Query

Here's an example query for the getWikipediaPageByMonth GraphQL query:

```graphql
query GetWikipediaPageByMonth($title: String!, $targetMonth: String!) {
    getWikipediaPageByMonth(title: $title, targetMonth: $targetMonth) {
        title
        totalViews
    }
}
```

In this example, the query takes two variables: `title` and `targetMonth`. The `getWikipediaPageByMonth` field returns the `title` and `totalViews` fields for a given Wikipedia page.

#### Example 2: Querying the server using curl

Using curl, you can query the server like so:

```bash
curl --request POST \
  --url http://localhost:4000/ \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/8.2.0' \
  --data '{"query":"query GetWikipediaPageByMonth($title: String!, $targetMonth: String!) {\n  getWikipediaPageByMonth(title: $title, targetMonth: $targetMonth) {\n    title\n    totalViews\n  }\n}","operationName":"GetWikipediaPageByMonth","variables":{"title":"Husky","targetMonth":"2023-09"}}'
```

## GraphQL

GraphQL is a query language for APIs that allows clients to request exactly the data they need, while enabling the server to aggregate data from multiple sources with a strongly-typed schema. See [here](https://graphql.org/learn/) for more information.

- Self-Documenting via strong types, [docstrings](https://www.apollographql.com/docs/apollo-server/schema/schema/#descriptions-docstrings), and [Introspection](https://graphql.org/learn/introspection/)
- No over- or under-fetching
- Easily extensible schema

**TypeDefs** in GraphQL are similar to interfaces in TypeScript. They define the shape of the data that can be queried from the GraphQL API.

**Resolvers** in GraphQL are functions that return data for a given field in the GraphQL schema.

### Extending GraphQL

TypeDefs and Resolvers for a given schema subject are stored in `.type.ts` files in the `src/graphql/types` directory. The GraphQL schema is generated on server start using the `makeExecutableSchema` function from `@graphql-tools/schema`.

## Nx

Nx is a set of extensible dev tools for monorepos and standalone projects. See [here](https://nx.dev/) for more information.

- Create new projects, apps, libraries, and components with generators like `nx g @nrwl/react:component my-component`
- Run tasks only for affected projects with `nx affected:test`
- Cache results and run tasks in parallel for faster execution
- Enforce and visualize boundaries between projects with `nx dep-graph`

### Example Commands

*Perform a dry-run of a generating command with `--dry-run`*

Create a new Nx workspace:

```bash
yarn create nx-workspace grow-therapy --package-manager=yarn --workspaceType=integrated --nx-cloud=false --preset=apps
```

Create a new Nx application:

```bash
yarn nx g @nx/node:application --name=api --bundler=esbuild --directory=apps --framework=express --docker=true --projectNameAndRootFormat=as-provided
```

## Future Improvements and Production Considerations

### Corner Cases

Handle cases where:

- [ ] the Wikipedia API returns an empty result for a given page, month, or both.
- [ ] the Wikipedia API returns an error.
- [ ] the Wikipedia API returns a result with a different schema than expected.
- [ ] the Wikipedia API enforces a rate limit.
- [ ] the GraphQL API recieves a request with an invalid query or variables.

### Performance

- [ ] Add a cache layer to reduce the number of requests to the Wikipedia API. See [here](https://www.apollographql.com/docs/apollo-server/performance/caching/).
- [ ] Add a load balancer to handle multiple requests to the GraphQL API.
- [ ] Add query complexity analysis to prevent expensive queries from being executed. See [here](https://www.apollographql.com/docs/apollo-server/performance/apq/).

### Security

- [ ] Add authentication and authorization for role-based access to GQL operations. See [here](https://www.apollographql.com/docs/apollo-server/security/authentication/).
- [ ] Add SSL termination to the GraphQL API. See [here](https://www.apollographql.com/docs/apollo-server/security/terminating-ssl).
- [ ] Use organization docker images instead of public images.

### Reliability

- [ ] Add logging to the GraphQL API. See [here](https://www.apollographql.com/docs/apollo-server/monitoring/logging/).
- [ ] Add full validation suite (lint, test, build) using [Apollo Server's executeOperation](https://www.apollographql.com/docs/apollo-server/testing/testing/) and [Nx's affected](https://nx.dev/nx-api/nx/documents/print-affected#printaffected).
- [ ] Add CICD pipeline to build and deploy the GraphQL API via GitHub Actions.
- [ ] Add monitoring to the GraphQL API. See [here](https://www.apollographql.com/docs/apollo-server/monitoring/metrics/).

### Scalability & Extensibility

- [ ] Integrate with other data sources as needed.
- [ ] Share ownership by federating into a supergraph. See [here](https://www.apollographql.com/docs/federation/).

### Best Practices

- [ ] Familiarize team with the Principles of GraphQL. See [here](https://principledgraphql.com/).

## References & Resources

- [Nx](https://www.nx.dev/)
- [Express](https://www.npmjs.com/package/express)
- [@graphql-tools](https://the-guild.dev/graphql/tools/docs/introduction)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server)
  - [Modularized Schema](https://www.apollographql.com/blog/backend/schema-design/modularizing-your-graphql-schema-code/)
  - [Express Middleware](https://www.apollographql.com/docs/apollo-server/api/express-middleware/)
- [Docker](https://www.npmjs.com/package/docker)
