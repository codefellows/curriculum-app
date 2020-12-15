'use strict';

const { Octokit } = require('@octokit/rest');
const { graphql } = require('@octokit/graphql');
const md5 = require('md5');
const semver = require('semver');

const contentModel = require('./curriculum.schema.js');

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

    await setCache(cacheKey, 'content', repo, file, version, content);

    return content;

  } catch (error) {
    const message = { repo, file, version, error }
    console.error(`ERROR getContent()`, message);
    return {};
  }

};

github.getManifest = async (repo, version) => {

  const cacheKey = `MANIFEST-${repo}-${version}`;
  const cachedManifest = await getFromCache(cacheKey);
  if (cachedManifest) { console.log('MANIFEST from cache'); return cachedManifest; }

  const manifest = await github.getContent(repo, 'manifest.json', version);
  await setCache(cacheKey, 'manifest', repo, 'manifest.json', version, manifest);
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

  try {

    if (!(repo && version && path)) { throw new Error("Invalid params") }

    const cacheKey = `TREE-${repo}-${path}-${version}`;
    const cachedTree = await getFromCache(cacheKey);
    if (cachedTree) {
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

    // Get the "sha" of the repo at the specified version
    const sha = response.repository.ref.target.history.edges[0].node.tree.oid;

    // use that "sha" to fetch the full file tree
    // this is big, but it's the only way to get the full structure
    const list = await octokit.git.getTree({
      owner: org,
      repo: repository,
      tree_sha: sha,
      recursive: true,
    });

    const requests = [];

    // build a list of files (everything in the repo), ordered by where they are in the directories and fetch in parallel
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

    // All of the content requests in an array, from the parallel fetching move above
    const contents = await Promise.all(requests);

    // Now, Merge the file names and content, a hierarchy/tree
    const tree = fileList.reduce(function (fileTree, file, idx) {
      let x = fileTree;
      file.split('/').forEach(function (item) {
        if (!x[item]) {
          x[item] = {};
        }
        x = x[item];
      });
      if (contents[idx]) { x.content = contents[idx]; }
      return fileTree;
    }, {});

    await setCache(cacheKey, 'tree', repo, path, version, JSON.stringify(tree));

    return tree;

  } catch (e) {
    console.error(`ERROR getTree(${repo}, ${version}, ${path})`, e);
    return [];
  }

};

async function getFromCache(key) {
  try {
    const id = md5(key);
    const content = await contentModel.query("id").eq(id).exec();
    return content[0].content || null;
  } catch (e) {
    return null;
  }
}

// (cacheKey, type, repo, path, version, JSON.stringify(tree));
async function setCache(key, type, repo, path, version, content) {
  const id = md5(key);
  const record = new contentModel({ id, type, repo, path, version, content })
  const data = await record.save();
  return content;
}
