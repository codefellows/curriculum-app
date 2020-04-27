import React, { useEffect, useContext } from 'react';

import { useParams } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';

import {CurriculumContext} from '../context/curriculum';
import Header from './header.js';
import Content from '../components/content-context/content.js';
import Pages from './pages.js';

const drawerWidth = 320;

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#e0e0e0',
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      contrastText: '#ffcc00',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor:'#FBFCFC',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    backgroundColor: '#FBFCFC',
  },
}));

export default function App() {

  const classes = useStyles();
  const curriculum = useContext(CurriculumContext);
  const { org, repo, module, classNumber } = useParams();

  const setCourse = () => {
    if ( org && repo ) {
      const course = `${org}/${repo}`;
      curriculum.selectCourse(course);
      curriculum.selectVersion('master');
      curriculum.selectPage('/curriculum/README.md');
    }
  };

  useEffect( setCourse, [] );

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <Header drawerWidth={drawerWidth} />
        <Pages drawerWidth={drawerWidth} />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Content classNumber={classNumber} module={module} />
        </main>
      </div>
    </ThemeProvider>
  );
}

