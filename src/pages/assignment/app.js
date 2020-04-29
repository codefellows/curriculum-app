import React, {useEffect, useContext} from 'react';
import {useDispatch} from 'react-redux';

import { init } from '../../store/curriculum.store.js';
import {CurriculumContext} from '../../context/curriculum.js';

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
