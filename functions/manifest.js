'use strict';

const superagent = require('superagent');

exports.handler = async (event) => {

  try {
    const request = JSON.parse(event.body);
    const repo = request.repo.replace(/^\//, '');
    const version = request.version || 'master';
    const url = `https://raw.githubusercontent.com/${repo}/${version}/manifest.json`;

    const manifest = await superagent
      .get(url)
      .set('authorization', `Bearer ${process.env.TOKEN}`);

    return {
      statusCode: 200,
      body: manifest.text,
    };

  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }

};
