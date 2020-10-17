import { RENDER_TO_DOM } from './constant';
export function render(component, parentComponent) {
  let range = document.createRange();
  range.setStart(parentComponent, 0);
  range.setEnd(parentComponent, parentComponent.childNodes.length);
  range.deleteContents();
  component[RENDER_TO_DOM](range);
}