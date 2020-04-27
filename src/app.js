import React from 'react';
import { Provider } from 'react-redux';

import store from './store/';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import 'typeface-roboto';

import Facilitator from './facilitator/app.js';
// import Student from './student/app.js';
// import Assignment from './assignment/app.js';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Route path="/facilitator"><Facilitator /></Route>
        {/* <Route path="/assignment"><Assignment /></Route>
        <Route path="/student/:org/:repo"><Student /></Route> */}
      </Router>
    </Provider>
  );
}
