import { OHLC } from '#types';
import { logger } from '#utils';
import { bitstampInstance } from './instance';

type BitstampOHLCResponse = {
  data: {
    ohlc: (OHLC & { timestamp: number })[];
    pair: string;
  }
};
export async function getOHLC(currencyPair: string): Promise<BitstampOHLCResponse | null> {
  try {
    const res = await bitstampInstance.get<BitstampOHLCResponse>(
      `/ohlc/${currencyPair}`,
      {
        params: {
          step: 60,
          limit: 1,
        },
      },
    );

    return res.data;
  } catch (error: unknown) {
    logger.error(error);
    return null;
  }
}
