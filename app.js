'use strict';
import cluster from 'cluster';
import express from 'express';
const server = express();
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import config from './config';
import { Router } from './modules';

export default () => {
  if (cluster.isMaster) {
    for(let i = 0; i < 1; i++) {
      cluster.fork();
    }
    cluster.on('exit', function (worker) {
      console.log('Ошибка в воркере:', worker.id);
      cluster.fork();
    });
  } else {
    console.log('Воркер %d запущен!', cluster.worker.id);
    server.use(helmet());
    server.use(bodyParser.urlencoded({extended: false}));
    server.use(bodyParser.json());
    server.use(morgan('dev'));

    Router(server);

    server.listen(config.port);
  }
};
