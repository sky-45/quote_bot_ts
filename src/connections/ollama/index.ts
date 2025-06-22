
import axios from 'axios';

import RedisController from '@actuators/redis'

const {URL_CHAT_API = 'http://localhost:11434'} = process.env


export const getChatbotAnswer = async (question:string) => {
    try {
      const model = await getChatbotModel()

      const { data: { response } } = await axios.post(`${URL_CHAT_API}/api/generate`,
        {
          model,
          prompt: question,
          stream: false
        }
      )

      return response as string
      
    } catch (error) {
      console.log(`Error ChatController-getChatbotAnswer:`, error)
      throw new Error(error);
    }
  }


export const getChatbotModel = async (newModel = undefined) => {
  const model = newModel ? newModel : await RedisController.getRedis('currentModelLLM') || 'llama3:8b'
  await RedisController.setRedis({key:'currentModelLLM', value: model})

  const currentModels = await getAvaliableModels()
  const isModelAvaliable = currentModels.find((el:string)=> el == model)
  
  if(isModelAvaliable) return model 

  const statusPull = await pullModel(model)

  if(statusPull) {
    await RedisController.setRedis({key:'currentModelLLM',value: model})
    return model
  }
  
  return model
}


const getAvaliableModels = async () => {
  const { data: { models=[] } } = await axios.get(`${URL_CHAT_API}/api/tags`)

  return models.map((el:{model:string})=>{
    return el.model
  })
}


const pullModel = async(model:string) => {
    try {

      const {data: {status}} = await axios.post(`${URL_CHAT_API}/api/pull`,{
        name: model,
        stream: false
      })


      return status == 'success' ? true : false
      
    } catch (error) {
      console.log(`Error ChatController-pullModel:`, error)
    }
  }

