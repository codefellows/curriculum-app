import React from 'react';
import { useParams } from 'react-router-dom';
import queryString from 'query-string';

import { init, selectVersion, selectCourse, selectPage } from './store/curriculum.store';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import 'typeface-roboto';

import Facilitator from './facilitator/app.js';
import Student from './student/app.js';
import Assignment from './assignment/app.js';

export default function App() {

  const { org, repo, module, classNumber } = useParams();

  function initialize(dispatch) {
    if (!dispatch) { return; }
    document.title = 'Curriculum Browser';

    let qs = queryString.parse(window.location.search);
    let course = qs.repo ? qs.repo.replace(/^\//, '') : (org && repo) ? `${org}/${repo}` : '';
    let file = qs.repo.replace(/^\//, '') || '/curriculum/README.md';
    let version = qs.version || 'master';

    dispatch(selectCourse(course));
    dispatch(selectVersion(version));
    dispatch(selectPage(file));
    dispatch(init());
  }

  return (
    <Router>
      <Route path="/facilitator" onEnter={initialize(store.dispatch)}><Facilitator /></Route>
      <Route path="/assignment" onEnter={initialize(store.dispatch)}><Assignment /></Route>
      <Route path="/student/:org/:repo" onEnter={initialize(store.dispatch)}><Student /></Route>
    </Router>
  );
}
