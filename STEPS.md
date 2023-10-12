yarn create nx-workspace grow-therapy --package-manager=yarn --workspaceType=integrated --nx-cloud=false --preset=apps

cd grow-therapy

yarn add @nx/node

nx g @nx/node:application --name=api --bundler=webpack --directory=apps --framework=express --docker=true --projectNameAndRootFormat=as-provided
