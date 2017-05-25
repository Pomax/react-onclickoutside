/**
 * Check whether some DOM node is our Component's node.
 */
function hasClass(className, node) {
  // SVG <use/> elements do not technically reside in the rendered DOM, so
  // they do not have classList directly, but they offer a link to their
  // corresponding element, which can have classList. This extra check is for
  // that case.
  // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
  // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17
  return (node.correspondingElement || node).classList.contains(className);
}

function containedInClassName(className, node) {
  do {
    if (hasClass(className, node)) {
      return true;
    }
    node = node.parentNode;
  } while (node);

  return false;
}

/**
 * Check if the browser scrollbar was clicked
 */
function clickedScrollbar(evt) {
  return document.documentElement.clientWidth <= evt.clientX || document.documentElement.clientHeight <= evt.clientY;
}

/**
 * Generate the event handler that checks whether a clicked DOM node
 * is inside of, or lives outside of, our Component's node tree.
 */
export default function generateOutsideCheck(
  componentNode,
  eventHandler,
  ignoreClass,
  excludeScrollbar,
  preventDefault,
  stopPropagation,
) {
  return function(evt) {
    if (preventDefault) {
      evt.preventDefault();
    }
    if (stopPropagation) {
      evt.stopPropagation();
    }
    const current = evt.target;
    if (
      current !== document &&
      ((excludeScrollbar && clickedScrollbar(evt)) ||
        componentNode.contains(current) ||
        containedInClassName(ignoreClass, current))
    ) {
      return;
    }
    eventHandler(evt);
  };
}
