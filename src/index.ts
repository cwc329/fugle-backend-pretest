import express from 'express';
import expressWs from 'express-ws';
import morgan from 'morgan';
import * as config from '#configs';
import { streamWebsocket } from '#controllers';
import { data } from '#routes';
import {
  logger,
  redisClient,
} from '#utils';

const { logFormat, port } = config.app;

const { app } = expressWs(express());

app.use(morgan(logFormat));
app.use('/data', data);

app.ws('/stream', streamWebsocket);

const main = async () => {
  logger.info('Initializing server...');
  await redisClient.connect();
  app.listen(port, () => {
    logger.info(`ready on http://localhost:${port}`);
  });
};

main();
