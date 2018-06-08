"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * text node
 * @param text
 * @constructor
 */
function TextNode(text, parent) {
  this.text = text;
  this.parent = parent;
}

exports.default = TextNode;