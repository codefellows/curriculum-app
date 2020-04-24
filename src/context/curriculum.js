import React, {useState, useEffect, useCallback} from 'react';
import superagent from 'superagent';
import queryString from 'query-string';
import getTitle from 'get-title-markdown';

import sampleManifest from './manifest.json';

const proxy = process.env.REACT_APP_GITHUB_PROXY;

export const CurriculumContext = React.createContext();

function Curriculum(props) {

  const [markdown, setMarkdown] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [versions, setVersions] = useState([]);
  const [pages, setPages] = useState([]);

  const [classInfo, setClass] = useState({});
  const [title, setTitle] = useState('');
  const [repo, setRepo] = useState('');
  const [version, setVersion] = useState('');
  const [file, setFile] = useState('');


  // Exported event handlers.  As the user changes their selections from the UI,
  // these functions use their setState methods to change `selections`
  // Below, there are useEffect hooks watching for selections to change and re-pull data
  const selectCourse = async (repo) => {
    document.title = repo.split('/').pop();
    setRepo(repo);
    setVersion('');
    setFile('');
    setMarkdown('');
    setPages([]);
  };

  const selectVersion = async (version) => {
    document.title = `${repo.split('/').pop()} @ ${version}`;
    setVersion(version);
    setFile('');
    setMarkdown('');
    setPages([]);
  };

  const selectPage = async (file) => {
    setFile(file);
  };

  // Used internally to get page Markdown ... should run any time the file or version changes
  const getMarkdown = useCallback( async () => {
    try {
      if ( repo && version && file ) {
        const url = `${proxy}/content`;
        const selections = {repo,version,file};
        const response = await superagent.post(url).send(selections);
        const rawMarkdown = response.text;
        setTitle( getTitle(rawMarkdown) );
        setMarkdown(rawMarkdown);
      }
    } catch(e) {
      console.warn('ERROR: getMarkdown()', e.message);
    }
  },[repo,version,file]);

  // Used internally to read the course manifest and load the page navigator
  const getPages = useCallback( async () => {
    // repo && version && setPages(sampleManifest); return;
    try {
      if (repo && version) {
        const url = `${proxy}/manifest`;
        const selections = {repo,version};
        let response = await superagent.post(url).send(selections);
        let manifest = JSON.parse(response.text);
        setPages(manifest);
      }
    } catch(e) {
      console.warn('ERROR getPages()', e.message);
    }
  }, [repo,version]);

  // Used internally to load versions after a course has been selected
  const getVersions = useCallback( async () => {
    try {
      const url = `${proxy}/releases`;
      const selections = {repo};
      let response = await superagent.post(url).send(selections);
      let availableVersions = JSON.parse(response.text);
      setVersions(availableVersions);
    } catch(e) {
      console.warn('ERROR getVersions()', e.message);
    }
  }, [repo]);

  // Used internally to load the initial set of courses
  const getCourses = async () => {
    try {
      const url = `${proxy}/repos`;
      let response = await superagent.post(url);
      let courseRepos = JSON.parse(response.text);
      setRepositories(courseRepos);
    } catch(e) {
      console.warn('ERROR getCourses()', e.message);
    }
  };

  useEffect( () => {
    repo && getVersions();
  }, [getVersions,repo]);

  useEffect( () => {
    version && getPages();
  }, [getPages,version]);

  useEffect( () => {
    file && getMarkdown();
  }, [getMarkdown,file]);

  // This should only run once, and trigger getMarkdown by changing the selctions
  // based on the query string
  useEffect(() => {
    document.title = 'Curriculum Browser';
    let qs = queryString.parse(window.location.search);
    if ( qs.repo && qs.file && qs.version ) {
      setVersion(qs.version);
      setRepo(qs.repo.replace(/^\//, ''));
      setFile(qs.file.replace(/^\//, ''));
    }
    getCourses();
  }, []);

  const exports = {
    markdown,
    repositories,
    versions,
    pages,
    file,
    title,
    repo,
    classInfo,
    setClass,
    getCourses,
    selectCourse,
    selectVersion,
    selectPage,
  };

  return (
    <CurriculumContext.Provider value={exports}>
      {props.children}
    </CurriculumContext.Provider>
  );
}

export default Curriculum;
