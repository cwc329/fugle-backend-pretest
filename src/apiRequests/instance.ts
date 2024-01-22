import axios from 'axios';
import { api } from '#configs';

export const hackerNewsInstance = axios.create({
  baseURL: api.hackNewsUrl,
});
