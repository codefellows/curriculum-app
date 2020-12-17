import React from 'react';
import { Provider } from 'react-redux';

import {
  BrowserRouter as Router,
  Route,
  Switch
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
          <Switch>
            <Route path="/:guid/facilitator/:repo" component={Facilitator} />
            <Route path="/:guid/ta/:repo" component={Facilitator} />
            <Route path="/:guid/:repo/:path" component={Assignment} />
            <Route path="/student/:org/:repo" component={Student} />
          </Switch>
        </Router>
      </CurriculumContext>
    </Provider>
  );
}
