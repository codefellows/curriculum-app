'use strict';

const { Octokit } = require('@octokit/rest');
const { graphql } = require('@octokit/graphql');
const semver = require('semver');

const octokit = new Octokit({
  auth: process.env.TOKEN,
});

const octokitGraphql = graphql.defaults({
  headers: {
    authorization: `token ${process.env.TOKEN}`,
  },
});

const github = module.exports = {};

github.getReleases = async (repo) => {

  try {
    const [org, repository] = repo.split('/');

    const query = `
    {
      repository(name: "${repository}", owner: "${org}") {
        releases(last: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
          edges {
            node {
              tagName
            }
          }
        }
      }
    }
  `;

    const response = await octokitGraphql(query);

    const releases = response.repository.releases.edges.map( release => release.node.tagName );

    return releases;

  } catch(e) {
    console.error(e);
    return '';
  }

};

github.getVersion = async (repo, requestedVersion) => {
  const releases = github.getReleases(repo);
  return semver.maxSatisfying(releases, requestedVersion) || releases[releases.length - 1];
};

github.getRepositories = async () => {

  const queryWithReleases = `
    {
      search(type: REPOSITORY, query: "code in:name guide in:name org:codefellows archived:false", first: 100) {
        edges {
          node {
            ... on Repository {
              name
              releases(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
                edges {
                  node {
                    tagName
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const query = `
    {
      search(type: REPOSITORY, query: "code in:name guide in:name org:codefellows archived:false", first: 100) {
        edges {
          node {
            ... on Repository {
              name
            }
          }
        }
      }
    }
  `;

  try {

    const response = await octokitGraphql(query);
    const repos = response.search.edges.map( repo => repo.node.name ).sort();
    return repos;

  } catch(e) {
    console.error(e);
    return [];
  }

};

github.getContent = async (repo, file, version) => {

  try {

    const [org, repository] = repo.split('/');

    const query = `
      {
        repository(owner: "${org}", name: "${repository}") {
          content: object(expression: "${version}:${file}") {
          ...on Blob {
              text
            }
          }
        }
      }
   `;

    const response = await octokitGraphql(query);

    const content = response.repository.content.text;
    return content;

  } catch (e) {
    console.error(e);
    return '';
  }

};

github.getManifest = async (repo, version) => {
  const manifest = await  github.getContent( repo, 'manifest.json', version);
  return manifest;
};

github.getTree = async (repo, version, path) => {

  try {

    const [org, repository] = repo.split('/');

    const query = `
      {
        repository(name: "${repository}", owner: "${org}") {
          ref(qualifiedName: "${version}") {
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
    `;

    const response = await octokitGraphql(query);

    const sha = response.repository.ref.target.history.edges[0].node.tree.oid;

    const list = await octokit.git.getTree({
      owner: org,
      repo: repository,
      tree_sha: sha,
      recursive: true,
    });

    const files = list.data.tree.reduce((acc, file) => {
      if (file.path.startsWith(path)) {
        file = file.path.replace(path, '').replace(/^\//, '');
        file && acc.push(file);
      }
      return acc;
    }, []);

    return files;

  } catch (e) {
    console.error(e);
    return '';
  }

};
