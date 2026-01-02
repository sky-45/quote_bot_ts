import axios from 'axios';
import RedisController from '../../datalayer/actuators/redis';
const { URL_CHAT_API = 'http://localhost:11434' } = process.env;
export const getChatbotAnswer = async (question) => {
    try {
        const model = await getChatbotModel();
        const { data: { response } } = await axios.post(`${URL_CHAT_API}/api/generate`, {
            model,
            prompt: question,
            stream: false
        });
        return response;
    }
    catch (error) {
        console.log(`Error ChatController-getChatbotAnswer:`, error);
        throw new Error(error);
    }
};
export const getChatbotThreadAnswer = async (thread) => {
    try {
        const model = await getChatbotModel();
        const { data: { message: { content } } } = await axios.post(`${URL_CHAT_API}/api/chat`, {
            model,
            messages: thread,
            stream: false
        });
        return content;
    }
    catch (error) {
        console.log(`Error ChatController-getChatbotAnswer:`, error);
        throw new Error(error);
    }
};
export const cleanResponseQwenModel = (answer) => {
    if (answer.includes('<think>') && answer.includes('</think>')) {
        const text_list = answer.split('</think>');
        if (text_list.length >= 1) {
            return text_list[1];
        }
        else {
            text_list[1];
        }
    }
    return answer;
};
export const getChatbotModel = async (newModel = undefined) => {
    const model = newModel ? newModel : await RedisController.getRedis('currentModelLLM') || 'llama3:8b';
    await RedisController.setRedis({ key: 'currentModelLLM', value: model });
    const currentModels = await getAvaliableModels();
    const isModelAvaliable = currentModels.find((el) => el == model);
    if (isModelAvaliable)
        return model;
    const statusPull = await pullModel(model);
    if (statusPull) {
        await RedisController.setRedis({ key: 'currentModelLLM', value: model });
        return model;
    }
    return model;
};
const getAvaliableModels = async () => {
    const { data: { models = [] } } = await axios.get(`${URL_CHAT_API}/api/tags`);
    return models.map((el) => {
        return el.model;
    });
};
const pullModel = async (model) => {
    try {
        const { data: { status } } = await axios.post(`${URL_CHAT_API}/api/pull`, {
            name: model,
            stream: false
        });
        return status == 'success' ? true : false;
    }
    catch (error) {
        console.log(`Error ChatController-pullModel:`, error);
    }
};
