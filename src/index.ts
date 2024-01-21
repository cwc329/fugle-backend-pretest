import { createServer } from 'node:http';
import express from 'express';
import morgan from 'morgan';
import { data } from '#routes';
import { logger } from '#utils';

const app    = express();
const server = createServer(app);

app.use(morgan('dev'));
app.use('/data', data);

const main = () => {
  server.listen(3000, () => {
    logger.info(`ready on http://localhost:${3000}`);
  });
};

main();
