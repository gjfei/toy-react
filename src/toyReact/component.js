import { RENDER_TO_DOM } from './constant';

export class Component {
  constructor() {
    this._root = null;
    this.children = [];
    this.props = Object.create(null);
    this._range = null;
  }
  setAttribute(name, value) {
    this.props[name] = value;
  }
  appendChild(component) {
    this.children.push(component);
  }
  get vdom() {
    return this.render().vdom;
  }
  [RENDER_TO_DOM](range) {
    this._range = range;
    this._vdom = this.vdom;
    this.render()[RENDER_TO_DOM](range);
  }
  update() {
    let isSameNode = (oldNode, newNode) => {
      if (oldNode.type !== newNode.type) return false;
      for (let name in newNode.props) {
        if (oldNode.props[name] !== newNode.props[name]) return false
      }
      if (Object.keys(oldNode.props).length > Object.keys(newNode.props).length) return false;
      if (newNode.type === '#text' && newNode.content !== oldNode.content) return false;
      return true;
    }
    let updateNode = (oldNode, newNode) => {
      // type不同整个替换
      // props不一样，整个替换（实际可打patch）
      // #text的content 和 props逻辑一致
      if (!isSameNode(oldNode, newNode)) {
        newNode[RENDER_TO_DOM](oldNode._range);
        return;
      }
      newNode._range = oldNode._range;

      let newChildren = newNode.vchildren;
      let oldChildren = oldNode.vchildren;

      if (!oldChildren) return;
      let tailRange = oldChildren[oldChildren.length - 1]._range;
      for (let i = 0; i < newChildren.length; i++) {
        let oldChild = oldChildren[i];
        let newChild = newChildren[i];
        if (i < oldChildren.length) {
          updateNode(oldChild, newChild);
        } else {
          let range = document.createRange();
          range.setStart(tailRange.endContainer, tailRange.endOffset);
          range.setEnd(tailRange.endContainer, tailRange.endOffset);
          newChild[RENDER_TO_DOM](range);
          tailRange = range;
        }

      }
    }
    let vdom = this.vdom;
    updateDom(this._vdom, this.vdom);
    this._vdom = vdom;
  }
  rerender() {
    let oldRange = this._range;

    let range = document.createRange();
    range.setStart(oldRange.startContainer, oldRange.startOffset);
    range.setEnd(oldRange.startContainer, oldRange.startOffset);
    this[RENDER_TO_DOM](range);

    oldRange.setStart(range.endContainer, range.endOffset);
    oldRange.deleteContents()
  }
  setState(newState) {
    if (this.state === null || typeof this.state !== 'object') {
      this.state = newState;
      this.rerender();
      return;
    }
    let combime = (oldState, newState) => {
      for (let key in newState) {
        if (oldState[key] === null || typeof oldState[key] !== 'object') {
          oldState[key] = newState[key];
        } else {
          combime(oldState[key], newState[key]);
        }
      }
    }
    combime(this.state, newState);
    this.rerender();
  }
}