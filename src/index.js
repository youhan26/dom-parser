/**
 * remove comment
 * @param str
 * @returns {string | * | void}
 */
import ElementNode from "./ElementNode";
import TextNode from "./TextNode";


function correctBracket(str) {
  return str.replace(/("[^<>\/"]*)<([^<>\/"]+)>([^<>\/"]*")/g, '"$1|$2|$3"');
}

function removeComment(str) {
  return str.replace(/<!--[^>]*-->/g, '');
}

/**
 * remove break line
 * @param str
 * @returns {string | * | void}
 */
function removeBreakLine(str) {
  return str.replace(/[\r\n\t]/g, '');
}

/**
 * get body if have
 * @param str
 * @returns {*}
 */
function getBodyIfHave(str) {
  const match = str.match(/<body[^>]*>([^]*)<\/body>/);
  if (!match) {
    return str;
  }
  return match[1];
}


/**
 * void html tag
 * @type {string[]}
 */
const VOID_TAG = [
  'area', 'base',
  'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'param',
  'source', 'track', 'wbr'
];

/**
 * node type
 * @type {{text: string, self: string, close: string, start: string}}
 */
const NODE_TYPE = {
  text: 'text',
  self: 'self',
  close: 'close',
  // start or total
  start: 'start'
};

let stack = [];

/**
 * addLine
 * @param line
 * @param isTextNode
 */
function addLine(line, isTextNode) {
  /**
   *   "<div>"
   *   "</div>"
   *   "<image />"
   *   "some text"
   */
  if (line.trim() === '') {
    return;
  }
  // text node
  if (isTextNode) {
    stack.push({
      type: NODE_TYPE.text,
      text: line
    });
    return;
  }
  
  let match;
  // "<image />"
  match = line.match(/<([^\s<>]+) ?([^<>]*)\/>/);
  if (match) {
    stack.push({
      type: NODE_TYPE.self,
      tagName: match[1],
      attributes: match[2],
      text: line
    });
    return;
  }
  // "</div>"
  match = line.match(/<\/([^\s<>]+)>/);
  if (match) {
    stack.push({
      type: NODE_TYPE.close,
      tagName: match[1],
      text: line
    });
    return;
  }
  //  "<div>"
  match = line.match(/<([^\s<>]+) ?([^<>]*)>/);
  if (match) {
    stack.push({
      type: NODE_TYPE.start,
      tagName: match[1],
      attributes: match[2],
      text: line
    });
    return;
  }
}

/**
 * main parse method
 * @param str
 * @returns {*}
 */
function parseChildren(str) {
  const pattern = /(<[^<>]+>)/g;
  if (!str) {
    return null;
  }
  let pointer = 0;
  let match;
  stack = [];
  while (match = pattern.exec(str)) {
    addLine(str.slice(pointer, match.index), true);
    addLine(match[1]);
    pointer = match.index + match[0].length;
  }
  const children = [];
  let currentNode = null;
  if (stack.length > 0) {
    stack.forEach((node) => {
      // text node
      if (node.type === NODE_TYPE.text) {
        if (currentNode) {
          currentNode.children.push(new TextNode(node.text, currentNode));
        } else {
          children.push(new TextNode(node.text, null));
        }
      } else if (node.type === NODE_TYPE.close) {
        if (!currentNode) {
          throw new Error('parse error');
        } else {
          if (node.tagName === currentNode.tagName) {
            currentNode = currentNode.parent;
          } else {
            throw new Error('parse error');
          }
        }
      } else if (node.type === NODE_TYPE.start && VOID_TAG.indexOf(node.tagName) === -1) {
        const newNode = new ElementNode(node, currentNode);
        if (!currentNode) {
          children.push(newNode);
        } else {
          currentNode.children.push(newNode);
        }
        currentNode = newNode;
      } else if (node.type === NODE_TYPE.self || VOID_TAG.indexOf(node.tagName) !== -1) {
        if (currentNode) {
          currentNode.children.push(new ElementNode(node, currentNode));
        } else {
          children.push(new ElementNode(node, null));
        }
      }
    });
  }
  return children;
}

/**
 * dom selector
 * @param str
 * @constructor
 */
const DomSelector = function (str) {
  let _str = str || '';
  _str = correctBracket(getBodyIfHave(removeBreakLine(removeComment(_str))));
  
  const result = parseChildren(_str);
  if (result.length > 1) {
    const root = new ElementNode({tagName: '', attributes: '', text: str}, null);
    root.children = result;
    return root;
  } else {
    return result[0];
  }
};


export default DomSelector;
