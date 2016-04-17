/**
 * Human-triggered for now, this should become a normal phantom test instead
 */
var Nested = React.createClass({
  getInitialState: function() {
    return { highlight: false };
  },

  handleClickOutside: function(evt) {
    this.setState({ highlight: false });
  },

  highlight: function() {
    console.log(this.props.id);
    this.setState({ highlight: true });
  },

  render: function() {
    var className = "concentric" + (this.state.highlight? " highlight" : '');
    return React.createElement("div", {
      className: className,
      children: this.props.children,
      onClick: this.highlight
    });
  }
});

Nested = onClickOutside(Nested);

var App = React.createClass({
  render: function() {
    return React.createElement(Nested, {
      id: 1,
      stopPropagation: true,
      children: React.createElement(Nested, {
        id: 2,
        stopPropagation: true,
        children: React.createElement(Nested, {
          id: 3,
          stopPropagation: true,
          children: React.createElement("div", { className: "label", children: ["test"] })
        })
      })
    });
  }
});

ReactDOM.render(React.createElement(App), document.getElementById('app'));
