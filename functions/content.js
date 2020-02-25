'use strict';

const superagent = require('superagent');

exports.handler = async (event, context) => {

    return {
        statusCode: 200,
        body: JSON.stringify({event, context})
    };

  let repo = event.repo.replace(/^\//, '');
  let file = event.file.replace(/^\//, '');
  let version = event.version || 'master';
  let url = `https://raw.githubusercontent.com/${repo}/${version}/${file}`;
  try {
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
