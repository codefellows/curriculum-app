'use strict';

const github = require('./lib/github');

exports.handler = async (event, context) => {

  try {

    const request = JSON.parse(event.body);
    const repo = request.repo.replace(/^\//, '');
    const file = request.file.replace(/^\//, '');
    const requestedVersion = request.version || 'main';

    const version = await github.getVersion(repo, requestedVersion);

    const content = await github.getContent(repo, file, version);

    return {
      statusCode: 200,
      body: content,
    };
  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ event, context, error: e.message }),
    };
  }

};
