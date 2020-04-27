import React, { useEffect, useCallback } from 'react';
import {connect} from 'react-redux';

import { useParams } from 'react-router-dom';

import { ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';

import Header from './header.js';
import Content from '../components/content/content.js';
import Pages from './pages.js';

import { selectCourse, selectVersion, selectPage, getDemoFiles, getMarkdown, getManifest } from '../store/curriculum.store.js';

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

function Page(props) {

  const {curriculum, selectCourse, selectPage, selectVersion, getManifest, getMarkdown, getDemoFiles} = props;

  const classes = useStyles();
  const { org, repo, module, classNumber } = useParams();

  const run = useCallback((fn) => {
    fn(curriculum);
  }, [curriculum]);

  const setCourse = () => {
    if ( org && repo ) {
      const course = `${org}/${repo}`;
      selectCourse(course);
      selectVersion('master');
      selectPage('/curriculum/README.md');
    }
  };

  useEffect( setCourse, [] );

  useEffect(() => {
    curriculum.version && run(getManifest);
  }, [curriculum.version]);

  useEffect(() => {
    curriculum.file && run(getMarkdown);
  }, [curriculum.file]);

  useEffect(() => {
    run(getDemoFiles);
  }, [curriculum.demoFolder]);

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

const mapStateToProps = ({ curriculum }) => ({ curriculum });
const mapDispatchToProps = { selectCourse, selectVersion, selectPage, getDemoFiles, getMarkdown, getManifest };
export default connect(mapStateToProps, mapDispatchToProps)(Page);

