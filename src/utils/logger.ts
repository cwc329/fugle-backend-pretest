import { createLogger, format, transports } from 'winston';
import { appLogger } from '#configs';

export const logger = createLogger({
  format: format.json(),
  level: appLogger.logLevel ?? 'debug',
  transports: [new transports.Console()],
});
