# dom-parser
dom parser using javascript regex. 


### No Need node environment or special Browser!!!
### Support react, react-native, vue etc...

## Install
```
npm install --save react-native-dom-parser
```

## Usage
```
import DomSelector from 'react-native-dom-parser';

const rootNode = DomSelector(rowHtmlData);

rootNode.getElementById('myCarousel');
rootNode.getElementsByClassName('item');
rootNode.getElementsByTagName('div');

```

## Support

### Html tag
Base on [https://www.w3.org/TR/html5/syntax.html#void-elements](https://www.w3.org/TR/html5/syntax.html#void-elements)
* Void elements:
```
area, base, br, col, embed, hr, img, input, link, meta, param, source, track, wbr
```
* escapable raw text elements
```
textarea, title
```
* Normal elements
```
All other allowed HTML elements are normal elements.
```

### Node Type
have ElementNode and TextNode

### Node Structure

ElementNode:
```
  this.text;         // raw html text
  this.tagName;      // html tag name
  this.attributes;   // html tag arrtibute
  this.style;        // html style [object]
  this.classList;    // html class list [array]
  this.children;     // child node
  this.parent;       // parent node or null
```
TextNode: 
```
  this.text;         // html raw text
  this.parent;       // parent node
```

### Query Method
```
  ElementNode.getElementById(id)
```
```
  ElementNode.getElementsByClassName(className)
```
```
  ElementNode.getElementsByTagName(tagName)
```
```
  ElementNode.getElementsByName(name)
```

### TODO
* [ ] Set up auto-test
* [ ] querySelector 
* [ ] querySelectorAll



