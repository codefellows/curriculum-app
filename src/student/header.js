import React from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import ViewListIcon from '@material-ui/icons/ViewList';

import {When} from '../components/if';

import {selectPage} from '../store/curriculum.store.js';

function Header( {drawerWidth, curriculum, selectPage}) {

  const useStyles = makeStyles((theme) => ({
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    title: {
      alignSelf: 'end',
      flexGrow:1,
      textAlign:'right',
      margin: '.5rem 1rem',
      fontWeight: 'bold',
      color: 'maroon',
      fontSize: '1.2rem',
    },

    button: {
      marginRight: '1em',
    },

    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
  }));

  const classes = useStyles();

  const changePage = (page) => {
    selectPage(page);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <When condition={curriculum?.classInfo?.overview}>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<TrackChangesIcon />}
            onClick={ () => changePage(curriculum.classInfo.overview) }
          >
          Overview
          </Button>
        </When>

        <When condition={curriculum?.classInfo?.assignments?.reading}>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<MenuBookIcon />}
            onClick={ () => changePage(curriculum.classInfo.assignments.reading) }
          >
          Reading
          </Button>
        </When>
        <When condition={curriculum?.classInfo?.assignments?.lab}>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<HowToRegIcon />}
            onClick={ () => changePage(curriculum.classInfo.assignments.lab) }
          >
          Lab
          </Button>
        </When>
        <When condition={curriculum?.classInfo?.resources}>
          <Button
            variant="contained"
            color="default"
            className={classes.button}
            startIcon={<ViewListIcon />}
            onClick={ () => changePage(curriculum.classInfo.resources) }
          >
          Resources
          </Button>
        </When>
        <When condition={curriculum.classInfo?.name}>
          <Typography className={classes.title} variant="h1">{curriculum.classInfo.name}</Typography>
        </When>
      </Toolbar>
    </AppBar>
  );

}

const mapStateToProps = ({ curriculum }) => ({ curriculum });
const mapDispatchToProps = { selectPage };
export default connect(mapStateToProps, mapDispatchToProps)(Header);

