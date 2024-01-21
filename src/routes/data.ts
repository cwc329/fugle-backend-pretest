import { Router } from 'express';
import { getData } from '#controllers';

const data = Router();

data.get('/', getData);

export { data };
