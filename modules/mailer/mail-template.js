'use strict';

import config from '../../config';

export default (message) => {
  return {
    from: `Уведомление с сайта <${config.emailSender.login}>`, // sender address
    to: config.emailRecipient, // list of receivers
    subject: 'Новое уведомление', // Subject line
    priority: 'hight',
    text: `Посетитель сайта просит перезвонить ему\n\nИмя: ${message.name}\n\nТелефон: ${message.phone}\n\n` // plain text body
    //html: `` // html body
  }
};
