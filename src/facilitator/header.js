import React, {useContext, useEffect} from 'react';
import superagent from 'superagent';
import {CurriculumContext} from '../context/curriculum';

const proxy = process.env.REACT_APP_GITHUB_PROXY;

function Header(props) {

  const curriculum = useContext(CurriculumContext);

  return (
    <header>
      <h1>Curriculum</h1>
      <nav>
        <ul>
          <li>
            <label>
              <span>Course</span>
              <select onChange={(e) => curriculum.selectCourse(e.target.value)}>
                <option>Choose Course</option>
                {
                  curriculum.repositories.map( (repo,idx) =>
                    <option key={`repo-${idx}`} value={`/codefellows/${repo}`}>{repo}</option>,
                  )}
              </select>
            </label>
          </li>
          <li>
            <label>
              <span>Version</span>
              <select onChange={ (e) => curriculum.selectVersion(e.target.value)}>
                <option>Choose Version</option>
                {
                  curriculum.versions.map((version, idx) =>
                    <option key={`version-${idx}`} value={version}>{version}</option>,
                  )
                }
              </select>
            </label>
          </li>
        </ul>
      </nav>
    </header>
  );

}

export default Header;
