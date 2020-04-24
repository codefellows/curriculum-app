import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {When} from '../components/if';

import { CurriculumContext } from '../context/curriculum';

const classes = {
  overview: {
    color: 'maroon',
    marginBottom: '.3rem',
  },
  module: {
    marginBottom: '.3rem',
  },
  class: {
    marginBottom: '.2rem',
  },
};

function Pages(props) {

  const curriculum = useContext(CurriculumContext);
  const sections = curriculum.pages;

  const useStyles = makeStyles((theme) => ({
    drawer: {
      width: props.drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: props.drawerWidth,
    },
    title: {
      fontSize: '1rem',
      padding:'0 2rem',
      color: '#800000',
    },
    tree: {
      fontSize: '.8rem',
      padding: '1rem',
      color: '#6a6a6a',
    },
  }));

  const classes = useStyles();

  const repo = curriculum.repo.split('/').pop();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.toolbar} />
      <Divider />
      <h2 className={classes.title}>&lt;{repo} /&gt;</h2>
      <Divider />
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        className={classes.tree}
      >
        <When condition={sections.overview}>
          <h3>Overview</h3>
          {
            sections.overview && Object.keys(sections.overview).map(page =>
              typeof sections.overview[page] === 'string' &&
                <TreeItem
                  key={page}
                  nodeId={page}
                  label={page}
                  onClick={() => curriculum.selectPage(sections.overview[page])}
                ></TreeItem>,
            )
          }
          <Divider />
        </When>

        <When condition={sections.modules}>
          <h3>Class Work</h3>
        </When>

        {
          sections.modules && sections.modules.map(module =>
            <Module key={Math.random()} module={module} />,
          )
        }

      </TreeView>
    </Drawer>
  );

}

function Module( {module}) {

  const curriculum = useContext(CurriculumContext);

  return (
    <TreeItem nodeId={module.name} label={module.name} style={classes.module}>
      <TreeItem
        style={classes.overview}
        nodeId={`${module.name}-overview`}
        label='Module at a Glance'
        onClick={() => curriculum.selectPage(module.overview)}>
      </TreeItem>
      <TreeItem
        style={classes.overview}
        nodeId={`${module.name}-project`}
        label='Project Specs'
        onClick={() => curriculum.selectPage(module.project)}>
      </TreeItem>
      {
        module.classes.map( classItem => <ClassEntry key={Math.random()} classItem={classItem} />)
      }
    </TreeItem>
  );
}

function ClassEntry({classItem}) {

  const curriculum = useContext(CurriculumContext);

  const openClass = () => {
    curriculum.setClass(classItem);
    curriculum.selectPage(classItem.overview);
  };

  return (
    <TreeItem
      nodeId={classItem.name}
      label={`${classItem.class}-${classItem.name}`}
      style={classes.module}
      onClick={openClass}
    >
    </TreeItem>
  );
}

export default Pages;
