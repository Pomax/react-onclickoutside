(function test3(onClickOutside) {
  onClickOutside = onClickOutside.default;

  class BasePopup extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return React.createElement('p', { children: 'click this text (This is inside shadow DOM)' });
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
        ref: this.outsideNodeRef,
        children: [
          React.createElement('button', {
            onClick: e => this.state.hideToolbox && this.show(e),
            children: 'show text inside shadow DOM',
          }),
          this.state.hideToolbox ? null : React.createElement(Popup, { hide: e => this.hide(e) }),
        ],
      });
    }
    show() {
      this.setState({ hideToolbox: false });
    }
    hide() {
      this.setState({ hideToolbox: true });
    }
  }

  customElements.define(
    'test-app-3',
    class extends HTMLElement {
      constructor() {
        super();

        let shadowRoot = this.attachShadow({ mode: 'open' });
        ReactDOM.render(React.createElement(App), shadowRoot);
      }
    },
  );
})(onClickOutside); /* global onClickOutside */
