'use strict';

const superagent = require('superagent');

exports.handler = async (event) => {

  let token = 'e2add8f240e4871f0542affed5ff802d002696b2';

  let repo = event.repo.replace(/^\//, '');
  let version = event.version || 'master';
  let url = `https://raw.githubusercontent.com/${repo}/${version}/manifest.json`;

  try {
    let response = await superagent.get(url).set('authorization', `Bearer ${token}`);
    let manifest = JSON.parse(response.text);

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