import { createClient } from 'redis';
import { redis } from '#configs';
import { logger } from './logger';

export const redisClient = createClient({
  socket: {
    host: redis.redisHost,
    port: redis.redisPort,
  },
});

redisClient
  .on('error', (err) => {
    logger.error(err);
  })
  .on(
    'connect',
    () => { logger.info('redis: connecting...'); },
  )
  .on(
    'ready',
    () => { logger.info('redis: connected'); },
  )
  .on(
    'end',
    () => { logger.info('redis: disconnected'); },
  );
