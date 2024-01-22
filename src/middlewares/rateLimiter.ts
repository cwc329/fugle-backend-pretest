import { NextFunction, Request, Response } from 'express';
import { logger, redisClient } from '#utils';

export async function rateLimiter(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const ipRateLimit = 10;
    const userRateLimit = 5;
    const ttl = 60;

    if (!req.query.user || !req.ip) {
      res.sendStatus(400);
      return;
    }

    const ip = `${req.ip}`;
    const user = `${req.query.user}`;

    const [ipRequestCount, userRequestCount] = await Promise.all([
      redisClient.incr(ip),
      redisClient.incr(user),
    ]);

    if (ipRequestCount === 1) {
      await redisClient.expire(ip, ttl);
    }
    if (userRequestCount === 1) {
      await redisClient.expire(user, ttl);
    }

    if (ipRequestCount > ipRateLimit || userRequestCount > userRateLimit) {
      res.status(429).json({ ip: ipRequestCount, id: userRequestCount });
      return;
    }
    next();
  } catch (err: unknown) {
    logger.error(err);
    res.sendStatus(500);
  }
}
