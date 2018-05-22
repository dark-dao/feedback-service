'use strict';

import config from '../../config';

class Middleware {
  constructor() {

  }
  checkRequest(req, res, next) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1);
    ip = `${ip}`;

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token == config.secretToken) {
      next();
    } else {
      console.log('ЗАПРОС С НЕ ВАЛИДНЫМ ТОКЕНОМ!');
      console.log("ip: ", ip);
      console.log("token: ", token);
      res.status(404);
      res.end();
    }
  }
};

export default Middleware;
