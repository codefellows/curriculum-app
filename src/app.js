import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';

import Facilitator from './facilitator/app.js';
import Student from './student/app.js';

export default function App() {
  return (
    <Router>
      <Route path="/facilitator"><Facilitator /></Route>
      <Route path="/student"><Student /></Route>
    </Router>
  );
}
