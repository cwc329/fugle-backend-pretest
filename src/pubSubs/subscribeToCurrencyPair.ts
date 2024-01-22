import type WebSocket from 'ws';
import PubSub from 'pubsub-js';
import { getBitmapWebsocketClient } from '#websocketClients';
import { bitstampSubscription, currencyPairSubscription, logger } from '#utils';

export async function subscribeToCurrencyPair(
  currencyPair: string,
  connectionID: string,
  ws: WebSocket,
) {
  const subscribeLimit         = 10;
  const connectionSubscription = currencyPairSubscription.get(connectionID);
  if (!connectionSubscription) return;

  const bitstampCurrencySubscription = bitstampSubscription.get(currencyPair) ?? 0;
  if (connectionSubscription.size < subscribeLimit && !connectionSubscription.has(currencyPair)) {
    const bitstampClient         = await getBitmapWebsocketClient();
    connectionSubscription.add(currencyPair);
    bitstampSubscription.set(currencyPair, bitstampCurrencySubscription + 1);

    PubSub.subscribe(currencyPair, (topic, price) => {
      ws.send(`${topic}: ${price}`);
    });

    logger.debug(`connection(${connectionID}) subscribe to ${currencyPair}`);

    bitstampClient.send(JSON.stringify({
      event: 'bts:subscribe',
      data: {
        channel: `live_trades_${currencyPair}`,
      },
    }));

    ws.send(JSON.stringify({ event: 'subscribe', message: 'ok' }));
  }

  if (connectionSubscription.size >= subscribeLimit) {
    ws.send(JSON.stringify({ event: 'subscribe', message: 'subscription full' }));
  }
}
