/**
 * A mixin for handling (effectively) onClickOutside for React components.
 * Note that we're not intercepting any events in this approach, and we're
 * not using double events for capturing and discarding in layers or wrappers.
 *
 * The idea is that components call:
 *
 *   this.onClickOutside(this.outsideHandler);
 *
 * in their .componentDidMount() function. The call returns an object with a
 * single function, .remove(), which can be called in the unmounting functions
 * to ensure the event listener is cleaned up properly.
 *
 * If no handler is passed in, an error will be thrown. There is no point
 * in having the code in place without pushing in an actual event handler.
 *
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node. Note that this does not work with strict
    // CommonJS, but only CommonJS-like environments
    // that support module.exports
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.OnClickOutside = factory();
  }
}(this, function () {
  "use strict";

  return {
    onClickOutside: function(handler) {
      if(!handler)
        throw new Error("Component tried to set up onClickOutside behaviour without an event handler.");

      var fn = (function(localNode, eventHandler) {
        return function(evt) {
          var source = evt.target;
          var found = false;
          // If source=local then this event came from "somewhere"
          // inside and should be ignored. We could handle this with
          // a layered approach, too, but that requires going back to
          // thinking in terms of Dom node nesting, running counter
          // to React's "you shouldn't care about the DOM" philosophy.
          while(source.parentNode) {
            found = (source === localNode);
            if(found) return;
            source = source.parentNode;
          }
          eventHandler(evt);
        }
      }(this.getDOMNode(), handler));

      document.addEventListener("click", fn);

      // successful registration returns an object that we can cache
      // so that we can call .remove() on it during component unmount.
      return {
        remove: function() {
          document.removeEventListener("click", fn);
        }
      };

    }
  };

}));
