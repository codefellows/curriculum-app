import React from 'react';

import { ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';

import Header from './header.js';
import Content from '../components/content/content.js';
import Pages from './pages.js';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#e0e0e0',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      light: '#0066ff',
      main: '#0044ff',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffcc00',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor:'#FBFCFC',
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    backgroundColor: '#FBFCFC', // theme.palette.background.default,
  },
}));

export default function App() {
  const classes = useStyles();

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

