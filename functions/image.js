'use strict';

const axios = require('axios');

exports.handler = async (event, context, callback) => {

  console.log('IMAGE-EVENT', event);
  console.log('IMAGE-CONTEXT', context);
  const imageSource = 'R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

  try {
    console.log('EVENT', event);
    const { org, repo, version, path, image } = { event }
    const source = `https://raw.githubusercontent.com/${org}/${repo}/${version}/${path}/${image}`;
    const headers = { Authorization: `token ${process.env.TOKEN}` };
    let response = await axios.get(source, { responseType: 'arraybuffer', headers });
    let imageSource = Buffer.from(response.data).toString('base64')
    res.send(imageSource);
  } catch (e) {
    context.log(e.message);
  }

  return {
    statusCode: 200,
    body: imageSource
  };

};
