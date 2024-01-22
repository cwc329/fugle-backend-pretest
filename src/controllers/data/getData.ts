import type { Request, Response } from 'express';
import { topStories } from '#apiRequests';
import { logger } from '#utils';

export async function getData(req: Request, res: Response): Promise<void> {
  try {
    const { query } = req;
    const userID    = Number(query.user);
    if (Number.isNaN(userID) || userID > 1000 || userID < 1) {
      res.status(400).json({ errors: ['invalid user'] });
      return;
    }

    const stories = await topStories.getTopStories();

    if (!stories) {
      res.sendStatus(500);
      return;
    }

    if (!Array.isArray(stories)) {
      logger.warn('invalid top stories.');
      res.sendStatus(500);
      return;
    }

    const data = stories.filter((story) => story % userID === 0);

    res.json(data);
  } catch (error: unknown) {
    logger.error(error);
    res.sendStatus(500);
  }
}
