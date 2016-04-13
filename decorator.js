var React = require('react');
var objectAssign = require('object-assign');
var OnClickOutsideMixin = require('react-onclickoutside');


function addClickOutsideListener(Component, componentMethodsToExpose) {

  var classDefinition = {

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
  };

  if (componentMethodsToExpose) {
    componentMethodsToExpose.forEach(function(method) {
      classDefinition[method] = function() {
        this.refs.inner[method].apply(this.refs.inner, arguments);
      };
    });
  }

  return React.createClass(classDefinition);
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
 * The HOC wraps the original component so any public methods of that component will no longer be
 * available to its parent. This may be problematic, especially, for example, when wrapping inputs
 * of which the `focus()` and `blur()` methods are often used. To expose these methods on the HOC supply
 * the method names as an array on the second argument of the wrapper function or first argument of
 * the decorator:
 *
 *   Child = listenToClickOutside(Child, ['focus', 'blur']);
 *
 *   // OR
 *
 *   @listensToClickOutside(['focus', 'blur'])
 *
 * @param {React.Component} [Component] The component outside of which to listen to clicks.
 * @param {Array} [componentMethodsToExpose] An array of method names on the wrapped component which should be
 *                                           available on the higher order component.
 * @returns {React.Component} or {Function} if using the decorator pattern.
 */
function listensToClickOutside(Component, componentMethodsToExpose) {
  // support decorator pattern
  if (!arguments.length || Array.isArray(Component)) {
    var _componentMethodsToExpose = Component;
    return function listensToClickOutsideDecorator(ComponentToDecorate) {
      return addClickOutsideListener(ComponentToDecorate, _componentMethodsToExpose);
    };
  }

  return addClickOutsideListener(Component, componentMethodsToExpose);
}

module.exports = listensToClickOutside;
