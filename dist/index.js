"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ElementNode = require("./ElementNode");

var _ElementNode2 = _interopRequireDefault(_ElementNode);

var _TextNode = require("./TextNode");

var _TextNode2 = _interopRequireDefault(_TextNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * remove comment
 * @param str
 * @returns {string | * | void}
 */
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
  var match = str.match(/<body[^>]*>([^]*)<\/body>/);
  if (!match) {
    return str;
  }
  return match[1];
}

/**
 * void html tag
 * @type {string[]}
 */
var VOID_TAG = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

/**
 * node type
 * @type {{text: string, self: string, close: string, start: string}}
 */
var NODE_TYPE = {
  text: 'text',
  self: 'self',
  close: 'close',
  // start or total
  start: 'start'
};

var stack = [];

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

  var match = void 0;
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
  var pattern = /(<[^<>]+>)/g;
  if (!str) {
    return null;
  }
  var pointer = 0;
  var match = void 0;
  stack = [];
  while (match = pattern.exec(str)) {
    addLine(str.slice(pointer, match.index), true);
    addLine(match[1]);
    pointer = match.index + match[0].length;
  }
  var children = [];
  var currentNode = null;
  if (stack.length > 0) {
    stack.forEach(function (node) {
      // text node
      if (node.type === NODE_TYPE.text) {
        if (currentNode) {
          currentNode.children.push(new _TextNode2.default(node.text, currentNode));
        } else {
          children.push(new _TextNode2.default(node.text, null));
        }
      } else if (node.type === NODE_TYPE.close) {
        if (!currentNode) {
          throw new Error('parse error');
        } else {
          if (node.tagName === currentNode.tagName) {
            currentNode.firstChild = currentNode.children[0];
            currentNode.lastChild = currentNode.children[currentNode.children.length - 1];

            currentNode = currentNode.parent;
          } else {
            throw new Error('parse error');
          }
        }
      } else if (node.type === NODE_TYPE.start && VOID_TAG.indexOf(node.tagName) === -1) {
        var newNode = new _ElementNode2.default(node, currentNode);
        if (!currentNode) {
          children.push(newNode);
        } else {
          currentNode.children.push(newNode);
        }
        currentNode = newNode;
      } else if (node.type === NODE_TYPE.self || VOID_TAG.indexOf(node.tagName) !== -1) {
        if (currentNode) {
          currentNode.children.push(new _ElementNode2.default(node, currentNode));
        } else {
          children.push(new _ElementNode2.default(node, null));
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
var DomSelector = function DomSelector(str) {
  var _str = str || '';
  _str = correctBracket(getBodyIfHave(removeBreakLine(removeComment(_str))));

  var result = parseChildren(_str);
  if (result.length > 1) {
    var root = new _ElementNode2.default({ tagName: '', attributes: '', text: str }, null);
    root.children = result;
    return root;
  } else {
    return result[0];
  }
};

exports.default = DomSelector;