import React, {useContext} from 'react';

import {Redirect, Link} from 'react-router-dom';

// Context
import { CurriculumContext } from '../../context/curriculum.js';

// This Link Renderer adds some special onClick logic for every <a> tag in the content
// this allows us to let the menu items link through, intercept calls for actual content
// and redirect for demo links

export default function CustomLink({href,children}) {

  const curriculum = useContext(CurriculumContext);

  const handleClick = (e) => {

    if (! href.startsWith('#')) {

      e.preventDefault();

      // Absolute? Open in new tab
      if (href.startsWith('http')) {
        window.open(href, '_blank');
      }

      // Any demo link needs to spawn a new component
      else if ( href.includes('demo') ) {
        href = href.replace(/^\//, ''); // for grins, remove any leading /
        const url = new URL(href, `http://x/${curriculum.file}`);
        curriculum.openDemo(url.pathname);
      }

      // Any relative link needs to change state so the content loader will fire
      else {
        href = href.replace(/^\//, ''); // for grins, remove any leading /
        const url = new URL(href, `http://x/${curriculum.file}`);
        curriculum.selectPage(url.pathname);
      }
    }
  };

  return <Link onClick={handleClick} to={href}>{children}</Link>;
}
