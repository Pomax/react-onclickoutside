(function test2(onClickOutside) {
  onClickOutside = onClickOutside.default;

  class BasePopup extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return React.createElement('span', { children: 'click this text' });
    }
    handleClickOutside() {
      this.props.hide();
    }
  }

  const Popup = onClickOutside(BasePopup);

  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hideToolbox: true,
      };
    }
    render() {
      return React.createElement('div', {
        children: [
          React.createElement('button', {
            onClick: e => this.state.hideToolbox && this.show(e),
            children: 'show text',
          }),
          this.state.hideToolbox ? null : React.createElement(Popup, { hide: e => this.hide(e) }),
        ],
      });
    }
    show() {
      console.log('test2 - show');
      this.setState({ hideToolbox: false });
    }
    hide() {
      console.log('test2 - hide');
      this.setState({ hideToolbox: true });
    }
  }

  ReactDOM.render(React.createElement(App), document.getElementById('app2'));
})(onClickOutside); /* global onClickOutside */
