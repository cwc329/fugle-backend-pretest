export const redisHost = process.env.REDIS_HOST || 'localhost';
export const redisPort = parseInt(`${process.env.REDIS_PORT}`, 10) || 6379;
