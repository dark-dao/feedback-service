'use strict';

import { Mailer } from '../';
import Middleware from './middleware';

export default (server) => {
  const middleware = new Middleware();
  
  server.post('/send', middleware.checkRequest, (req,res) => {
    const { name, phone } = req.body;
    return new Mailer({name, phone}).send().then((result) => {
      res.json(result);
    }, (error) => {
      console.log(error);
      res.status(500).json(error);
    }).catch((error) => {
      console.log(error);
      res.status(500);
    });
  });

  server.all('/', (req, res) => {
    res.status(404);
  });
};
