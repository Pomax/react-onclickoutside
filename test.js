var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var OnClickOutside = require('.');

describe('onclickoutside mixin', function() {

  var OutsideClickComponent = React.createClass({
    mixins: [OnClickOutside],

    getInitialState: function() {
      return {handleClickOutsideCalled: false};
    },

    handleClickOutside: function() {
      this.setState({handleClickOutsideCalled: true});
    },

    render: function() {
      return React.createElement('div');
    }
  });

  it('should call handleClickOutside when clicking the document', function() {
    var element = React.createElement(OutsideClickComponent);
    var component = TestUtils.renderIntoDocument(element);
    document.dispatchEvent(new Event('mousedown'));
    assert(component.state.handleClickOutsideCalled);
  });

});
