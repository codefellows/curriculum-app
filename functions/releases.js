'use strict';

const github = require('./lib/github.js');

exports.handler = async (event) => {

  try {

    const request = JSON.parse(event.body);
    const repo = request.repo.replace(/^\//, '');

    const releases = await github.getReleases(repo);

    return {
      statusCode: 200,
      body: releases,
    };

  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }

};
