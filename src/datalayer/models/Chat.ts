


import { Schema } from 'mongoose'
import {connectionMongoDB} from '../../connections/mongodbConnection'
import {Chat, ChatMessage} from '../../graphql/__generated__/types'

const messageSchema = new Schema<ChatMessage>({
  userMessage: { type: String, required : true },
  userMessageID: { type: String, required : true },
  chatbotMessage: { type: String, required : true },
  chatbotMessageID: { type: String, required : true },
})  

const ChatSchema = new Schema<Chat>({
  userId: { type: String, required : true },
  chats: [ messageSchema ],
  lastChatbotMessageID: { type: String, required : true }
}, { timestamps: true })


const ChatModel = connectionMongoDB.model<Chat>('Chat', ChatSchema)

export default ChatModel



