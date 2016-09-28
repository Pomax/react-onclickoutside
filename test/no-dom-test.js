var assert = require('assert');
var React = require('react');
var renderer = require('react-test-renderer');
var requireHijack = require('require-hijack');

describe('onclickoutside hoc with no DOM', function() {

  var Component = React.createClass({    

    handleClickOutside: function() {
    },

    render: function() {
      return React.createElement('div');
    }
  });

  // tests
  
  it('should not throw an error if rendered in an environment with no DOM', function() {
    // Needed until React 15.4 lands due to https://github.com/facebook/react/issues/7386.
    requireHijack.replace('react-dom').with({
      render: function(){}
    });

    // Must import this after we mock out ReactDOM to prevent the inject error.
    var wrapComponent = require('../index');
    var WrappedComponent = wrapComponent(Component);

    var element = React.createElement(WrappedComponent);
    assert(element, 'element can be created');
    var renderInstance = renderer.create(element);
    assert(renderInstance.toJSON().type === 'div', 'wrapped component renders a div');
  });

});
