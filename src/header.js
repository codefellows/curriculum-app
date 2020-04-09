import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import superagent from 'superagent';

export default props => {

  const [repos, setRepos] = useState([]);
  const [versions, setVersions] = useState([]);

  const getVersions = async () => {

  };

  const getRepos = async () => {

  };

  useEffect(() => {
    console.log('getting something');
    let qs = queryString.parse(window.location.search);
    if (qs.repo) {
      let repo = qs.repo.replace(/^\//, '');
    }
  }, [window.location.search]);

  useEffect( () => {
    getRepos();
  }, []);

  return <header>Logo and fancy title</header>;

};
