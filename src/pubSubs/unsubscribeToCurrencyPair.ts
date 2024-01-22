import type WebSocket from 'ws';
import PubSub from 'pubsub-js';
import { currencyPairSubscription } from '#utils';

export async function unsubscribeToCurrencyPair(
  currencyPair: string,
  connectionID: string,
  ws: WebSocket,
) {
  const connectionSubscription = currencyPairSubscription.get(connectionID);
  if (!connectionSubscription || !connectionSubscription.has(currencyPair)) return;

  PubSub.unsubscribe(currencyPair);
  ws.send(JSON.stringify({ event: 'unsubscribe', message: 'ok' }));
}
