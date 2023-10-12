yarn create nx-workspace grow-therapy --package-manager=yarn --workspaceType=integrated --nx-cloud=false --preset=apps

cd grow-therapy

yarn add @nx/node

nx g @nx/node:application --name=api --bundler=webpack --directory=apps --framework=express --docker=true --projectNameAndRootFormat=as-provided

yarn add @apollo/server graphql express cors body-parser

yarn add --save-dev @types/cors @types/express @types/body-parser

make resolvers.ts and schema.ts

