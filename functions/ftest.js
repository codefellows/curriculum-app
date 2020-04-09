'use strict';

exports.handler = async (event,context,callback) => {

  const response = {
    statusCode: 200,
    body: ['hello','world'],
  };

  return response;

  try {
    return {
      statusCode: 200,
      body: repos,
    };

  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
