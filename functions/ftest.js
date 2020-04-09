'use strict';

exports.handler = async (event,context,callback) => {

  const response = {
    statusCode: 200,
    body: ['hello','world'],
  };

  callback(response);

};
