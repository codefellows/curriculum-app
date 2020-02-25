'use strict';

const superagent = require('superagent');

exports.handler = async (event, context) => {

  try {

    let request = JSON.parse(event.body);
    let repo = request.repo.replace(/^\//, '');
    let file = request.file.replace(/^\//, '');
    let version = request.version || 'master';
    let url = `https://raw.githubusercontent.com/${repo}/${version}/${file}`;

    let content = await superagent
      .get(url)
      .set('authorization', `Bearer ${process.env.TOKEN}`);

    return {
      statusCode: 200,
      body: JSON.stringify(content.text),
    };
  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({event, context, error: e.message }),
    };
  }

};
