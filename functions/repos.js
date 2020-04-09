'use strict';

const github = require('./lib/github.js');

exports.handler = async (event,context,callback) => {

  try {

    const repos = await github.getRepositories();

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json'},
      body: JSON.stringify(repos),
    };

  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
