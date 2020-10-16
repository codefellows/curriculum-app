import React, { useEffect, useContext } from 'react';
import { useDispatch } from 'react-redux';
import queryString from 'query-string';

import { init } from '../../store/curriculum.store.js';
import { CurriculumContext } from '../../context/curriculum.js';

import Header from './header.js';
import Content from '../../components/content/content.js';

const drawerWidth = 320;

function Page(props) {

  const dispatch = useDispatch();
  const context = useContext(CurriculumContext);
  const classes = context.useStyles();

  useEffect(() => {
    dispatch(init());
  }, [dispatch]);

  useEffect(() => {
    let qs = queryString.parse(window.location.search);
    let classNumber = qs.class || '';
    let assignment = qs.assignment || '';
    document.title = `Assignment: class-${classNumber} | ${assignment}`
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
