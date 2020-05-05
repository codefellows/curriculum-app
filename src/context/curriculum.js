import React from 'react';

import { ThemeProvider } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import 'typeface-roboto';

export const CurriculumContext = React.createContext();

function Curriculum(props) {

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
      height: '100%',
      width: '100%',
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    content: {
      backgroundColor: '#FBFCFC',
    },
  }));

  return (
    <CurriculumContext.Provider value={{useStyles}}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </CurriculumContext.Provider>
  );
}

export default Curriculum;
