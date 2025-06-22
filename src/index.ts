import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { loadFiles } from '@graphql-tools/load-files'

import {getDiscordClient} from './connections/discord'


// setting variables for path calculation
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



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



const server = await getServerApollo();


// start apollo server
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
console.log(`🚀 Apollo Server ready at: ${url}`);


// start discord server
const discordClient = await getDiscordClient()
await discordClient.login(process.env.DISCORD_TOKEN);


console.log(`🚀 Discord Server ready`);