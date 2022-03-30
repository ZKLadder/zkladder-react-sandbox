import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'https://api-us-east-1.graphcms.com/v2/cl12mkshi8t8s01za53ae9b2y/master',
  cache: new InMemoryCache(),
});
