import { Component } from './component';
import { RENDER_TO_DOM } from './constant';
import { replaceContent } from './utils';

export class TextWrapper extends Component {
  constructor(text) {
    super(text);
    this.type = "#text";
    this._range = null;
    this.content = text;
  }
  get vdom() {
    return this;
  }
  [RENDER_TO_DOM](range) {
    this._range = range;
    let root = document.createTextNode(this.content);
    replaceContent(range, root);
  }
}