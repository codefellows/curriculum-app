import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';

import queryString from 'query-string';
import { ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';

import { getCourses, getVersions, getManifest, getMarkdown, getDemoFiles, setVersion, setFile, setRepo } from '../store/curriculum.store';

import Header from './header.js';
import Content from '../components/content/content.js';
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
    backgroundColor: '#FBFCFC',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    backgroundColor: '#FBFCFC',
  },
}));

function Page(props) {

  const {
    curriculum,
    getCourses,
    getVersions,
    getManifest,
    getMarkdown,
    getDemoFiles,
    setVersion,
    setRepo,
    setFile,
  } = props;

  const classes = useStyles();

  const run = useCallback((fn) => {
    fn(curriculum);
  }, [curriculum]);

  useEffect(() => {
    document.title = 'Curriculum Browser';
    let qs = queryString.parse(window.location.search);
    if (qs.repo && qs.file && qs.version) {
      setVersion(qs.version);
      setRepo(qs.repo.replace(/^\//, ''));
      setFile(qs.file.replace(/^\//, ''));
    }
    run(getCourses);
  }, []);

  useEffect(() => {
    curriculum.repo && run(getVersions);
  }, [curriculum.repo]);

  useEffect(() => {
    curriculum.version && run(getManifest);
  }, [curriculum.version]);

  useEffect(() => {
    curriculum.file && run(getMarkdown);
    console.log('got markdown for', curriculum.file);
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
          <Content />
        </main>
      </div>
    </ThemeProvider>
  );
}

const mapStateToProps = ({ curriculum }) => ({ curriculum });
const mapDispatchToProps = { getCourses, getVersions, getManifest, getMarkdown, getDemoFiles, setVersion, setFile, setRepo };
export default connect(mapStateToProps, mapDispatchToProps)(Page);

