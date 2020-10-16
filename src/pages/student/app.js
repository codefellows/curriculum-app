import React, { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { init } from '../../store/curriculum.store.js';
import { CurriculumContext } from '../../context/curriculum.js';

import Content from '../../components/content/content.js';
import Header from './header.js';
import Pages from './pages.js';

const drawerWidth = 320;

function Page() {

  const title = useSelector(state => state.curriculum.title);
  const { org, repo } = useParams();
  const dispatch = useDispatch();
  const context = useContext(CurriculumContext);
  const classes = context.useStyles();

  useEffect(() => {
    if (org && repo) {
      const course = `${org}/${repo}`;
      dispatch(init(course));
    }
  }, [dispatch, org, repo]);

  useEffect(() => {
    document.title = `Guide: ${title || ''}`;
  }, [title])

  return (
    <div className={classes.root}>
      <Header drawerWidth={drawerWidth} />
      <Pages drawerWidth={drawerWidth} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Content />
      </main>
    </div>
  );
}

export default Page;
