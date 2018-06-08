'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TextNode = require('./TextNode');

var _TextNode2 = _interopRequireDefault(_TextNode);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function convertAttributes(str) {
  if (!str) {
    return {};
  }
  var result = {};
  var arr = str.replace(/[\s]+/g, ' ').trim().match(/([\S]+="[^"]*")|([^\s"]+)/g);

  arr.forEach(function (item) {
    if (item.indexOf('=') === -1) {
      result[item] = true;
    } else {
      //just split first =
      var match = item.match(/([^=]+)=([^]*)/);
      // remove string ""
      result[match[1]] = match[2] && match[2].replace(/^"([^]*)"$/, '$1');
    }
  });
  return result;
}

/**
 * convert Style
 * @param str
 * @constructor
 */
/**
 * attribute handle
 * @param str
 * @returns {{}}
 */
function convertStyle(str) {
  if (!str) {
    return {};
  }
  var result = {};
  str.replace(/[\s]+/g, '').split(';').forEach(function (item) {
    if (item) {
      var match = item.split(':');
      result[match[0]] = match[1];
    }
  });
  return result;
}

/**
 * convert class
 * @param str
 * @returns {*}
 */
function convertClass(str) {
  if (!str || typeof str !== 'string') {
    return [];
  }
  return str.trim().replace(/[\s]+/g, ' ').split(' ');
}

/**
 * element node
 * @param tagName
 * @param attributes
 * @param text
 * @constructor
 */
function ElementNode(_ref, parent) {
  var tagName = _ref.tagName,
      attributes = _ref.attributes,
      text = _ref.text;

  this.text = text;
  this.tagName = tagName;
  this.attributes = convertAttributes(attributes);
  this.style = convertStyle(this.attributes.style);
  this.classList = convertClass(this.attributes['class']);
  this.children = [];
  this.parent = parent;
}

ElementNode.prototype.getElementById = function (id) {
  function find(element) {
    if (element instanceof _TextNode2.default) {
      return null;
    }
    if (element.attributes.id === id) {
      return element;
    } else if (element.children.length > 0) {
      var result = null;
      element.children.forEach(function (child) {
        var temp = find(child);
        if (temp) {
          result = temp;
        }
      });
      return result;
    }
    return null;
  }

  return find(this);
};

ElementNode.prototype.getElementsByClassName = function (className) {
  function find(element) {
    if (element instanceof _TextNode2.default) {
      return [];
    }
    var result = [];
    if (element.classList.indexOf(className) !== -1) {
      result.push(element);
    }
    if (element.children.length > 0) {
      element.children.forEach(function (child) {
        result = result.concat(find(child));
      });
    }
    return result;
  }

  return find(this);
};

ElementNode.prototype.getElementsByTagName = function (tagName) {
  function find(element) {
    if (element instanceof _TextNode2.default) {
      return [];
    }
    var result = [];
    if (element.tagName === tagName) {
      result.push(element);
    }
    if (element.children.length > 0) {
      element.children.forEach(function (child) {
        result = result.concat(find(child));
      });
    }
    return result;
  }

  return find(this);
};

ElementNode.prototype.getElementsByName = function (name) {
  function find(element) {
    if (element instanceof _TextNode2.default) {
      return [];
    }
    var result = [];
    if (element.attributes.name === name) {
      result.push(element);
    }
    if (element.children.length > 0) {
      element.children.forEach(function (child) {
        result = result.concat(find(child));
      });
    }
    return result;
  }

  return find(this);
};

ElementNode.prototype.querySelector = function () {
  //TODO
};

ElementNode.prototype.querySelectorAll = function () {
  //TODO
};

exports.default = ElementNode;