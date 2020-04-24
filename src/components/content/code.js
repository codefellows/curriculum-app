import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import * as themes from 'react-syntax-highlighter/dist/esm/styles/prism';

/*
Available Color Schemes
atomDark
cb
coy
darcula
dark
duotoneDark
duotoneEarth
duotoneForest
duotoneLight
duotoneSea
duotoneSpace
funky
ghcolors
hopscotch
okaidia
pojoaque
prism
solarizedlight
tomorrow
twilight
vs
xonokai
 */

const styles = {
  code: {
    whiteSpace:'pre-wrap',
    wordBreak: 'keep-all',
    fontSize: '.8rem',
  },
};

class CodeBlock extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string,
  };

  static defaultProps = {
    language: null,
  };

  render() {
    const { language, value } = this.props;
    return (
      <SyntaxHighlighter language={language} customStyle={styles.code} style={themes.okaidia}>
        {value}
      </SyntaxHighlighter>
    );
  }
}

export default CodeBlock;
