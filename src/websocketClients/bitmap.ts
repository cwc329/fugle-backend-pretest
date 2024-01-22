import WebSocket from 'ws';
import { websocket } from '#configs';
import { logger } from '#utils';

let bitmapWebsocketClient: WebSocket;

async function connectBitmapWebsocket() {
  return new Promise<WebSocket>((resolve, reject) => {
    bitmapWebsocketClient = new WebSocket(websocket.bitmapWebsocketUrl);
    bitmapWebsocketClient
      .on('error', (error) => {
        logger.error(error);
        reject(error);
      })
      .on('message', (data) => {
        logger.log('debug', 'received: %s', data);
      });

    bitmapWebsocketClient
      .on('open', () => {
        logger.info('bitmap websocket connected...');
        resolve(bitmapWebsocketClient);
      });
  });
}

export async function getBitmapWebsocketClient() {
  if (bitmapWebsocketClient) return bitmapWebsocketClient;
  return connectBitmapWebsocket();
}
