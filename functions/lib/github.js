'use strict';

const { Octokit } = require('@octokit/rest');
const { graphql } = require('@octokit/graphql');
const Redis = require('ioredis');
const semver = require('semver');

const redis = new Redis(process.env.REDIS_URL);

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

  if (!repo) { return []; }

  try {
    const [org, repository] = repo.split('/');

    const query = `
      {
        repository(name: "${repository}", owner: "${org}") {
          releases(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
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

    const releases = response.repository.releases.edges.map(release => release.node.tagName);

    return releases;

  } catch (e) {
    console.error(`ERROR getReleases(${repo})`, e);
    return [];
  }

};

github.getVersion = async (repo, requestedVersion) => {
  const releases = await github.getReleases(repo);
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
    const repos = response.search.edges.map(repo => repo.node.name).sort();
    return repos;

  } catch (e) {
    console.error('ERROR getRepositories()', e);
    return [];
  }

};

github.getContent = async (repo, file, version) => {

  try {

    const cacheKey = `CONTENT-${repo}-${file}-${version}`;
    let cachedContent = await getFromCache(cacheKey);
    if (cachedContent) { console.log('CONTENT from cache'); return cachedContent; }

    if (!(repo && file && version)) { throw new Error('Invalid request') }

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

    await setCache(cacheKey, content);

    return content;

  } catch (e) {
    console.error(`ERROR getContent(${repo}, ${file}, ${version})`, e);
    return {};
  }

};

github.getManifest = async (repo, version) => {

  const cacheKey = `MANIFEST-${repo}-${version}`;
  const cachedManifest = await getFromCache(cacheKey);
  if (cachedManifest) { console.log('MANIFEST from cache'); return cachedManifest; }

  const manifest = await github.getContent(repo, 'manifest.json', version);
  await setCache(cacheKey, manifest);
  return manifest;
};

github.getZip = async () => {
  try {
    const zip = await octokit.repos.getArchiveLink({
      owner: 'codefellows',
      repo: 'code-401-javascript-guide',
      artifact_id: '2.0.2',
      archive_format: 'zipball',
    });

    console.log('Zip', zip);
  } catch (e) {
    console.error(e.message);
  }
};

github.getTree = async (repo, version, path) => {

  // github.getZip();
  // return null;

  try {

    const cacheKey = `TREE-${repo}-${path}-${version}`;
    const cachedTree = await getFromCache(cacheKey);
    if (cachedTree) {
      console.log('TREE from cache', cacheKey);
      return JSON.parse(cachedTree);
    }

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

    const requests = [];

    // build a list of files, ordered by where they are in the directories
    const fileList = list.data.tree.reduce((acc, file) => {
      path = path.replace(/^\//, '');
      // Filter out those not in our requested path
      // Add to the list, and also fire a request for content, in parallel
      if (file.path.startsWith(path)) {
        file = file.path.replace(path, '').replace(/^\//, '');
        if (file) {
          acc.push(file);
          requests.push(github.getContent(repo, `${path}/${file}`, version));
        }
      }
      return acc;
    }, []);

    // All of the content requests in an array
    const contents = await Promise.all(requests);

    // Merge the file names and content, in a hierarchy/tree
    const tree = fileList.reduce(function (hier, file, idx) {
      let x = hier;
      file.split('/').forEach(function (item) {
        if (!x[item]) {
          x[item] = {};
        }
        x = x[item];
      });
      if (contents[idx]) { x.content = contents[idx]; }
      return hier;
    }, {});

    await setCache(cacheKey, JSON.stringify(tree));

    return tree;

  } catch (e) {
    console.error(`ERROR getTree(${repo}, ${version}, ${path})`, e);
    return [];
  }

};

// Cache Stuff ... should be moved to a DB or Redis or something
const cache = {};

github.getCache = () => {
  return cache;
}

async function getFromCache(key) {
  const value = await redis.get(key);
  return value;
}

async function setCache(key, value) {
  return redis.set(key, value);
}
