'use strict';

const github = require('./lib/github');

exports.handler = async (event, context) => {

  try {

    console.log("LAMBDA event", event);
    const request = JSON.parse(event.body);
    const repo = request.repo.replace(/^\//, '');
    const file = request.file.replace(/^\//, '');
    const requestedVersion = request.version || 'main';

    console.log("Get Version", repo, requestedVersion);

    const version = await github.getVersion(repo, requestedVersion);

    console.log("Version:", version);

    const content = await github.getContent(repo, file, version);

    console.log("Content:", content);

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
