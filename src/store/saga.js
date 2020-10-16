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
  let version = qs.version || 'master';
  let moduleNumber = qs.module;
  let classNumber = qs.class;
  let assignment = qs.assignment;

  // Maybe pre-fetch pages, versions, content
  if (course) {
    yield put({ type: 'curriculum/selectCourse', payload: course });
  }
  if (version) {
    yield put({ type: 'curriculum/selectVersion', payload: version });
  }
  if (moduleNumber && classNumber && assignment) {
    yield put({ type: 'curriculum/selectPage', payload: { moduleNumber, classNumber, assignment } });
  }

  // Always, fetch the list of available courses

  try {
    const endpoint = `/repos`;
    const selections = {};
    const response = yield call(api, endpoint, selections);
    const courses = JSON.parse(response.text);
    yield put({ type: 'curriculum/setRepositories', payload: courses });
  } catch (e) {
    yield put({ type: 'curriculum/setError', payload: e.message });
  }


}

function* loadVersions() {

  try {
    const state = yield select();
    const endpoint = `/releases`;
    const selections = { repo: state.curriculum.repo };
    const response = yield call(api, endpoint, selections);
    const versions = JSON.parse(response.text);
    yield put({ type: 'curriculum/setVersions', payload: versions });
  } catch (e) {
    yield put({ type: 'curriculum/setError', payload: e.message });
  }

}

function* loadManifest() {

  try {
    let test = true;
    if (test) {
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
  } catch (e) {
    yield put({ type: 'curriculum/setError', payload: e.message });
  }

}

function* loadPage() {

  try {
    const state = yield select();
    const endpoint = `/content`;

    const baseRepo = state.curriculum.file.repository;
    const repo = `/codefellows/${baseRepo}`;
    const file = state.curriculum.file.path;
    const version = state.curriculum.pages.dependencies[baseRepo];

    const selections = { repo, version, file };

    if (!(selections.repo && selections.version && selections.file)) { return; }

    const response = yield call(api, endpoint, selections);
    const content = response.text;
    const title = yield getTitle(content);
    if (content === '{}') { throw new Error('No Content Found'); }
    yield put({ type: 'curriculum/setTitle', payload: title });
    yield put({ type: 'curriculum/setMarkdown', payload: content });
  } catch (e) {
    yield put({ type: 'curriculum/setError', payload: e.message });
  }
}

function* loadDemo() {

  try {
    const state = yield select();
    const endpoint = `/tree`;

    const baseRepo = state.curriculum.demo.repository;
    const repo = `/codefellows/${baseRepo}`;
    const path = state.curriculum.demo.path;
    const version = state.curriculum.pages.dependencies[baseRepo];

    const selections = {
      repo,
      version,
      path,
    };
    const response = yield call(api, endpoint, selections);
    const tree = JSON.parse(response.text);
    if (!Object.keys(tree.files).length) { throw new Error('Nothing to Demo'); }
    yield put({ type: 'curriculum/setDemoFiles', payload: tree });
  } catch (e) {
    yield put({ type: 'curriculum/setError', payload: e.message });
  }
}

