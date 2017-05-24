(function test1(onClickOutside) {
  onClickOutside = onClickOutside.default;

  /**
   * Human-triggered for now, this should become a normal phantom test instead
   */
  class BaseComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        highlight: false,
      };
    }

    handleClickOutside() {
      console.log('remove highlight', this.props.id);
      this.setState({ highlight: false });
    }

    highlight() {
      console.log('highlight', this.props.id);
      this.setState({ highlight: true });
    }

    render() {
      var className = 'concentric' + (this.state.highlight ? ' highlight' : '');
      return React.createElement('div', {
        className: className,
        children: this.props.children,
        onClick: e => this.highlight(e),
      });
    }
  }

  const Nested = onClickOutside(BaseComponent);

  const App = function() {
    return React.createElement(Nested, {
      id: 1,
      stopPropagation: true,
      children: React.createElement(Nested, {
        id: 2,
        stopPropagation: true,
        children: React.createElement(Nested, {
          id: 3,
          stopPropagation: true,
          children: React.createElement('div', { className: 'label', children: ['test'] }),
        }),
      }),
    });
  };

  ReactDOM.render(React.createElement(App), document.getElementById('app1'));
})(onClickOutside); /* global onClickOutside */
