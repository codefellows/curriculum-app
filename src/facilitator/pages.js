import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { CurriculumContext } from '../context/curriculum';

// https://material-ui.com/components/tree-view/ ()
function Pages(props) {

  const curriculum = useContext(CurriculumContext);

  const useStyles = makeStyles((theme) => ({
    drawer: {
      width: props.drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: props.drawerWidth,
    },
    title: {
      padding:'0 2rem',
      color: '#800000',
    },
    tree: {
      padding: '1rem',
    },
  }));

  const classes = useStyles();

  console.log(curriculum.pages);

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
        <TreeItem nodeId="1" label="Applications">
          <TreeItem nodeId="2" label="Calendar" />
          <TreeItem nodeId="3" label="Chrome" />
          <TreeItem nodeId="4" label="Webstorm" />
        </TreeItem>
        <TreeItem nodeId="5" label="Documents">
          <TreeItem nodeId="10" label="OSS" />
          <TreeItem nodeId="6" label="Material-UI">
            <TreeItem nodeId="7" label="src">
              <TreeItem nodeId="8" label="index.js" />
              <TreeItem nodeId="9" label="tree-view.js" />
            </TreeItem>
          </TreeItem>
        </TreeItem>
      </TreeView>
    </Drawer>
  );

}

export default Pages;
