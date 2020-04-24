'use strict';

const github = require('./lib/github.js');

exports.handler = async (event, context, callback) => {

  const request = JSON.parse(event.body);

  const repo = request.repo;
  const version = request.version;
  const path = request.path;

  const files = await github.getTree(repo, version, path);

  const responseBody = { path, files };

  console.log(responseBody);

  return {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  };

};

/*
RELEASES

{
  repository(name: "code-401-javascript-guide", owner: "codefellows") {
    releases(last: 10, orderBy: {field: CREATED_AT, direction: ASC}) {
      edges {
        node {
          tagName
        }
      }
    }
  }
}


## Get the OID for a release

{
  repository(name: "code-401-javascript-guide", owner: "codefellows") {
    ref(qualifiedName: "2.1.0") {
      target {
        ... on Commit {
          history(first: 1) {
            edges {
              node {
                tree {
                  oid
                }
              }
            }
          }
        }
      }
    }
  }
}


*/

