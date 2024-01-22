import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import PubSub from 'pubsub-js';
import WebSocket from 'ws';
import { websocket } from '#configs';
import { logger, redisClient } from '#utils';
import { BitstampWebsocketMessage } from './types';

let bitmapWebsocketClient: WebSocket;

async function connectBitmapWebsocket() {
  return new Promise<WebSocket>((resolve, reject) => {
    bitmapWebsocketClient = new WebSocket(websocket.bitstampWebsocketUrl);
    bitmapWebsocketClient
      .on('error', (error) => {
        logger.error(error);
        reject(error);
      })
      .on('message', async (message) => {
        const rawMessage = message.toString('utf-8');
        const messageJSON = plainToInstance(BitstampWebsocketMessage, JSON.parse(rawMessage));

        const errors = validateSync(messageJSON);
        logger.log('debug', { messageJSON });
        const { channel, data, event } = messageJSON;
        if (errors.length) {
          logger.warn('invalid received message, ignored.');
          return;
        }

        const liveTradesRegex = /^live_trades_(?<currencyPair>[a-z]+)$/;
        const result = liveTradesRegex.exec(channel);
        if (!result || event !== 'trade') {
          return;
        }

        const currencyPair = result.groups?.currencyPair ? `${result.groups?.currencyPair}` : null;
        if (!currencyPair) {
          return;
        }
        const { price } = data;

        await redisClient.set(currencyPair, price);

        PubSub.publish(currencyPair, price);
      });

    bitmapWebsocketClient
      .on('open', () => {
        logger.info('bitstamp websocket connected...');
        resolve(bitmapWebsocketClient);
      });
  });
}

export async function getBitmapWebsocketClient() {
  if (bitmapWebsocketClient) return bitmapWebsocketClient;
  return connectBitmapWebsocket();
}
