# An onClickOutside mixin for React components

## installation

If you have Node.js needs, you can install this mixin via `npm`, using:

```
npm install react-onclickoutside --save
```

(or `--save-dev` depending on your needs). You then use it in your components as:

```
var Component = React.createClass({
  mixins: [
    require('react-onclickoutside')
  ],

  handleClickOutside: function(evt) {
    // ...handling code goes here...
  }
});
```

If you have plain-old-browser needs, you can install this mixin via `bower`, using:

```
bower install react-onclickoutside
```

and then include it as script via:

```
<script src="bower_components/react-onclickoutside/index.js"></script>
```

Then use it as:

```
var Component = React.createClass({
  mixins: [
    OnClickOutside
  ],

  handleClickOutside: function(evt) {
    // ...handling code goes here...
  }
});
```

If you want the mixin to ignore certain elements, then add the class
`ignore-react-onclickoutside` to that element and the callback won't be
invoked when the click happens inside elements with that class.

For bugs and enhancements hit up https://github.com/Pomax/react-onclickoutside/issues
