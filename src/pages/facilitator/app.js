import React, { useContext, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { init } from '../../store/curriculum.store.js';
import { CurriculumContext } from '../../context/curriculum.js';

import Content from '../../components/content/content.js';
import Pages from './pages.js';
import Header from './header.js';

const drawerWidth = 320;

function Page(props) {

  const title = useSelector(state => state.curriculum.title);
  const dispatch = useDispatch();
  const context = useContext(CurriculumContext);
  const classes = context.useStyles();

  useEffect(() => {
    dispatch(init());
  }, [dispatch]);

  useEffect(() => {
    document.title = `Guide: ${title || ''}`;
  }, [title]);

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
