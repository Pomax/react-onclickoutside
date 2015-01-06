# An onClickOutside mixin for React components

## installation

If you have Node.js needs, you can install this mixin via `npm`, using `npm install react-onclickoutside --save` (or `--save-dev` depending on your needs), and then use it in your components as:

```
var Component = React.createClass({
  mixins: [
    require('react-onclickoutside')
  ],

  componentDidMount: function() {
    this._fn = this.onClickOutside(this.handleOutsideClick);
  },

  componentWillUnmount : function() {
    this._fn.remove();
  },

  handleOutsideClick: function(evt) {
    // ...handling code goes here...
  }
});
```

via `bower`, using `bower install react-onclickoutside`, and then include it as script via:

```
<script src="bower_components/react-onclickoutside/index.js"></script>
```

Then use it as:

```
var Component = React.createClass({
  mixins: [
    Onclickoutside
  ],

  componentDidMount: function() {
    this._fn = this.onClickOutside(this.handleOutsideClick);
  },

  componentWillUnmount : function() {
    this._fn.remove();
  },

  handleOutsideClick: function(evt) {
    // ...handling code goes here...
  }
});
```

For bugs and enhancements hit up https://github.com/Pomax/react-onclickoutside/issues
