/**
 * A higher-order-component for handling onClickOutside for React components.
 */
(function(root) {
  "use strict";

  // administrative
  var registeredComponents = [];
  var handlers = [];
  var IGNORE_CLASS = 'ignore-react-onclickoutside';
  var DEFAULT_EVENTS = ['mousedown', 'touchstart'];

  /**
   * Check whether some DOM node is our Component's node.
   */
  var isNodeFound = function(current, componentNode, ignoreClass) {
    if (current === componentNode) {
      return true;
    }
    // SVG <use/> elements do not technically reside in the rendered DOM, so
    // they do not have classList directly, but they offer a link to their
    // corresponding element, which can have classList. This extra check is for
    // that case.
    // See: http://www.w3.org/TR/SVG11/struct.html#InterfaceSVGUseElement
    // Discussion: https://github.com/Pomax/react-onclickoutside/pull/17
    if (current.correspondingElement) {
      return current.correspondingElement.classList.contains(ignoreClass);
    }
    return current.classList.contains(ignoreClass);
  };

  /**
   * Generate the event handler that checks whether a clicked DOM node
   * is inside of, or lives outside of, our Component's node tree.
   */
  var generateOutsideCheck = function(componentNode, eventHandler, ignoreClass, preventDefault, stopPropagation) {
    return function(evt) {
      if (preventDefault) {
        evt.preventDefault();
      }
      if (stopPropagation) {
        evt.stopPropagation();
      }
      var current = evt.target;
      var found = false;
      // If source=local then this event came from "somewhere"
      // inside and should be ignored. We could handle this with
      // a layered approach, too, but that requires going back to
      // thinking in terms of Dom node nesting, running counter
      // to React's "you shouldn't care about the DOM" philosophy.
      while(current.parentNode) {
        found = isNodeFound(current, componentNode, ignoreClass);
        if(found) return;
        current = current.parentNode;
      }
      // If element is in a detached DOM, consider it "not clicked
      // outside", as it cannot be known whether it was outside.
      if(current !== document) return;
      eventHandler(evt);
    }
  };


  /**
   * This function generates the HOC function that you'll use
   * in order to impart onOutsideClick listening to an
   * arbitrary component.
   */
  function setupHOC(root, React, ReactDOM) {

    // The actual Component-wrapping HOC:
    return function(Component) {
      var wrapComponentWithOnClickOutsideHandling = React.createClass({
        statics: {
          /**
           * Access the wrapped Component's class.
           */
          getClass: function() {
            if (Component.getClass) {
              return Component.getClass();
            }
            return Component;
          }
        },

        /**
         * Access the wrapped Component's instance.
         */
        getInstance: function() {
          return this.refs.instance;
        },

        // this is given meaning in componentDidMount
        __outsideClickHandler: function(evt) {},

        /**
         * Add click listeners to the current document,
         * linked to this component's state.
         */
        componentDidMount: function() {
          var instance = this.getInstance();

          if(typeof instance.handleClickOutside !== "function") {
            throw new Error("Component lacks a handleClickOutside(event) function for processing outside click events.");
          }

          var fn = this.__outsideClickHandler = generateOutsideCheck(
            ReactDOM.findDOMNode(instance),
            instance.handleClickOutside.bind(instance, undefined),
            this.props.outsideClickIgnoreClass || IGNORE_CLASS,
            this.props.preventDefault || false,
            this.props.stopPropagation || false
          );

          var pos = registeredComponents.length;
          registeredComponents.push(this);
          handlers[pos] = fn;

          // If there is a truthy disableOnClickOutside property for this
          // component, don't immediately start listening for outside events.
          if (!this.props.disableOnClickOutside) {
            this.enableOnClickOutside();
          }
        },

        /**
        * Track for disableOnClickOutside props changes and enable/disable click outside
        */
        componentWillReceiveProps: function(nextProps) {
          if (this.props.disableOnClickOutside && !nextProps.disableOnClickOutside) {
            this.enableOnClickOutside();
          } else if (!this.props.disableOnClickOutside && nextProps.disableOnClickOutside) {
            this.disableOnClickOutside();
          }
        },

        /**
         * Remove the document's event listeners
         */
        componentWillUnmount: function() {
          this.disableOnClickOutside();
          this.__outsideClickHandler = false;
          var pos = registeredComponents.indexOf(this);
          if( pos>-1) {
            // clean up so we don't leak memory
            if (handlers[pos]) { handlers.splice(pos, 1); }
            registeredComponents.splice(pos, 1);
          }
        },

        /**
         * Can be called to explicitly enable event listening
         * for clicks and touches outside of this element.
         */
        enableOnClickOutside: function() {
          var fn = this.__outsideClickHandler;
          if (typeof document !== "undefined") {
            var events = this.props.eventTypes || DEFAULT_EVENTS;
            if (!events.forEach) { events = [events] };
            events.forEach(function (eventName) {
              document.addEventListener(eventName, fn);
            });
          }
        },

        /**
         * Can be called to explicitly disable event listening
         * for clicks and touches outside of this element.
         */
        disableOnClickOutside: function() {
          var fn = this.__outsideClickHandler;
          if (typeof document !== "undefined") {
            var events = this.props.eventTypes || DEFAULT_EVENTS;
            if (!events.forEach) { events = [events] };
            events.forEach(function (eventName) {
              document.removeEventListener(eventName, fn);
            });
          }
        },

        /**
         * Pass-through render
         */
        render: function() {
          var passedProps = this.props;
          var props = { ref: 'instance' };
          Object.keys(this.props).forEach(function(key) {
            props[key] = passedProps[key];
          });
          return React.createElement(Component,  props);
        }
      });

      // Add display name for React devtools
      (function bindWrappedComponentName(c, wrapper) {
        var componentName = c.displayName || c.name || 'Component'
        wrapper.displayName = 'OnClickOutside(' + componentName + ')';
      }(Component, wrapComponentWithOnClickOutsideHandling));

      return wrapComponentWithOnClickOutsideHandling;
    };
  }

  /**
   * This function sets up the library in ways that
   * work with the various modulde loading solutions
   * used in JavaScript land today.
   */
  function setupBinding(root, factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['react','react-dom'], function(React, ReactDom) {
        return factory(root, React, ReactDom);
      });
    } else if (typeof exports === 'object') {
      // Node. Note that this does not work with strict
      // CommonJS, but only CommonJS-like environments
      // that support module.exports
      module.exports = factory(root, require('react'), require('react-dom'));
    } else {
      // Browser globals (root is window)
      root.onClickOutside = factory(root, React, ReactDOM);
    }
  }

  // Make it all happen
  setupBinding(root, setupHOC);

}(this));
