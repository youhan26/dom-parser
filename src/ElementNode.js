/**
 * attribute handle
 * @param str
 * @returns {{}}
 */
import TextNode from "./TextNode";

function convertAttributes(str) {
  if (!str) {
    return {};
  }
  const result = {};
  const arr = str.replace(/[\s]+/g, ' ').trim().match(/([\S]+="[^=]*")|([^\s"]+)/g);
  
  arr.forEach((item) => {
    const match = item.split('=');
    if (match[0]) {
      result[match[0]] = (match[1] && match[1].replace(/^"([^]*)"$/, '$1')) || true;
    }
  });
  return result;
}

/**
 * convert Style
 * @param str
 * @constructor
 */
function convertStyle(str) {
  if (!str) {
    return {};
  }
  const result = {};
  str.replace(/[\s]+/g, '').split(';').forEach((item) => {
    if (item) {
      const match = item.split(':');
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
function ElementNode({tagName, attributes, text}, parent) {
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
    if (element instanceof TextNode) {
      return null;
    }
    if (element.attributes.id === id) {
      return element;
    } else if (element.children.length > 0) {
      let result = null;
      element.children.forEach((child) => {
        const temp = find(child);
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
    if (element instanceof TextNode) {
      return [];
    }
    let result = [];
    if (element.classList.indexOf(className) !== -1) {
      result.push(element);
    }
    if (element.children.length > 0) {
      element.children.forEach((child) => {
        result = result.concat(find(child));
      });
    }
    return result;
  }
  
  return find(this);
};

ElementNode.prototype.getElementsByTagName = function (tagName) {
  function find(element) {
    if (element instanceof TextNode) {
      return [];
    }
    let result = [];
    if (element.tagName === tagName) {
      result.push(element);
    }
    if (element.children.length > 0) {
      element.children.forEach((child) => {
        result = result.concat(find(child));
      });
    }
    return result;
  }
  
  return find(this);
};

ElementNode.prototype.getElementsByName = function (name) {
  function find(element) {
    if (element instanceof TextNode) {
      return [];
    }
    let result = [];
    if (element.attributes.name === name) {
      result.push(element);
    }
    if (element.children.length > 0) {
      element.children.forEach((child) => {
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

export default ElementNode;
