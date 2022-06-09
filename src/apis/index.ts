import axios from 'axios';

const v1Axios = axios.create({
  baseURL: 'https://api.turtleship.io/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

const v2Axios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export { v1Axios, v2Axios };
