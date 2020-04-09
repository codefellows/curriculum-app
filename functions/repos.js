'use strict';

// const github = require('./lib/github.js');

exports.handler = async (event,context,callback) => {

  callback({
    statusCode:200,
    body:'John',
  });
  try {

    const repos = await github.getRepositories();

    let response = {
      statusCode: 200,
      body: repos,
    };
    callback(response);

  }
  catch (e) {
    let response = {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
    callback(response);

  }
};
