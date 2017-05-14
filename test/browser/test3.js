(function test3(onClickOutside) {

  onClickOutside = onClickOutside.default;

  class Test3Class extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return null;
    }
    handleClickOutside() {
      this.props.hide();
    }
  }

  const Test = onClickOutside(Test3Class);

  class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        hideToolbox: true
      };
    }
    render() {
      return (
        React.createElement(Test, {hide: e => this.hide(e)})
      );
    }
    show() {
      console.log('test3 - show');
      this.setState({ hideToolbox: false });
    }
    hide() {
      console.log('test3 - hide');
      this.setState({ hideToolbox: true });
    }
  }

  ReactDOM.render(React.createElement(App), document.getElementById('app3'));

}(onClickOutside)); /* global onClickOutside */
