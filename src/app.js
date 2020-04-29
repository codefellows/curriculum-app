import React from 'react';
import { Provider } from 'react-redux';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Facilitator from './pages/facilitator/app.js';
import Student from './pages/student/app.js';
import Assignment from './pages/assignment/app.js';

import CurriculumContext from './context/curriculum.js';
import store from './store/';

export default function App() {

  return (
    <Provider store={store}>
      <CurriculumContext>
        <Router>
          <Route path="/facilitator"><Facilitator /></Route>
          <Route path="/assignment"><Assignment /></Route>
          <Route path="/student/:org/:repo"><Student /></Route>
        </Router>
      </CurriculumContext>
    </Provider>
  );
}
