import {Client, GatewayIntentBits, Events } from 'discord.js';

import {discordCronJobs, discordOnMesssage} from '../../datalayer/actuators/discord'




const getDiscordClient = async () => {
  const discordClient = new Client({
    intents: [
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.Guilds
    ]
  });

  //ReadyBot
  discordClient.on('ready', async (client) => {
      console.log('Logged in.')
      client.user.setStatus('online')
      // start cron jobs
      await discordCronJobs(client);
  });

      //onMessage
  discordClient.on(Events.MessageCreate, async msg => {
    await discordOnMesssage(msg, discordClient);
  });


  return discordClient
}

export {
  getDiscordClient
}