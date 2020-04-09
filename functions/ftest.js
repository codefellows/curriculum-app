'use strict';

exports.handler = async (event,context) => {

  const response = {
    statusCode: 200,
    body: JSON.stringify(['hello','world']),
  };

  return response;

};
