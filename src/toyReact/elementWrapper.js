import { Component } from './component';
import { RENDER_TO_DOM } from './constant';
import { replaceContent } from './utils';

export class ElementWrapper extends Component {
  constructor(type) {
    super(type);
    this.type = type;
    this._range = null;
    this.root = document.createElement(type);
  }
  get vdom() {
    return this;
  }
  get vchildren() {
    return this.children.map(child => child.vdom);
  }
  [RENDER_TO_DOM](range) {
    this._range = range;

    let root = document.createElement(this.type);
    for (let name in this.props) {
      let value = this.props[name];
      if (name.match(/on([\s\S]+)$/)) {
        typeof name === 'string' && root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase()), value);
      } else {
        if (name === "className") {
          name = "class";
        }
        root.setAttribute(name, value);
      }
    }
    for (let child of this.children) {
      let childRange = document.createRange();
      childRange.setStart(root, root.childNodes.length);
      childRange.setEnd(root, root.childNodes.length);
      child[RENDER_TO_DOM](childRange);
    }
    replaceContent(range, root);
  }
}