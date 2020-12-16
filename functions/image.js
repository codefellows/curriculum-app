'use strict';

const axios = require('axios');

exports.handler = async (event, context, callback) => {

  const imageSource = 'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

  try {
    const { org, repo, version, path, image } = event.queryStringParameters;
    const source = `https://raw.githubusercontent.com/${org}/${repo}/${version}/${path}/${image}`;
    const headers = { Authorization: `token ${process.env.TOKEN}` };
    let response = await axios.get(source, { responseType: 'arraybuffer', headers });
    console.log('RESPONSE', response.data);
    imageSource = Buffer.from(response.data).toString('base64')
  } catch (e) {
    console.log(e.message);
  }

  return {
    statusCode: 200,
    body: imageSource
  };

};
