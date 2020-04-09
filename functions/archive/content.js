'use strict';

const superagent = require('superagent');

exports.handler = async (event, context) => {

  try {

    const request = JSON.parse(event.body);
    const repo = request.repo.replace(/^\//, '');
    const file = request.file.replace(/^\//, '');
    const version = request.version || 'master';
    const url = `https://raw.githubusercontent.com/${repo}/${version}/${file}`;

    const content = await superagent
      .get(url)
      .set('authorization', `Bearer ${process.env.TOKEN}`);

    return {
      statusCode: 200,
      body: content.text,
    };
  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ url, token, event, context, error: e.message }),
    };
  }

};
