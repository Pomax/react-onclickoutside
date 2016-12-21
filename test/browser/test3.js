(function() {
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

  const Test = onClickOutside(Test3Class); /* global onClickOutside */

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
      console.log('show');
      this.setState({ hideToolbox: false });
    }
    hide() {
      console.log('hide');
      this.setState({ hideToolbox: true });
    }
  }

  ReactDOM.render(React.createElement(App), document.getElementById('app3'));

}());
