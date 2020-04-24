import React from 'react';
import CurriculumContext from './context/curriculum.js';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import 'typeface-roboto';

import Facilitator from './facilitator/app.js';
import Student from './student/app.js';
import Assignment from './assignment/app.js';

export default function App() {
  return (
    <CurriculumContext>
      <Router>
        <Route path="/facilitator"><Facilitator /></Route>
        <Route path="/assignment"><Assignment /></Route>
        <Route path="/student/:org/:repo/:module/:classNumber"><Student /></Route>
      </Router>
    </CurriculumContext>
  );
}
