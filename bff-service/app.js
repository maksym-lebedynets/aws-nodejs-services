import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
export const headers = {
  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
  'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
};

app.use(cors());
app.use(express.json());

let cache = {};

setInterval(() => {
  cache = {};
}, 10000);

app.all('*', async (req, res) => {
  const url = req.originalUrl;
  const serviceName = url.split('/')[1].toUpperCase();
  const serviceURL = process.env[serviceName];
  const cacheKey = req.method + '/' + serviceURL;

  console.log('resource: ' + serviceName);
  console.log('resource url: ' + serviceURL);
  console.log('___');

  if (serviceURL) {
    if (cache[cacheKey]) {
      res.send(cache[cacheKey]);

      return;
    }

    try {
      const isBodyExist = Object.keys(req.body || {}).length > 0;
      const requestConfig = {
        method: req.method,
        url: serviceURL,
      };

      if (isBodyExist) {
        requestConfig.data = req.body;
      }

      const response = await axios(requestConfig);

      cache[cacheKey] = response.data;

      res.send(response.data);
    } catch(error) {
      res.status(error.status).send(error.data);
    }
  } else {
    res.status(502).send('Cannot process request!');
  }
});

app.listen(port, () => {
  console.log(`Application is on ${port} port`);
});
