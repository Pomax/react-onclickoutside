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
    define(['react'], factory);
  } else if (typeof exports === 'object') {
    // Node. Note that this does not work with strict
    // CommonJS, but only CommonJS-like environments
    // that support module.exports
    module.exports = factory(require('react'));
  } else {
    // Browser globals (root is window)
    root.OnClickOutside = factory(React);
  }
}(this, function (React) {
  "use strict";

  // Use a parallel array because we can't use
  // objects as keys, they get toString-coerced
  var registeredComponents = [];
  var handlers = [];

  var IGNORE_CLASS = 'ignore-react-onclickoutside';

  var isSourceFound = function(source, localNode) {
    if (source === localNode) {
      return true;
    }
    // SVG <use/> elements do not technically reside in the rendered DOM, so
    // they do not have classList directly, but they offer a link to their
    // corresponding element, which can have classList. This extra check is for
    // that case.
    // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
    // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17
    if (source.correspondingElement) {
      return source.correspondingElement.classList.contains(IGNORE_CLASS);
    }
    return source.classList.contains(IGNORE_CLASS);
  };

  return {
    componentDidMount: function() {
      if(typeof this.handleClickOutside !== "function")
        throw new Error("Component lacks a handleClickOutside(event) function for processing outside click events.");

      var fn = this.__outsideClickHandler = (function(localNode, eventHandler) {
        return function(evt) {
          evt.stopPropagation();
          var source = evt.target;
          var found = false;
          // If source=local then this event came from "somewhere"
          // inside and should be ignored. We could handle this with
          // a layered approach, too, but that requires going back to
          // thinking in terms of Dom node nesting, running counter
          // to React's "you shouldn't care about the DOM" philosophy.
          while(source.parentNode) {
            found = isSourceFound(source, localNode);
            if(found) return;
            source = source.parentNode;
          }
          eventHandler(evt);
        }
      }(React.findDOMNode(this), this.handleClickOutside));

      var pos = registeredComponents.length;
      registeredComponents.push(this);
      handlers[pos] = fn;

      // If there is a truthy disableOnClickOutside property for this
      // component, don't immediately start listening for outside events.
      if (!this.props.disableOnClickOutside) {
        this.enableOnClickOutside();
      }
    },

    componentWillUnmount: function() {
      this.disableOnClickOutside();
      this.__outsideClickHandler = false;
      var pos = registeredComponents.indexOf(this);
      if( pos>-1) {
        if (handlers[pos]) {
          // clean up so we don't leak memory
          handlers.splice(pos, 1);
          registeredComponents.splice(pos, 1);
        }
      }
    },

    /**
     * Can be called to explicitly enable event listening
     * for clicks and touches outside of this element.
     */
    enableOnClickOutside: function() {
      var fn = this.__outsideClickHandler;
      document.addEventListener("mousedown", fn);
      document.addEventListener("touchstart", fn);
    },

    /**
     * Can be called to explicitly disable event listening
     * for clicks and touches outside of this element.
     */
    disableOnClickOutside: function() {
      var fn = this.__outsideClickHandler;
      document.removeEventListener("mousedown", fn);
      document.removeEventListener("touchstart", fn);
    }
  };

}));
