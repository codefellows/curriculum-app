'use strict';

const github = require('./lib/github.js');

exports.handler = async (event, context, callback) => {

  const cache = github.getCache();

  return {
    statusCode: 200,
    body: JSON.stringify(cache),
  };

};
