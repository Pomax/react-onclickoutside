/**
 * A mixin for handling (effectively) onClickOutside for React components.
 * Note that we're not intercepting any events in this approach, and we're
 * not using double events for capturing and discarding in layers or wrappers.
 *
 * The idea is that components define function
 *
 *   handleClickOutside: function() { ... }
 *
 * If no such function is defined, an error will be thrown, as this means
 * either it still needs to be written, or the component should not be using
 * this mixing since it will not exhibit onClickOutside behaviour.
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

  // Use a parallel array because we can't use
  // objects as keys, they get toString-coerced
  var registeredComponents = [];
  var handlers = [];

  var IGNORE_CLASS = 'ignore-react-onclickoutside';

  return {
    componentDidMount: function() {
      if(!this.handleClickOutside)
        throw new Error("Component lacks a handleClickOutside(event) function for processing outside click events.");

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
            found = (source === localNode || source.classList.contains(IGNORE_CLASS));
            if(found) return;
            source = source.parentNode;
          }
          eventHandler(evt);
        }
      }(this.getDOMNode(), this.handleClickOutside));

      document.addEventListener("mousedown", fn);
      document.addEventListener("touchstart", fn);

      var pos = registeredComponents.length;
      registeredComponents.push(this);
      handlers[pos] = fn;
    },

    componentWillUnmount: function() {
      var pos = registeredComponents.indexOf(this);
      if( pos>-1) {
        var fn = handlers[pos];

        if (fn) {
          // clean up so we don't leak memory
          handlers.splice(pos, 1);
          registeredComponents.splice(pos, 1);
          document.removeEventListener("mousedown", fn);
          document.removeEventListener("touchstart", fn);
        }
      }
    }
  };

}));
