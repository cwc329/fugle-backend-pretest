import { Router } from 'express';
import { getData } from '#controllers';
import { rateLimiter } from '#middlewares';

const data = Router();

data.get('/', rateLimiter, getData);

export { data };
