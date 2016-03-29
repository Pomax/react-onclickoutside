# An onClickOutside mixin for React components

This is a React mixin that you can add to your React components if you want to have them listen for clicks that occur somewhere in the document, outside of the element itself (for instance, if you need to hide a menu when people click anywhere else on your page).

Note that this mixin relies on the `.classList` property, which is supported by all modern browsers, but not by no longer supported browsers like IE9 or even older. For setups that need to support deprecated browsers, using a [classlist-polyfill](https://github.com/eligrey/classList.js/) will be necessary.

## installation

There are two ways to install this mixin, depending on your development process.

### NPM

If you have Node.js needs, you can install this mixin via `npm`, using:

```
npm install react-onclickoutside --save
```

(or `--save-dev` depending on your needs). You then use it in your components as:

```javascript
var Component = React.createClass({
  mixins: [
    require('react-onclickoutside')
  ],

  handleClickOutside: function(evt) {
    // ...handling code goes here...
  }
});
```
### For the browser (not recommended)

If you have plain-old-browser needs and for some reason are unable to use the modern browserify/webpack approach to building your JS payloads, you can install this mixin via `bower`, using:

```
bower install react-onclickoutside
```

and then include it as script via:

```html
<script src="bower_components/react-onclickoutside/index.js"></script>
```

Then use it as:

```javascript
var Component = React.createClass({
  mixins: [
    OnClickOutside
  ],

  handleClickOutside: function(evt) {
    // ...handling code goes here...
  }
});
```

## Regulate whether or not to listen for outside clicks

When using this mixin, a component has two functions that can be used to explicitly listen for, or do nothing with, outside clicks

- `enableOnClickOutside()` - Enables outside click listening by setting up the event listening bindings.
- `disableOnClickOutside()` - Disables outside click listening by explicitly removing the event listening bindings.

In addition, you can create a component that uses this mixin such that it has the code set up and ready to go, but not listening for outside click events until you explicitly issue its `enableOnClickOutside()`, by passing in a properly called `disableOnClickOutside`:

```javascript
var Component = React.createClass({
  mixins: [ ... ],
  handleClickOutside: function(evt) {
    // ...
  }
});

var Container = React.createClass({
  render: function(evt) {
    return <Component disableOnClickOutside={true} />
  }
});
```

## Marking elements as "skip over this one" during the event loop

If you want the mixin to ignore certain elements, then add the class `ignore-react-onclickoutside` to that element and the callback won't be invoked when the click happens inside elements with that class. This class can be changed by setting the `outsideClickIgnoreClass` property on the component.

## ES6/2015 class support via HOC / ES7 decorators

Since mixins can't be used with ES6/2015 class React components a
[Higher-Order Component (HOC)](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750)
and [ES7 decorator](https://github.com/wycats/javascript-decorators) are bundled with the mixin:

```javascript
import listensToClickOutside from 'react-onclickoutside/decorator';

class Component extends React.Component {
  handleClickOutside = (event) => {
    // ...
  }
}

export default listensToClickOutside(Component);

// OR

import listensToClickOutside from 'react-onclickoutside/decorator';

@listensToClickOutside()
class Component extends React.Component {
  handleClickOutside = (event) => {
    // ...
  }
}

export default Component;
```

One difference when using the HOC/decorator compared to the mixin is that the `enableOnClickOutside()`
and `disableOnClickOutside()` methods are not available as class methods, but rather on the `props`;
so instead of `this.enableOnClickOutside()` you would call `this.props.enableOnClickOutside()`.

In every other respect the the mixin and HOC/decorator provides the same functionality.

For bugs and enhancements hit up https://github.com/Pomax/react-onclickoutside/issues

## Version compatibility

If you still use React 0.13 or 0.12, any version up to and including 2.4 will work. Any version v4.* or above will not work due to relying on modules not introduced until React 0.14.

If you use React 0.14 or above, use v2.5 or higher, as that specifically uses `react-DOM` for the necessary DOM event bindings.


## IE does not support classList for SVG elements!

This is true, but also an edge-case problem that needs to be fixed in IE, not in individual libraries so that IE can keep getting away with not implementing proper support for all HTML5 elements. If you rely on this, I fully expect you to have already filed this as a feature request, to be added to MS Edge, or to have voted on getting it implemented.

If you haven't, and you *just* want this library fixed, then you already have the power to completely fix this problem yourself without needing to file any PRs: simply add a shim for `classList` to your page(s), loaded before you load your React code, and you'll have instantly fixed *every* library that you might remotely rely on that makes use of the `classList` property. You can find several shims quite easily, the usualy "first try" shim is the one given over on https://developer.mozilla.org/en/docs/Web/API/Element/classList

*A note on PRs for this issue*: I will not accept PRs to fix this issue. You already have the power to fix it, and I expect you to take responsibility as a fellow developer to let Microsoft know you need them to implement this.
