export default function toClassList(element) {
  if (typeof element.classList !== 'undefined') {
    return element.classList;
  }

  // assume it's SVG in IE which doesn't support .classList
  return {
    contains(className) {
      return element.className.baseVal.split(' ').indexOf(className) !== -1;
    },
  };
}
