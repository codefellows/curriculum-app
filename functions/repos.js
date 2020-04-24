'use strict';

const github = require('./lib/github.js');

exports.handler = async (event,context,callback) => {

  // For now, hardcoded list until we tag the repos
  const repos = [
    'code-201-guide',
    'code-301-guide',
    'code-401-dotnet-guide',
    'code-401-java-guide',
    'code-401-javascript-guide',
    'code-401-python-guide',
    'code-dsa-guide',
    'career-coaching-guide',
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(repos),
  };

  try {

    const repos = await github.getRepositories();

    return {
      statusCode: 200,
      body: JSON.stringify(repos),
    };

  }
  catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
};
