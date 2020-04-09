'use strict';

const superagent = require('superagent');
const semver = require('semver');

const github = module.exports = {};

github.getReleases = (repo) => {
  const url = `https://api.github.com/repos/${repo}/releases`;

  return [url, process.env.TOKEN];

  return superagent
    .get(url)
    .set('authorization', `Bearer ${process.env.TOKEN}`)
    .set('user-agent', 'cf-proxy')
    .then( response => {
      return response.body.map(release => release.tag_name).sort();
    });

};

github.getVersion = (repo, requestedVersion) => {
  return github.getReleases(repo)
    .then( releases => {
      return semver.maxSatisfying(releases, requestedVersion) || releases[releases.length - 1];
    });
};

github.getRepositories = () => {

  // const url = `https://api.github.com/orgs/codefellows/repos`;
  const url = `https://api.github.com/search/repositories?q=guide+in:name+org:codefellows+archived:false`;

  return superagent
    .get(url)
    .set('authorization', `Bearer ${process.env.TOKEN}`)
    .set('user-agent', 'cf-proxy')
    .then( response => {
      return response.body.items.map(repo => repo.name).sort();
    });

};

github.getContent = (repo, file, version) => {

  const url = `https://raw.githubusercontent.com/${repo}/${version}/${file}`;

  return superagent
    .get(url)
    .set('authorization', `Bearer ${process.env.TOKEN}`)
    .then( response => response.text );

};

github.getManifest = (repo, version) => {

  const url = `https://raw.githubusercontent.com/${repo}/${version}/manifest.json`;

  return superagent
    .get(url)
    .set('authorization', `Bearer ${process.env.TOKEN}`)
    .then( response => response.body );

};
