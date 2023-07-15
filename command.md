amplify init

npm install @aws-amplify/ui-react aws-amplify

amplify add api

amplify push #push api to aws appsync console

amplify console api #open api in aws appsync console browser

#Vite global error fixing 
// vite.config.ts
export default defineConfig({
  define: {
    "global": {},
  },
});

## Amplify add auth to add authentication 

## Adding in Schema.graphql comment table
## Amplify push After updaing API Schema.graphql