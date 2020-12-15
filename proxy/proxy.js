'use strict';

require('dotenv').config();
let path = require('path');
let express = require('express');
let cors = require('cors');
let axios = require('axios');

let getContent = require('../functions/content.js').handler;
let getManifest = require('../functions/manifest.js').handler;
let getReleases = require('../functions/releases.js').handler;
let getRepos = require('../functions/repos.js').handler;
let getTree = require('../functions/tree.js').handler;
let getCache = require('../functions/cache.js').handler;
let getCourses = require('../functions/courses.js').handler;
let getCourse = require('../functions/course.js').handler;

let app = express();
let buildFolder = path.resolve(process.cwd(), './build');

app.use(cors());
app.use(express.json());
app.use(express.static(buildFolder));

app.get('/courses', courses)
app.get('/course/:id', course)
app.post('/content', page);
app.post('/manifest', manifest);
app.post('/releases', releases);
app.post('/repos', repos);
app.post('/tree', tree);
app.get('/cache', cache);
app.get('/image', image)

app.use('*', (req, res) => {
  res.sendFile(path.resolve(buildFolder, 'index.html'));
});


async function course(req, res) {
  try {
    let response = await getCourse({ pathParameters: { id: req.params.id } });
    res.status(response.statusCode).send(response.body);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function courses(req, res) {
  try {
    let response = await getCourses();
    res.status(response.statusCode).send(response.body);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function cache(req, res) {
  try {
    let response = await getCache();
    res.status(response.statusCode).send(response.body);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

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
    res.status(response.statusCode).send(response.body);
  } catch (e) {
    res.status(500).send(e.message);
  }

}

async function releases(req, res) {
  try {
    let repo = req.body.repo.replace(/^\//, '');
    let body = { repo };
    let request = { body: JSON.stringify(body) };
    let response = await getReleases(request);
    res.status(response.statusCode).send(response.body);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function repos(req, res) {
  try {
    let response = await getRepos();
    res.status(response.statusCode).send(response.body);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function tree(req, res) {
  try {
    let repo = req.body.repo.replace(/^\//, '');
    let version = req.body.version || 'master';
    let path = req.body.path || '';
    let body = { repo, version, path };
    let request = { body: JSON.stringify(body) };
    let response = await getTree(request);
    res.status(response.statusCode).send(response.body);
  } catch (e) {
    res.status(500).send(e.message);
  }
}

async function image(req, res) {
  try {
    const { org, repo, version, path, image } = req.query;
    const source = `https://raw.githubusercontent.com/${org}/${repo}/${version}/${path}/${image}`;
    const headers = { Authorization: `token ${process.env.TOKEN}` };
    let response = await axios.get(source, { responseType: 'arraybuffer', headers });
    let imageSource = Buffer.from(response.data).toString('base64')
    res.send(imageSource);
  } catch (e) {
    res.send('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')
  }
}

app.listen(process.env.PORT, () => console.log('Listening on', process.env.PORT));

