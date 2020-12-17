import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';

import { selectCourse, selectVersion, setFile, assignment } from '../../store/curriculum.store.js';
import { CurriculumContext } from '../../context/curriculum.js';

import Header from './header.js';
import Content from '../../components/content/content.js';

import courses from '../../sfdc.json';

const drawerWidth = 320;

function Page(props) {

  const dispatch = useDispatch();
  const context = useContext(CurriculumContext);
  const classes = context.useStyles();

  useEffect(() => {
    /*
       Because React BrowserRouter can't glob the full remaining part of the path, we have to do it manually here
       Assuming a url like: /ccd2653f-ea84-42d9-9a12-9edb268cbdf4/code-401-javascript-guide/curriculum/class-02/DISCUSSION.md
       guid is the first part, repo is the second
       The end, /curriculum/class-02/DISCUSSION.md is intended to be the full file path, but browser router only pulls out the firs strand
       So, we'll create it manually, by pulling off what Router thinks is the path (/curriculum) from the full path
       and then reconstituting it.  Icky, but necessary
     */
    const { guid, repo, path } = props.match.params;
    if (courses[guid]) {
      const root = props.match.url.replace(path, '');  // becomes /ccd2653f-ea84-42d9-9a12-9edb268cbdf4/code-401-javascript-guide/
      const file = {
        path: props.location.pathname.replace(root, ''), // becomes /curriculum/class-02/DISCUSSION.md,
        repository: repo
      };
      dispatch(selectCourse(repo));
      dispatch(selectVersion(courses[guid][repo].version));
      dispatch(setFile(file));
      dispatch(assignment());
    }
  }, [dispatch]);

  useEffect(() => {
    // document.title = `Assignment: class-${classNumber} | ${assignment}`
  }, [])

  return (
    <div className={classes.root}>
      <Header drawerWidth={drawerWidth} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Content />
      </main>
    </div>
  );
}

export default Page;
