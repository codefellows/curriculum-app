'use strict';

const github = require('./lib/github.js');

exports.handler = async (event) => {

  try {

    // const repos = await github.getRepositories();

    const repos = ['john','cathy'];

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
