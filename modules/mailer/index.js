'use strict';
import Promise from 'bluebird';
import nodemailer from 'nodemailer';
import { isUndefined, size } from 'lodash';
import { isMobilePhone } from 'validator';

import config from '../../config';
import mailTemplate from './mail-template';

export default class {
  constructor(message) {
    this.message = message;
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: config.emailSender.login,
          pass: config.emailSender.password
      }
    });
  }
  checkMessage() {
    const { name, phone } = this.message;
    let result = {
      success: true,
      errors: []
    };
    if(isUndefined(name) || isUndefined(phone)) {
      result.success = false;
      result.errors.push('Не переданно одно из полей.');
      return result;
    }
    if(!size(name) || typeof name !== 'string') {
      result.success = false;
      result.errors.push(`Поле <Имя> не заполнено или передан неверный тип - ${typeof name}`);
    }
    if(!size(phone) || typeof phone !== 'string') {
      result.success = false;
      result.errors.push(`Поле <Телефон> не заполнено или передан неверный тип - ${typeof phone}`);
    }
    // if(!isMobilePhone(phone, ['ru-RU'])) {
    //   result.success = false;
    //   result.errors.push(`Поле <Телефон> не соответствует формату телефонного номера`);
    // }
    return result;
  }
  send() {
    return new Promise ((resolve, reject) => {
      const checkMessage = this.checkMessage();
      if(!checkMessage.success) {
        return reject(checkMessage);
      }
      return this.transporter.sendMail(mailTemplate(this.message), (error, info) => {
        if (error) {
          return reject({success: false, message: 'Ошибка при отправке', error: error});
        } else {
          return resolve({success: true, message: 'Сообщение отправлено'});
        }
      });
    });
  }
};
