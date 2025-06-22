

import { Message, TextChannel } from 'discord.js';

import {getChatbotAnswer} from '@connections/ollama'

import ChatModel from '@models/Chat'

export const handleChatMessage = async (msg: Message) => {
  try {
    if(msg.content.startsWith('!monsebot ')) {
      const question = msg.content.trim().substring(10,msg.content.length).trim() || ''
      if(!question) return 

      const channel = msg.channel as TextChannel
      
      channel.sendTyping()
      const response = await getChatbotAnswer(question) || ''

      let discordChatResponse
      if(response.length <= 1900)
        discordChatResponse = await msg.reply({ content: '```' + response + '```' })
      else {
        const rounds = Math.floor(response.length/1900)
        for(let i=0; i<=rounds; i++) {
          const text = response.substring(i*1900,(i+1)*1900)
          discordChatResponse = await msg.reply({ content: '```' + text + '```' })
        }
      }

      // discordChatResponse = await msg.reply({ content: '```' + response + '```' })

      const userMessage = {
        message: question,
        messageID: msg.id
      }
  
      const chatbotMessage = {
        message: response,
        messageID: discordChatResponse?.id
      }
      
      const newchat = await addNewChat({userId: msg.author.id,userMessage, chatbotMessage})

    }
  } catch (error) {
    await msg.reply({ content: '```' + 'Error getting a response, try later monse...' + '```' })
  }
}



const addNewChat = async ({userId, userMessage, chatbotMessage}:any) => {
    try {
      const newChat = [
        {
          userMessage: userMessage.message,
          userMessageID: userMessage.messageID,
          chatbotMessage: chatbotMessage.message,
          chatbotMessageID: chatbotMessage.messageID
        }
      ]

      const chat = await ChatModel.create({
        userId,
        chats: newChat,
        lastChatbotMessageID: chatbotMessage.messageID
      })

      return chat
    } catch (error) {
      console.log(`Error ChatController-addNewChat:`, error)
    }
  }