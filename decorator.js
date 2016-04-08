var React = require('react');
var objectAssign = require('object-assign');
var OnClickOutsideMixin = require('react-onclickoutside');


function addClickOutsideListener(Component) {

  return React.createClass({

    displayName: (Component.displayName || Component.name) + 'ClickOutside',

    mixins: [OnClickOutsideMixin],

    handleClickOutside: function(event) {
      if (this.refs.inner.handleClickOutside) {
        this.refs.inner.handleClickOutside(event);
      }
      else if (this.props.onClickOutside) {
        this.props.onClickOutside(event);
      }
    },

    render: function render() {
      return React.createElement(Component, objectAssign({
        enableOnClickOutside: this.enableOnClickOutside,
        disableOnClickOutside: this.disableOnClickOutside,
        ref: 'inner'
      }, this.props));
    }
  });
}


/**
 * @function listensToClickOutside
 *
 * A higher-order component for ES6 React classes to use the `handleClickOutside` event handler:
 *
 *   import listensToClickOutside from 'react-onclickoutside/decorator';
 *
 *   class Es6Component extends React.Component {
 *     handleClickOutside = (event) => {
 *       // ...handling code goes here...
 *     }
 *   }
 *
 *   export default listensToClickOutside(Es6Component);
 *
 * Alternatively you can pass the handler down from the parent on an `onClickOutside` prop:
 *
 *   class Child extends React.Component {
 *     // No event handler here, if provided this handler takes precedence and the one passed down
 *     // is not called automatically. If it should be, call it on the props from the child handler.
 *   }
 *
 *   Child = listenToClickOutside(Child);
 *
 *
 *   class Parent extends React.Component {
 *     handleClickOutside = (event) => {
 *       // ...handling code goes here...
 *     }
 *
 *     render() {
 *       return (
 *         <Child onClickOutside={this.handleClickOutside}/>
 *       );
 *     }
 *   }
 *
 * The [ES7 Decorator Pattern](https://github.com/wycats/javascript-decorators) is also supported
 * using the same import:
 *
 *   import listensToClickOutside from 'react-onclickoutside/decorator';
 *
 *   @listensToClickOutside()
 *   class Es6Component extends React.Component {
 *     handleClickOutside = (event) => {
 *       // ...handling code goes here...
 *     }
 *   }
 *
 * @param {React.Component} [Component] The component outside of which to listen to clicks.
 * @returns {React.Component} or {Function} if using the decorator pattern.
 */
function listensToClickOutside(Component) {
  // support decorator pattern
  if (!Component) {
    return function listensToClickOutsideDecorator(ComponentToDecorate) {
      return addClickOutsideListener(ComponentToDecorate);
    };
  }

  return addClickOutsideListener(Component);
}

module.exports = listensToClickOutside;
