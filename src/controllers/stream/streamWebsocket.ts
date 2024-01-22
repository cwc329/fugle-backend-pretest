import type { Request } from 'express';
import PubSub from 'pubsub-js';
import type WebSocket from 'ws';
import { subscribeToCurrencyPair, unsubscribeToCurrencyPair } from '#pubSubs';
import {
  currencyPairSubscription,
  logger,
  redisClient,
  safeJSONParse,
} from '#utils';
import { ohlc } from '#apiRequests';

export async function streamWebsocket(ws: WebSocket, req: Request) {
  const connectionID = req.headers['sec-websocket-key'];
  if (!connectionID) {
    ws.close();
    return;
  }

  const connectionSubscription = new Set<string>();
  currencyPairSubscription.set(connectionID, connectionSubscription);

  ws
    .on('open', () => {
      logger.info(`client(${connectionID}) opened connection`);
    })
    .on('close', () => {
      PubSub.clearAllSubscriptions();
      connectionSubscription.delete(connectionID);
      logger.info(`client(${connectionID}) closed connection`);
    });

  ws.on('message', async (message) => {
    const rawMessage  = message.toString('utf-8');
    const messageJSON = safeJSONParse<{ event?: string; currencyPair?: string; }>(rawMessage, null);
    if (!messageJSON) {
      ws.send('invalid event payload');
      return;
    }
    const { event, currencyPair } = messageJSON;

    if (!(typeof event === 'string') || !(typeof currencyPair === 'string')) {
      ws.send('invalid event payload');
      return;
    }

    switch (event) {
      case 'subscribe':
        await subscribeToCurrencyPair(currencyPair, connectionID, ws);
        break;
      case 'unsubscribe':
        await unsubscribeToCurrencyPair(currencyPair, connectionID, ws);
        break;
      case 'ohlc': {
        const currentTime = (new Date()).setSeconds(0, 0) / 1000;
        const cacheKey    = `ohlc:${currencyPair}:${currentTime}`;
        const ohclCache   = await redisClient.get(cacheKey);
        if (ohclCache) {
          ws.send(ohclCache);
          return;
        }
        const res = await ohlc.getOHLC(currencyPair);
        if (!res) {
          ws.send(JSON.stringify({ event: 'ohlc', message: 'server error' }));
          break;
        }
        const ohcl           = res.data.ohlc[0];
        const ohclJSONString = JSON.stringify(ohcl);
        await redisClient.set(
          `ohlc:${currencyPair}:${ohcl.timestamp}`,
          ohclJSONString,
          {
            EX: 15 * 60,
          },
        );
        ws.send(ohclJSONString);
        break;
      }
      default:
    }
  });
}
