import util from 'mdast-util-toc';

export default function toc(options) {

  let settings = options || {};
  let depth = settings.maxDepth || 2;
  let tight = settings.tight;
  let skip = settings.skip;

  return transformer;

  function transformer(node) {
    let result = util(node, {
      maxDepth: depth,
      tight: tight,
      skip: skip,
    });

    // if (result.index === null || result.index === -1 || !result.map) {
    if (!result.map) {
      return;
    }

    node.children = [].concat(
      node.children.slice(0, result.index),
      result.map,
      node.children.slice(result.endIndex),
    );

  }

}
