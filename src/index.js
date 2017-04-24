import { createElement, Component } from 'react';
import generateOutsideCheck from './generateOutsideCheck';

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
export default function onClickOutsideHOC(WrappedComponent, config) {
  return class onClickOutside extends Component {
    static displayName = `OnClickOutside(${ WrappedComponent.displayName || WrappedComponent.name || 'Component' })`

    static defaultProps = {
      eventTypes: ['mousedown', 'touchstart'],
      excludeScrollbar: (config && config.excludeScrollbar) || false,
      outsideClickIgnoreClass: 'ignore-react-onclickoutside',
      preventDefault: false,
      stopPropagation: false,
    }

    static getClass = () => WrappedComponent.getClass ? WrappedComponent.getClass() : WrappedComponent

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
      if (typeof document === 'undefined' || !document.createElement){
        return;
      }

      const instance = this.getInstance();
      var clickOutsideHandler;

      if(config && typeof config.handleClickOutside === 'function') {
        clickOutsideHandler = config.handleClickOutside(instance);
        if(typeof clickOutsideHandler !== 'function') {
          throw new Error('WrappedComponent lacks a function for processing outside click events specified by the handleClickOutside config option.');
        }
      } else if(typeof instance.handleClickOutside === 'function') {
        if (Component.prototype.isPrototypeOf(instance)) {
          clickOutsideHandler = instance.handleClickOutside.bind(instance);
        } else {
          clickOutsideHandler = instance.handleClickOutside;
        }
      } else if(typeof instance.props.handleClickOutside === 'function') {
        clickOutsideHandler = instance.props.handleClickOutside;
      } else {
        throw new Error('WrappedComponent lacks a handleClickOutside(event) function for processing outside click events.');
      }

      // TODO: try to get rid of this, could be done with function ref, might be problematic for SFC though, they do not expose refs
      const componentNode = this.instanceRef;
      if (componentNode === null) {
        console.warn('Antipattern warning: there was no DOM node associated with the component that is being wrapped by outsideClick.');
        console.warn([
          'This is typically caused by having a component that starts life with a render function that',
          'returns `null` (due to a state or props value), so that the component \'exist\' in the React',
          'chain of components, but not in the DOM.\n\nInstead, you need to refactor your code so that the',
          'decision of whether or not to show your component is handled by the parent, in their render()',
          'function.\n\nIn code, rather than:\n\n  A{render(){return check? <.../> : null;}\n  B{render(){<A check=... />}\n\nmake sure that you',
          'use:\n\n  A{render(){return <.../>}\n  B{render(){return <...>{ check ? <A/> : null }<...>}}\n\nThat is:',
          'the parent is always responsible for deciding whether or not to render any of its children.',
          'It is not the child\'s responsibility to decide whether a render instruction from above should',
          'get ignored or not by returning `null`.\n\nWhen any component gets its render() function called,',
          'that is the signal that it should be rendering its part of the UI. It may in turn decide not to',
          'render all of *its* children, but it should never return `null` for itself. It is not responsible',
          'for that decision.'
        ].join(' '));
      }

      const fn = this.__outsideClickHandler = generateOutsideCheck(
        componentNode,
        clickOutsideHandler,
        this.props.outsideClickIgnoreClass,
        this.props.excludeScrollbar,
        this.props.preventDefault,
        this.props.stopPropagation
      );

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
        if (handlers[pos]) { handlers.splice(pos, 1); }
        registeredComponents.splice(pos, 1);
      }
    }

    /**
     * Can be called to explicitly enable event listening
     * for clicks and touches outside of this element.
     */
    enableOnClickOutside = () => {
      const fn = this.__outsideClickHandler;
      if (typeof document !== 'undefined') {
        let events = this.props.eventTypes;
        if (!events.forEach) {
          events = [events];
        }
        events.forEach(eventName => document.addEventListener(eventName, fn));
      }
    }

    /**
     * Can be called to explicitly disable event listening
     * for clicks and touches outside of this element.
     */
    disableOnClickOutside = () => {
      const fn = this.__outsideClickHandler;
      if (typeof document !== 'undefined') {
        let events = this.props.eventTypes;
        if (!events.forEach) {
          events = [events];
        }
        events.forEach(eventName => document.removeEventListener(eventName, fn));
      }
    }

    getRef = ref => this.instanceRef = ref

    /**
     * Pass-through render
     */
    render() {
      var props = Object.keys(this.props)
        .filter(prop => prop !== 'excludeScrollbar')
        .reduce((props, prop) => {
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
