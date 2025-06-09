import {Client, GatewayIntentBits, Events, Message, TextChannel  } from 'discord.js';
import {CronJob as cron} from 'cron'

import {getCurrentTime, validate_dimelo} from '../../../utils';

import {getTodayBirthdays} from '../../actuators/birthday';
import {getLiveChannels, notifyChannelsLive} from '../../actuators/twitch'
import {getRandomQuote} from '../../actuators/quote';


const discordOnMesssage = async (msg:Message, client:Client) => {
    try {
      if(!msg?.author?.bot){ 
        // gpoitns discorddd 
////        if (!msg.content.startsWith('!'))
////          PointsController.addPoints(msg.author.id)

        if(validate_dimelo(msg.content)) {
          const randomQuote = await getRandomQuote()
          const channel = msg.channel as TextChannel;

          channel.send(randomQuote.quote);

        }
////        if (msg.content.toLowerCase() === 'chiste monse' ) {
////          JokeController.getRandomMonseJoke().then((message)=>{
////            if(message)
////              msg.channel.send(message);
////          });
////        }
////        if (msg.content.toLowerCase() === 'chiste' ) {
////          JokeController.getRandomJoke().then((message)=>{
////            if(message)
////              msg.channel.send(message);
////          });
////        }
////        if (msg.content.startsWith('!agregar ')) {
////          let message = msg.content.substring('!agregar '.length);
////          QuoteController.addMessage(message, msg.author.username);
////          msg.reply('Mensaje Añadido!!!')
////        }
////      
////        if (msg.content.includes('!dimeloTodo') || msg.content.includes('!dímeloTodo')) {
////         QuoteController.getAllMessages().then((messages)=>{
////            messages.forEach(el => {
////              if(el)
////                msg.channel.send(el);
////              });
////            });
////        }
////      
////        // actuator of pelis get message
////        if(msg.content.toLowerCase().includes('peli'))
////          await MovieActuator(msg)
////      
////          // actuator of pelis get message
////        if(msg.content.toLowerCase().includes('gpoints') || msg.content.toLowerCase() === '!leaderboard')
////          await PointsActuator(msg, client)
////      
////        // actuator of exchange info
////        if(msg.content.toLowerCase().includes('cambio'))
////          await CurrencyActuator(msg)
////      
////        // actuator of birthdaysss
////        if(msg.content.toLowerCase().includes('cumple'))
////          await BirthdayActuator(msg)
////      
////        // actuator of memideee
////        if(msg.content.toLowerCase().includes('mide'))
////          await MeassureActuator(msg)
////
////        // actuator of chatgpt
////        if(msg.content.startsWith('!monsebot ') || msg.content.startsWith('!monseimagen ') || msg.content.startsWith('!monsebotUpgrade ') || msg.reference?.messageId)
////          await ChatActuator(msg)
////      
////        if(msg.content.startsWith('!addStream '))
////          await TwitchActuator(msg)
      
      }
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error onMessage main:`, error)
    }
}



const discordCronJobs = async (client:Client) => {
  const sendMessageDailyEveryone = new cron('0 0 * * *', async () => {
    try {
      const guild = client.guilds.cache.get('366511816358232072');

      if (guild) {
        const ch = guild.channels.cache.get('366511816358232075') as TextChannel;
        if(!ch) return;

        const birthdays = await getTodayBirthdays();
      
        for (let elem of birthdays) {
          await ch.send({ 
            content: '@everyone Monses feliciten a ' + elem.user + ' por sus terribles ' + elem.years +' años !'
          }).catch(err => {
              console.error(err);
          });
        }
      }
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error sendMessageDailyEveryone:`, error)
    }

  });

  const sendMessageDailySimple = new cron('0 10,18 * * *', async () => {
    try {
      const guild = client.guilds.cache.get('366511816358232072');

      if (guild) {
        const ch = guild.channels.cache.get('366511816358232075') as TextChannel;
        const birthdays = await getTodayBirthdays();
      
        for (let elem of birthdays) {
          await ch.send({ 
            content: '```' + 'Monses Feliciten a ' + elem.user + ' por sus terribles ' + elem.years +' años !' + '```'
          }).catch(err => {
              console.error(err);
          });
        }
      }
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error sendMessageDailySimple:`, error)
    }

  });

  const sendStreamReminder = new cron('*/10 * * * * *', async () => {
    try {
      const guild = client.guilds.cache.get('366511816358232072');
      if (guild) {
        const ch = guild.channels.cache.get('366521521117593600');
        const liveChannels = await getLiveChannels();
        if(liveChannels.length)
          await notifyChannelsLive(liveChannels, ch)
      }
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error sendStreamReminder:`, error)
    }

  });

  sendMessageDailyEveryone.start();
  sendMessageDailySimple.start();
  sendStreamReminder.start();
}

export {
  discordCronJobs,
  discordOnMesssage
}