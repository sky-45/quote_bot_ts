import { redisClient } from '../../../connections/redis';
import { getCurrentTime } from '../../../utils';
class RedisController {
    async getRedis(key) {
        try {
            const value = await redisClient.get(key);
            return value;
        }
        catch (error) {
            console.log(`[${getCurrentTime()}] Error RedisController-getRedis:`, error);
            return undefined;
        }
    }
    // delay in seconds 
    async setRedis(key, value, delay) {
        try {
            await redisClient.set(key, typeof value === 'object' ? JSON.stringify(value) : value, { EX: delay });
            return { key, value };
        }
        catch (error) {
            console.log(`[${getCurrentTime()}] Error RedisController-setRedis:`, error);
            return undefined;
        }
    }
    async deleteRedis(key) {
        try {
            // await redisClient.set(key, typeof value === 'object' ? JSON.stringify(value) : value,{EX: delay})
            await redisClient.del(key);
            return true;
        }
        catch (error) {
            console.log(`[${getCurrentTime()}] Error RedisController-deleteRedis:`, error);
            return undefined;
        }
    }
}
export default new RedisController();
