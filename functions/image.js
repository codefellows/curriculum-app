'use strict';

const axios = require('axios');

exports.handler = async (event, context, callback) => {

  const imageSource = 'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

  try {
    const { org, repo, version, path, image } = event.queryStringParameters;
    console.log('qs', event.queryStringParameters);
    const source = `https://raw.githubusercontent.com/${org}/${repo}/${version}/${path}/${image}`;
    console.log('source', source);
    const headers = { Authorization: `token ${process.env.TOKEN}` };
    let response = await axios.get(source, { responseType: 'arraybuffer', headers });
    let imageSource = Buffer.from(response.data).toString('base64')
    res.send(imageSource);
  } catch (e) {
    content.log(e.message);
  }

  return {
    statusCode: 200,
    body: imageSource
  };

};
