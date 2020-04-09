import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import superagent from 'superagent';

const proxy = process.env.REACT_APP_GITHUB_PROXY;

export default props => {

  const [repos, setRepos] = useState([]);
  const [versions, setVersions] = useState([]);
  const [pages, setPages] = useState([]);

  const changeCourse = () => {

  };

  const changeVersion = () => {

  };

  const changePage = () => {

  };

  const getVersions = async () => {
    // let body = { repo, file, version };
    // let response = await superagent.post(proxy).send(body);
    // let markdown = response.text;
    // setContent(markdown);
  };

  const getRepos = async () => {
    let response = await superagent.post(`${proxy}/repos`);
    let repos = JSON.parse(response.text);
    setRepos(repos);
    setVersions([]);
    setPages([]);
  };

  useEffect(() => {
    console.log('getting something');
    let qs = queryString.parse(window.location.search);
    if (qs.repo) {
      let repo = qs.repo.replace(/^\//, '');
    }
  }, [repos]);

  useEffect( () => {
    getRepos();
  }, []);

  return (
    <header>
      <h1>Curriculum</h1>
      <nav>
        <ul>
          <li>
            <label>
              <span>Course</span>
              <select onChange={changeCourse}>
                {
                  repos.map( (repo,idx) =>
                    <option key={`repo-${idx}`} value={repo}>{repo}</option>,
                  )}
              </select>
            </label>
          </li>
          <li>
            <label>
              <span>Version</span>
              <select onChange={changeCourse}>
              </select>
            </label>
          </li>
          <li>
            <label>
              <span>Page</span>
              <select onChange={changePage}>
              </select>
            </label>
          </li>
        </ul>
      </nav>
    </header>
  );

};
