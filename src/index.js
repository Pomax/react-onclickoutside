import { createElement, Component } from 'react';
import { findDOMNode } from 'react-dom';
import * as DOMHelpers from './dom-helpers';
import uid from './uid';

const handlersMap = {};

const touchEvents = ['touchstart', 'touchmove'];
export const IGNORE_CLASS_NAME = 'ignore-react-onclickoutside';

/**
 * This function generates the HOC function that you'll use
 * in order to impart onOutsideClick listening to an
 * arbitrary component. It gets called at the end of the
 * bootstrapping code to yield an instance of the
 * onClickOutsideHOC function defined inside setupHOC().
 */
export default function onClickOutsideHOC(WrappedComponent, config) {
  return class onClickOutside extends Component {
    static displayName = `OnClickOutside(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    static defaultProps = {
      eventTypes: ['mousedown', 'touchstart'],
      excludeScrollbar: (config && config.excludeScrollbar) || false,
      outsideClickIgnoreClass: IGNORE_CLASS_NAME,
      preventDefault: false,
      stopPropagation: false,
    };

    static getClass = () => (WrappedComponent.getClass ? WrappedComponent.getClass() : WrappedComponent);

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

    __outsideClickHandler = event => {
      if (typeof this.__clickOutsideHandlerProp === 'function') {
        this.__clickOutsideHandlerProp(event);
        return;
      }

      const instance = this.getInstance();

      if (typeof instance.props.handleClickOutside === 'function') {
        instance.props.handleClickOutside(event);
        return;
      }

      if (typeof instance.handleClickOutside === 'function') {
        instance.handleClickOutside(event);
        return;
      }

      throw new Error(
        'WrappedComponent lacks a handleClickOutside(event) function for processing outside click events.',
      );
    };

    /**
     * Add click listeners to the current document,
     * linked to this component's state.
     */
    componentDidMount() {
      this._uid = uid();
      // If we are in an environment without a DOM such
      // as shallow rendering or snapshots then we exit
      // early to prevent any unhandled errors being thrown.
      if (typeof document === 'undefined' || !document.createElement) {
        return;
      }

      const instance = this.getInstance();

      if (config && typeof config.handleClickOutside === 'function') {
        this.__clickOutsideHandlerProp = config.handleClickOutside(instance);
        if (typeof this.__clickOutsideHandlerProp !== 'function') {
          throw new Error(
            'WrappedComponent lacks a function for processing outside click events specified by the handleClickOutside config option.',
          );
        }
      }

      this.componentNode = findDOMNode(this.getInstance());
      this.enableOnClickOutside();
    }

    componentDidUpdate() {
      this.componentNode = findDOMNode(this.getInstance());
    }

    /**
     * Remove all document's event listeners for this component
     */
    componentWillUnmount() {
      this.disableOnClickOutside();
    }

    /**
     * Can be called to explicitly enable event listening
     * for clicks and touches outside of this element.
     */
    enableOnClickOutside = () => {
      if (typeof document === 'undefined') return;

      let events = this.props.eventTypes;
      if (!events.forEach) {
        events = [events];
      }

      handlersMap[this._uid] = event => {
        if (this.props.disableOnClickOutside) return;
        if (this.componentNode === null) return;

        if (this.props.preventDefault) {
          event.preventDefault();
        }

        if (this.props.stopPropagation) {
          event.stopPropagation();
        }

        if (this.props.excludeScrollbar && DOMHelpers.clickedScrollbar(event)) return;

        const current = event.target;

        if (DOMHelpers.findHighest(current, this.componentNode, this.props.outsideClickIgnoreClass) !== document) {
          return;
        }

        this.__outsideClickHandler(event);
      };

      events.forEach(eventName => {
        let handlerOptions = null;
        const isTouchEvent = touchEvents.indexOf(eventName) !== -1;

        if (isTouchEvent) {
          handlerOptions = { passive: !this.props.preventDefault };
        }

        document.addEventListener(eventName, handlersMap[this._uid], handlerOptions);
      });
    };

    /**
     * Can be called to explicitly disable event listening
     * for clicks and touches outside of this element.
     */
    disableOnClickOutside = () => {
      const fn = handlersMap[this._uid];
      if (fn && typeof document !== 'undefined') {
        let events = this.props.eventTypes;
        if (!events.forEach) {
          events = [events];
        }
        events.forEach(eventName => document.removeEventListener(eventName, fn));
        delete handlersMap[this._uid];
      }
    };

    getRef = ref => (this.instanceRef = ref);

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

      return createElement(WrappedComponent, props);
    }
  };
}
