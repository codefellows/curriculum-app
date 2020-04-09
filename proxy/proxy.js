'use strict';

require('dotenv').config();
let express = require('express');
let cors = require('cors');

let getContent = require('../functions/content.js').handler;
let getManifest = require('../functions/manifest.js').handler;
let getReleases = require('../functions/releases.js').handler;
let getRepos = require('../functions/repos.js').handler;

let app = express();

app.use(cors());
app.use(express.json());

app.post('/', page);
app.post('/manifest', manifest);
app.post('/releases', releases);
app.post('/repos', repos);

async function page(req, res) {

  let repo = req.body.repo.replace(/^\//, '');
  let file = req.body.file.replace(/^\//, '');
  let version = req.body.version || 'master';

  let body = { repo, file, version };
  let request = { body: JSON.stringify(body) };

  try {
    let response = await getContent(request);
    res.status(response.statusCode).send(response.body);
  } catch (e) {
    res.status(500).send(e.message);
  }

}

async function manifest(req, res) {

  let repo = req.body.repo.replace(/^\//, '');
  let version = req.body.version || 'master';

  let body = { repo, version };
  let request = { body: JSON.stringify(body) };

  try {
    let response = await getManifest(request);
    res.status(response.statusCode).json(response.body);
  } catch(e) {
    res.status(500).send(e.message);
  }

}

async function releases(req,res) {
  try {
    let repo = req.body.repo.replace(/^\//, '');
    let body = { repo };
    let request = { body: JSON.stringify(body) };
    let response = await getReleases(request);
    res.status(response.statusCode).json(response.body);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function repos(req, res) {
  try {
    let response = await getRepos();
    res.status(response.statusCode).json(response.body);
  } catch(e) {
    res.status(500).send(e.message);
  }
}

app.listen(process.env.PORT, () => console.log('Listening on', process.env.PORT));

