import { logger } from '#utils';
import { hackerNewsInstance } from './instance';

export async function getTopStories(): Promise<number[] | null> {
  try {
    const res = await hackerNewsInstance.get<number[]>(
      '/topstories.json',
      {
        params: {
          print: 'pretty',
        },
      },
    );

    return res.data;
  } catch (error: unknown) {
    logger.error(error);
    return null;
  }
}
