(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
	typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
	(factory((global.onClickOutside = global.onClickOutside || {}),global.React));
}(this, (function (exports,react) { 'use strict';

/**
 * Check whether some DOM node is our Component's node.
 */
function isNodeFound(current, componentNode, ignoreClass) {
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
}

/**
 * Try to find our node in a hierarchy of nodes, returning the document
 * node as highest node if our node is not found in the path up.
 */
function findHighest(current, componentNode, ignoreClass) {
  if (current === componentNode) {
    return true;
  }

  // If source=local then this event came from 'somewhere'
  // inside and should be ignored. We could handle this with
  // a layered approach, too, but that requires going back to
  // thinking in terms of Dom node nesting, running counter
  // to React's 'you shouldn't care about the DOM' philosophy.
  while (current.parentNode) {
    if (isNodeFound(current, componentNode, ignoreClass)) {
      return true;
    }
    current = current.parentNode;
  }
  return current;
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
function generateOutsideCheck(componentNode, eventHandler, ignoreClass, excludeScrollbar, preventDefault, stopPropagation) {
  return function (evt) {
    if (preventDefault) {
      evt.preventDefault();
    }
    if (stopPropagation) {
      evt.stopPropagation();
    }
    const current = evt.target;
    if (excludeScrollbar && clickedScrollbar(evt) || findHighest(current, componentNode, ignoreClass) !== document) {
      return;
    }
    eventHandler(evt);
  };
}

/**
 * A higher-order-component for handling onClickOutside for React components.
 */
const registeredComponents = [];
const handlers = [];

/**
 * This function generates the HOC function that you'll use
 * in order to impart onOutsideClick listening to an
 * arbitrary component. It gets called at the end of the
 * bootstrapping code to yield an instance of the
 * onClickOutsideHOC function defined inside setupHOC().
 */
function onClickOutsideHOC(WrappedComponent, config) {
  var _class, _temp2;

  return _temp2 = _class = class onClickOutside extends react.Component {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.enableOnClickOutside = () => {
        const fn = this.__outsideClickHandler;
        if (typeof document !== 'undefined') {
          let events = this.props.eventTypes;
          if (!events.forEach) {
            events = [events];
          }
          events.forEach(eventName => document.addEventListener(eventName, fn));
        }
      }, this.disableOnClickOutside = () => {
        const fn = this.__outsideClickHandler;
        if (typeof document !== 'undefined') {
          let events = this.props.eventTypes;
          if (!events.forEach) {
            events = [events];
          }
          events.forEach(eventName => document.removeEventListener(eventName, fn));
        }
      }, this.getRef = ref => this.instanceRef = ref, _temp;
    }

    /**
     * Access the WrappedComponent's instance.
     */
    getInstance() {
      if (!WrappedComponent.prototype.isReactComponent) {
        return this;
      }
      const ref = this.instanceRef;
      return ref.getInstance ? ref.getInstance() : ref;
    }

    // this is given meaning in componentDidMount
    __outsideClickHandler() {}

    /**
     * Add click listeners to the current document,
     * linked to this component's state.
     */
    componentDidMount() {
      // If we are in an environment without a DOM such
      // as shallow rendering or snapshots then we exit
      // early to prevent any unhandled errors being thrown.
      if (typeof document === 'undefined' || !document.createElement) {
        return;
      }

      const instance = this.getInstance();
      var clickOutsideHandler;

      if (config && typeof config.handleClickOutside === 'function') {
        clickOutsideHandler = config.handleClickOutside(instance);
        if (typeof clickOutsideHandler !== 'function') {
          throw new Error('WrappedComponent lacks a function for processing outside click events specified by the handleClickOutside config option.');
        }
      } else if (typeof instance.handleClickOutside === 'function') {
        if (react.Component.prototype.isPrototypeOf(instance)) {
          clickOutsideHandler = instance.handleClickOutside.bind(instance);
        } else {
          clickOutsideHandler = instance.handleClickOutside;
        }
      } else if (typeof instance.props.handleClickOutside === 'function') {
        clickOutsideHandler = instance.props.handleClickOutside;
      } else {
        throw new Error('WrappedComponent lacks a handleClickOutside(event) function for processing outside click events.');
      }

      // TODO: try to get rid of this, could be done with function ref, might be problematic for SFC though, they do not expose refs
      const componentNode = this.instanceRef;
      if (componentNode === null) {
        console.warn('Antipattern warning: there was no DOM node associated with the component that is being wrapped by outsideClick.');
        console.warn(['This is typically caused by having a component that starts life with a render function that', 'returns `null` (due to a state or props value), so that the component \'exist\' in the React', 'chain of components, but not in the DOM.\n\nInstead, you need to refactor your code so that the', 'decision of whether or not to show your component is handled by the parent, in their render()', 'function.\n\nIn code, rather than:\n\n  A{render(){return check? <.../> : null;}\n  B{render(){<A check=... />}\n\nmake sure that you', 'use:\n\n  A{render(){return <.../>}\n  B{render(){return <...>{ check ? <A/> : null }<...>}}\n\nThat is:', 'the parent is always responsible for deciding whether or not to render any of its children.', 'It is not the child\'s responsibility to decide whether a render instruction from above should', 'get ignored or not by returning `null`.\n\nWhen any component gets its render() function called,', 'that is the signal that it should be rendering its part of the UI. It may in turn decide not to', 'render all of *its* children, but it should never return `null` for itself. It is not responsible', 'for that decision.'].join(' '));
      }

      const fn = this.__outsideClickHandler = generateOutsideCheck(componentNode, clickOutsideHandler, this.props.outsideClickIgnoreClass, this.props.excludeScrollbar, this.props.preventDefault, this.props.stopPropagation);

      const pos = registeredComponents.length;
      registeredComponents.push(this);
      handlers[pos] = fn;

      // If there is a truthy disableOnClickOutside property for this
      // component, don't immediately start listening for outside events.
      if (!this.props.disableOnClickOutside) {
        this.enableOnClickOutside();
      }
    }

    /**
    * Track for disableOnClickOutside props changes and enable/disable click outside
    */
    componentWillReceiveProps(nextProps) {
      if (this.props.disableOnClickOutside && !nextProps.disableOnClickOutside) {
        this.enableOnClickOutside();
      } else if (!this.props.disableOnClickOutside && nextProps.disableOnClickOutside) {
        this.disableOnClickOutside();
      }
    }

    /**
     * Remove all document's event listeners for this component
     */
    componentWillUnmount() {
      this.disableOnClickOutside();
      this.__outsideClickHandler = false;
      const pos = registeredComponents.indexOf(this);
      if (pos > -1) {
        // clean up so we don't leak memory
        if (handlers[pos]) {
          handlers.splice(pos, 1);
        }
        registeredComponents.splice(pos, 1);
      }
    }

    /**
     * Can be called to explicitly enable event listening
     * for clicks and touches outside of this element.
     */


    /**
     * Can be called to explicitly disable event listening
     * for clicks and touches outside of this element.
     */


    /**
     * Pass-through render
     */
    render() {
      var props = Object.keys(this.props).filter(prop => prop !== 'excludeScrollbar').reduce((props, prop) => {
        props[prop] = this.props[prop];
        return props;
      }, {});

      if (WrappedComponent.prototype.isReactComponent) {
        props.ref = this.getRef;
      } else {
        props.wrappedRef = this.getRef;
      }

      props.disableOnClickOutside = this.disableOnClickOutside;
      props.enableOnClickOutside = this.enableOnClickOutside;

      return react.createElement(WrappedComponent, props);
    }
  }, _class.displayName = `OnClickOutside(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`, _class.defaultProps = {
    eventTypes: ['mousedown', 'touchstart'],
    excludeScrollbar: config && config.excludeScrollbar || false,
    outsideClickIgnoreClass: 'ignore-react-onclickoutside',
    preventDefault: false,
    stopPropagation: false
  }, _class.getClass = () => WrappedComponent.getClass ? WrappedComponent.getClass() : WrappedComponent, _temp2;
}

exports['default'] = onClickOutsideHOC;

Object.defineProperty(exports, '__esModule', { value: true });

})));
