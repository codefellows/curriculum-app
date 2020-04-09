import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import superagent from 'superagent';

const proxy = process.env.REACT_APP_GITHUB_PROXY;

export default props => {

  return (
    <header>
      <h1>Curriculum</h1>
    </header>
  );

};
