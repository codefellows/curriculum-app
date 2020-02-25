'use strict';

const superagent = require('superagent');

exports.handler = async (event) => {

  let repo = event.repo.replace(/^\//, '');
  let version = event.version || 'master';
  let url = `https://raw.githubusercontent.com/${repo}/${version}/manifest.json`;

  try {
    let manifest = await superagent
      .get(url)
      .set('authorization', `Bearer ${process.env.TOKEN}`);

    return {
      statusCode: 200,
      body: JSON.stringify(manifest.text),
    };

  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }

};