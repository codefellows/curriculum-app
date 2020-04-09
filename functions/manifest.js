'use strict';

const github = require('./lib/github.js');

exports.handler = async (event,context) => {

  try {
    const request = JSON.parse(event.body);
    const repo = request.repo.replace(/^\//, '');
    const requestedVersion = request.version;

    const version = await github.getVersion(repo, requestedVersion);
    const manifest = await github.getManifest(repo,version);

    return {
      statusCode: 200,
      body: JSON.stringify(manifest),
    };

  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }

};
