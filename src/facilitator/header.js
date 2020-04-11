import React, {useState, useContext} from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';

import {CurriculumContext} from '../context/curriculum';

function Header( {drawerWidth}) {

  const curriculum = useContext(CurriculumContext);
  const [course,setCourse] = useState('');
  const [version,setVersion] = useState('');

  const useStyles = makeStyles((theme) => ({
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },

    title: {
      flexGrow:1,
      textAlign:'right',
      marginRight: '1rem',
    },

    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
  }));

  const classes = useStyles();

  const changeCourse = (e) => {
    setCourse(e.target.value);
    curriculum.selectCourse(e.target.value);
  };

  const changeVersion = (e) => {
    setVersion(e.target.value);
    curriculum.selectVersion(e.target.value);
  };

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Course</InputLabel>
          <Select
            labelId="course-select-label"
            id="course"
            value={course}
            onChange={changeCourse}
          >
            {
              curriculum.repositories.map((repo, idx) =>
                <MenuItem key={`repo-${idx}`} value={`/codefellows/${repo}`}>{repo}</MenuItem>,
              )}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Version</InputLabel>
          <Select
            labelId="version-select-label"
            id="version"
            value={version}
            onChange={changeVersion}
          >
            {
              curriculum.versions.map((version, idx) =>
                <MenuItem key={`version-${idx}`} value={version}>{version}</MenuItem>,
              )}
          </Select>
        </FormControl>

        <Typography className={classes.title} variant="h3">Facilitator's Guide</Typography>

      </Toolbar>
    </AppBar>
  );

}

export default Header;
