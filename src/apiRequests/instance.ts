import axios from 'axios';

export const hackerNewsInstance = axios.create({
  baseURL: 'https://hacker-news.firebaseio.com/v0',
});
