# GraphQL API Wrapper for Wikipedia

## About

This is a GraphQL API wrapper for the Wikipedia API. It is built using:

- [Nx](https://www.nx.dev/)
- [Express](https://www.npmjs.com/package/express)
- [@graphql-tools](https://www.npmjs.com/package/@graphql-tools)
- [Apollo Server](https://www.npmjs.com/package/apollo-server)
- [Docker](https://www.npmjs.com/package/docker)

## Usage

### Installation

```bash
yarn install
```

### Run the server: local

```bash
yarn serve
```

### Run the server: Docker

```bash
yarn serve:docker
```

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

## Extending the API

TypeDefs and Resolvers for a given subject are stored in `.type.ts` files in the `src/graphql/types` directory. The GraphQL schema is generated on server start using the `makeExecutableSchema` function from `@graphql-tools/schema`.

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

- [ ] Add authentication and authorization to the GraphQL API. See [here](https://www.apollographql.com/docs/apollo-server/security/authentication/).
- [ ] Add SSL termination to the GraphQL API. See [here](https://www.apollographql.com/docs/apollo-server/security/terminating-ssl).

### Reliability

- [ ] Add logging to the GraphQL API. See [here](https://www.apollographql.com/docs/apollo-server/monitoring/logging/).
- [ ] Add full validation suite (lint, test, build) using [Apollo Server's executeOperation](https://www.apollographql.com/docs/apollo-server/testing/testing/) and [Nx's affected](https://nx.dev/nx-api/nx/documents/print-affected#printaffected).
- [ ] Add CICD pipeline to build and deploy the GraphQL API via GitHub Actions.
- [ ] Add monitoring to the GraphQL API. See [here](https://www.apollographql.com/docs/apollo-server/monitoring/metrics/).

### Best Practices

- [ ] Familiarize team with the Principles of GraphQL. See [here](https://principledgraphql.com/).
