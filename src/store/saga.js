import { select, call, put, takeEvery } from 'redux-saga/effects';
import superagent from 'superagent';
import queryString from 'query-string';
import getTitle from 'get-title-markdown';

const sampleManifest = require('./manifest.json');

const proxy = process.env.REACT_APP_GITHUB_PROXY;

// Maybe switch to more specific selectors for cleanliness
// const getItems = state => state.items;

// Superagent Wrapper, yielded by saga's call() method
function api(endpoint, options) {
  const url = `${proxy}${endpoint}`;
  return superagent.post(url).send(options);
}

// Action Watchers
export function* watchInit() {
  yield takeEvery('curriculum/init', initializeApp);
}

export function* watchSelectCourse() {
  yield takeEvery('curriculum/selectCourse', loadVersions);
}

export function* watchSelectVersion() {
  yield takeEvery('curriculum/selectVersion', loadManifest);
}

export function* watchSelectPage() {
  yield takeEvery('curriculum/selectPage', loadPage);
}

export function* watchOpenDemo() {
  yield takeEvery('curriculum/openDemo', loadDemo);
}

// Async Action Workers
function* initializeApp(action) {

  // Anything interesting in the URL or the path?
  let qs = queryString.parse(window.location.search);
  let course = qs.repo ? qs.repo.replace(/^\//, '') : action.payload;
  let file = qs.file ? qs.file.replace(/^\//, '') : '/curriculum/README.md';
  let version = qs.version || 'master';

  // Maybe pre-fetch pages, versions, content
  if(course) {
    yield put({ type: 'curriculum/selectCourse', payload: course });
  }
  if(version) {
    yield put({ type: 'curriculum/selectVersion', payload: version });
  }
  if(file) {
    yield put({ type: 'curriculum/selectPage', payload: file });
  }

  // Always, fetch the list of available courses
  const endpoint = `/repos`;
  const selections = {};
  const response = yield call(api, endpoint, selections);
  const courses = JSON.parse(response.text);

  yield put({ type: 'curriculum/setRepositories', payload: courses });

}

function* loadVersions() {

  const state = yield select();
  const endpoint = `/releases`;
  const selections = { repo: state.curriculum.repo };
  const response = yield call(api, endpoint, selections);
  const versions = JSON.parse(response.text);

  yield put({ type: 'curriculum/setVersions', payload:versions });

}

function* loadManifest() {

  let test = true;

  if ( test ) {
    yield put({ type: 'curriculum/setPages', payload: sampleManifest });
    return;
  }

  const state = yield select();
  const endpoint = `/manifest`;
  const selections = {
    repo: state.curriculum.repo,
    version: state.curriculum.version,
  };
  const response = yield call(api, endpoint, selections);
  const manifest = JSON.parse(response.text);

  yield put({ type: 'curriculum/setPages', payload: manifest });

}

function* loadPage() {

  const state = yield select();
  const endpoint = `/content`;
  const selections = {
    repo: state.curriculum.repo,
    version: state.curriculum.version,
    file: state.curriculum.file,
  };
  const response = yield call(api, endpoint, selections);
  const content = response.text;
  const title = yield getTitle(content);

  yield put({ type: 'curriculum/setTitle', payload: title });
  yield put({ type: 'curriculum/setMarkdown', payload: content });

}

function* loadDemo() {

  const state = yield select();
  const endpoint = `/tree`;
  const selections = {
    repo: state.curriculum.repo,
    version: state.curriculum.version,
    path: state.curriculum.demoFolder,
  };
  const response = yield call(api, endpoint, selections);
  const tree = JSON.parse(response.text);

  yield put({ type: 'curriculum/setDemoFiles', payload:tree });

}

