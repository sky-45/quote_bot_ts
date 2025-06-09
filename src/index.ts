import path from 'path';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { loadFiles } from '@graphql-tools/load-files'

import {getDiscordClient} from './connections/discord'

import { dirname } from 'path';
import { fileURLToPath } from 'url';

console.log(1)
const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

console.log(2)

const getServerApollo = async () => {
  // update with current path inside of path join
  const resolversArray = await loadFiles(path.join(__dirname,'./graphql/resolvers/**/*.resolvers.*'))
  const typeDefsArray =  await loadFiles(path.join(__dirname,'./graphql/types/**/*.graphql'))

  const resolvers =  mergeResolvers(resolversArray)
  const typeDefs =  mergeTypeDefs(typeDefsArray)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  return server
}

console.log(3)

const server = await getServerApollo();

console.log(4)

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(5)
console.log(`🚀 Apollo Server ready at: ${url}`);

const discordClient = await getDiscordClient()
await discordClient.login(process.env.DISCORD_TOKEN);


