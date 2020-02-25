'use strict';

const superagent = require('superagent');

exports.handler = async (event) => {


  try {
    let request = JSON.parse(event.body);
    let repo = request.repo.replace(/^\//, '');
    let version = request.version || 'master';
    let url = `https://raw.githubusercontent.com/${repo}/${version}/manifest.json`;

    let manifest = await superagent
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