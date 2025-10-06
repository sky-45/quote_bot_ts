import { getChatbotAnswer, getChatbotThreadAnswer } from '../../../connections/ollama';
import ChatModel from '../../models/Chat';
export const handleChatMessage = async (msg) => {
    try {
        if (msg.content.startsWith('!monsebot ')) {
            const question = msg.content.trim().substring(10, msg.content.length).trim() || '';
            if (!question)
                return;
            const channel = msg.channel;
            channel.sendTyping();
            const response = await getChatbotAnswer(question) || '';
            let discordChatResponse;
            if (response.length <= 1900)
                discordChatResponse = await msg.reply({ content: '```' + response + '```' });
            else {
                const rounds = Math.floor(response.length / 1900);
                for (let i = 0; i <= rounds; i++) {
                    const text = response.substring(i * 1900, (i + 1) * 1900);
                    discordChatResponse = await msg.reply({ content: '```' + text + '```' });
                }
            }
            // discordChatResponse = await msg.reply({ content: '```' + response + '```' })
            const userMessage = {
                message: question,
                messageID: msg.id
            };
            const chatbotMessage = {
                message: response,
                messageID: discordChatResponse?.id
            };
            await addNewChat({ userId: msg.author.id, userMessage, chatbotMessage });
        }
        else if (msg.reference?.messageId) {
            const chatThread = await checkThreadExists(msg);
            if (!chatThread)
                return;
            const channel = msg.channel;
            channel.sendTyping();
            const threadFormated = formatThreadChat(chatThread, msg);
            const response = await getChatbotThreadAnswer(threadFormated) || '';
            let discordChatResponse = { id: '' };
            if (response.length <= 1900)
                discordChatResponse = await msg.reply({ content: '```' + response + '```' });
            else {
                const rounds = Math.floor(response.length / 1900);
                for (let i = 0; i <= rounds; i++) {
                    const text = response.substring(i * 1900, (i + 1) * 1900);
                    discordChatResponse = await msg.reply({ content: '```' + text + '```' });
                }
            }
            await updateChatThread(chatThread, msg, response, discordChatResponse.id);
        }
    }
    catch (error) {
        await msg.reply({ content: '```' + 'Error getting a response, try later monse...' + '```' });
    }
};
const updateChatThread = async (chatThread, msg, response, responseId) => {
    try {
        const updatedChats = [
            ...chatThread.chats,
            {
                userMessage: msg.content,
                userMessageID: msg.id,
                chatbotMessage: response,
                chatbotMessageID: responseId
            }
        ];
        const newThread = await ChatModel.findByIdAndUpdate(chatThread._id, { $set: {
                chats: updatedChats,
                lastChatbotMessageID: responseId
            }
        }, { 'new': true }).lean();
        return newThread;
    }
    catch (error) {
        console.log('Error ChatController-updateChatThread:', error);
    }
};
const formatThreadChat = (thread, msg) => {
    try {
        const messages = [];
        thread.chats.forEach((chatMsg) => {
            if (chatMsg && chatMsg.userMessage !== undefined && chatMsg.chatbotMessage !== undefined) {
                messages.push({
                    role: 'user',
                    content: chatMsg.userMessage
                }, {
                    role: 'assistant',
                    content: chatMsg.chatbotMessage
                });
            }
        });
        messages.push({
            role: 'user',
            content: msg.content
        });
        return messages;
    }
    catch (error) {
        console.log('Error ChatController-formatThreadChat:', error);
    }
};
const checkThreadExists = async (msg) => {
    try {
        const thread = await ChatModel.findOne({ lastChatbotMessageID: msg?.reference?.messageId });
        if (thread)
            return thread;
        return false;
    }
    catch (error) {
        console.log('Error ChatController-checkThreadExists:', error);
    }
};
const addNewChat = async ({ userId, userMessage, chatbotMessage }) => {
    try {
        const newChat = [
            {
                userMessage: userMessage.message,
                userMessageID: userMessage.messageID,
                chatbotMessage: chatbotMessage.message,
                chatbotMessageID: chatbotMessage.messageID
            }
        ];
        const chat = await ChatModel.create({
            userId,
            chats: newChat,
            lastChatbotMessageID: chatbotMessage.messageID
        });
        return chat;
    }
    catch (error) {
        console.log(`Error ChatController-addNewChat:`, error);
    }
};
