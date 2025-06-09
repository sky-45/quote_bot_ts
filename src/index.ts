import path from 'path';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge'
import { loadFiles } from '@graphql-tools/load-files'

import {getDiscordClient} from './connections/discord'

import { dirname } from 'path';
import { fileURLToPath } from 'url';


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



const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});


console.log(`🚀 Apollo Server ready at: ${url}`);

const discordClient = await getDiscordClient()
await discordClient.login(process.env.DISCORD_TOKEN);


console.log(`🚀 Discord Server ready at: ${url}`);