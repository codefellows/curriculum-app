import React from 'react';
import CurriculumContext from './context/curriculum.js';

import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import Facilitator from './facilitator/app.js';
import Student from './student/app.js';

export default function App() {
  return (
    <CurriculumContext>
      <Router>
        <Route path="/facilitator"><Facilitator /></Route>
        <Route path="/student"><Student /></Route>
      </Router>
    </CurriculumContext>
  );
}
