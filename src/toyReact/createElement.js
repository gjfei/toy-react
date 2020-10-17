import { ElementWrapper } from './elementWrapper';
import { TextWrapper } from './textWrapper';

export function createElement(type, attributes, ...children) {
  let element;
  if (typeof type === 'string') {
    element = new ElementWrapper(type);
  } else {
    element = new type;
  }
  for (let props in attributes) {
    element.setAttribute(props, attributes[props]);
  }
  let insertChildren = (children) => {
    for (let child of children) {
      if (typeof child === 'function') {
        throw (new Error('Functions are not valid as a React child'));
      }
      if (typeof child === 'string' || typeof child === 'number') {
        child = new TextWrapper(child);
      }
      if (child === null) {
        continue;
      }
      if (typeof child === 'object' && child instanceof Array) {
        insertChildren(child);
      } else {
        element.appendChild(child);
      }
    }
  }
  insertChildren(children);
  return element;
}