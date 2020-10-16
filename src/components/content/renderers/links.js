import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { openDemo, selectPage } from '../../../store/curriculum.store.js';

// This Link Renderer adds some special onClick logic for every <a> tag in the content
// this allows us to let the menu items link through, intercept calls for actual content
// and redirect for demo links

function CustomLink({ href, children, curriculum, openDemo, selectPage }) {

  const handleClick = (e) => {

    if (href.includes('#')) {
      const hash = href.replace(/#/g, '');
      const target = document.getElementById(hash);
      target && target.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    else {

      e.preventDefault();

      // Absolute? Open in new tab
      if (href.startsWith('http')) {
        window.open(href, '_blank');
      }

      // Any demo link needs to spawn a new component
      else if (href.includes('demo')) {
        href = href.replace(/^\//, ''); // remove any leading /
        const file = curriculum.file.path.replace(/^\//, ''); // remove any leading /
        const url = new URL(href, `http://x/${file}`);
        const demo = {
          repository: curriculum.file.repository,
          path: url.pathname
        }
        openDemo(demo)
      }

      // Any relative link needs to change state so the content loader will fire
      else {
        href = href.replace(/^\//, ''); // remove any leading /
        const file = curriculum.file.path.replace(/^\//, ''); // remove any leading /
        const url = new URL(href, `http://x/${file}`);
        const page = {
          repository: curriculum.file.repository,
          path: url.pathname
        }
        selectPage(page);
      }
    }

  };

  if (href.startsWith('http')) {
    return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
  }
  return <Link onClick={handleClick} to={href}>{children}</Link>;
}

const mapStateToProps = ({ curriculum }) => ({ curriculum });
const mapDispatchToProps = { selectPage, openDemo };
export default connect(mapStateToProps, mapDispatchToProps)(CustomLink);

