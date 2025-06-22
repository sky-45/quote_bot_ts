import redis from 'redis';
const { URL_REDIS = 'redis://localhost:6379' } = process.env;
const redisClient = redis.createClient({ url: URL_REDIS }); // { host: URL_REDIS, port: 6379 }
redisClient.on('error', (error) => { console.log('Redis not connected :c', redisClient.options, error); });
redisClient.on('connect', () => { console.log(`🚀 Redis Server ready at: ${URL_REDIS}`); });
await redisClient.connect();
export { redisClient };
