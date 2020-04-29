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
  demo: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'keep-all',
    fontSize: '1rem',
    margin: 0,
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
    let { theme, customStyle, language, value } = this.props;
    theme = theme ? theme : 'okaidia';
    customStyle = customStyle ? styles[customStyle] : styles.code;
    return (
      <SyntaxHighlighter language={language} customStyle={customStyle} style={themes[theme]}>
        {value}
      </SyntaxHighlighter>
    );
  }
}

export default CodeBlock;
