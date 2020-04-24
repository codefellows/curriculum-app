import React from 'react';

import slugger from 'github-slugger';

export default (props) => {
  const heading = `h${props.level}`;
  const children = props.children;
  const id = slugger.slug(props.children[0].props.children);
  return React.createElement(heading, { id }, children);
};
