import { redisClient } from '../../../connections/redis'

import { getCurrentTime } from '../../../utils'	

interface redisInput {
  key: string,
  value: string,
  delay?: number
}


class RedisController {
  async getRedis (key: any) {
    try {
      const value = await redisClient.get(key)
  
      return value
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error RedisController-getRedis:`, error)
      return undefined
    }
  }

  // delay in seconds 
  async setRedis({key, value, delay}: redisInput) {
    try {
      await redisClient.set(key, typeof value === 'object' ? JSON.stringify(value) : value, delay? {EX: delay}: {})

      return {key, value}
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error RedisController-setRedis:`, error)
      return undefined
    }
  }

  async deleteRedis(key: any) {
    try {
      // await redisClient.set(key, typeof value === 'object' ? JSON.stringify(value) : value,{EX: delay})
      await redisClient.del(key)

      return true
    } catch (error) {
      console.log(`[${getCurrentTime()}] Error RedisController-deleteRedis:`, error)
      return undefined
    }
  }

}

export default new RedisController()
