'use strict';

const github = require('./lib/github.js');

exports.handler = async (event, context) => {

  try {

    console.log('EVENT', event);
    console.log('BODY', event.body);

    const request = JSON.parse(event.body);
    const repo = request.repo.replace(/^\//, '');

    console.log('Releases for', repo);
    const releases = await github.getReleases(repo);
    console.log('Found:', releases);

    return {
      statusCode: 200,
      body: JSON.stringify(releases),
    };

  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }

};
