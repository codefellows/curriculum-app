import React from 'react';
import {connect} from 'react-redux';

// Store
import {selectPage, openDemo} from '../../store/curriculum.store';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import OverViewIcon from '@material-ui/icons/DoubleArrow';

import {When} from '../../components/if';

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

function Pages( {curriculum, selectPage, drawerWidth} ) {

  const sections = curriculum.pages;

  const useStyles = makeStyles((theme) => ({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    title: {
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
      <h2 className={classes.title}>&lt;Pages /&gt;</h2>
      <Divider />
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        className={classes.tree}
      >
        <When condition={sections.overview}>
          <h3>Course Overview</h3>
          {
            sections.overview?.facilitator && Object.keys(sections.overview.facilitator).map(page =>
              <TreeItem key={page} nodeId={page} label={page} onClick={() => selectPage(sections.overview.facilitator[page])}></TreeItem>,
            )
          }
          <Divider />
        </When>

        <When condition={sections.modules}>
          <h3>Course Material</h3>
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

function ModuleComponent( {module, selectPage}) {

  return (
    <TreeItem nodeId={module.name} label={module.name} style={classes.module}>
      <TreeItem
        icon={<OverViewIcon/>}
        nodeId={`${module.name}-overview`}
        label='Overview' style={classes.class}
        onClick={() => selectPage(module.overview)}>
      </TreeItem>
      {
        module.classes.map( classItem => <ClassEntry key={Math.random()} classItem={classItem} />)
      }
    </TreeItem>
  );
}

function ClassEntryComponent({classItem}) {

  return (
    <TreeItem nodeId={classItem.name} label={`${classItem.class}-${classItem.name}`} style={classes.module}>
      {
        Object.keys(classItem.facilitator).map( page =>
          <ClassLink key={Math.random()} page={page} link={classItem.facilitator[page]} />,
        )
      }
    </TreeItem>
  );
}

function ClassLinkComponent({page, link, openDemo, selectPage}) {
  const open = () => {
    if (page === 'code demos') {
      openDemo(link);
    }
    else {
      selectPage(link);
    }
  };

  return (
    <TreeItem nodeId={page} label={page} onClick={open} style={classes.class}></TreeItem>
  );
}

const mapStateToProps = ({ curriculum }) => ({ curriculum });
const mapDispatchToProps = { selectPage, openDemo };

const Module = connect(mapStateToProps, mapDispatchToProps)(ModuleComponent);
const ClassLink = connect(mapStateToProps, mapDispatchToProps)(ClassLinkComponent);
const ClassEntry = connect(mapStateToProps, mapDispatchToProps)(ClassEntryComponent);

export default connect(mapStateToProps, mapDispatchToProps)(Pages);
