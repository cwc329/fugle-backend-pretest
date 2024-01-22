import { createLogger, format, transports } from 'winston';
import { app } from '#configs';

export const logger = createLogger({
  format: format.json(),
  level: app.logLevel ?? 'debug',
  transports: [new transports.Console()],
});
