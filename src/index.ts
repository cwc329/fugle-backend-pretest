import { createServer } from 'node:http';
import express from 'express';
import morgan from 'morgan';
import * as config from '#configs';
import { data } from '#routes';
import { logger, redisClient } from '#utils';

const { logFormat, port } = config.app;

const app    = express();
const server = createServer(app);

app.use(morgan(logFormat));
app.use('/data', data);

const main = async () => {
  await redisClient.connect();
  server.listen(port, () => {
    logger.info(`ready on http://localhost:${port}`);
  });
};

main();
