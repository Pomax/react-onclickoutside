# An onClickOutside wrapper for React components

This is a React **H**igher **O**rder **C**omponent that you can use with your own React components if you want to have them listen for clicks that occur somewhere in the document, outside of the element itself (for instance, if you need to hide a menu when people click anywhere else on your page).

Note that this HOC relies on the `.classList` property, which is supported by all modern browsers, but not by no longer supported browsers like IE9 or older. If your code relies on classList in any way, you want to use a polyfill like [dom4](https://github.com/WebReflection/dom4)

## Installation

Use `npm`:

```
$> npm install react-onclickoutside --save
```

(or `--save-dev` depending on your needs). You then use it in your components as:

```javascript
// load the HOC:
var onClickOutside = require('react-onclickoutside');

// create a new component, wrapped by this onclickoutside HOC:
var MyComponent = onClickOutside(React.createClass({
  ...,
  handleClickOutside: function(evt) {
    // ...handling code goes here...
  },
  ...
}));

```

Note that if you try to wrap a React component class without `handleClickOutside(evt)` handler, the HOC will throw an error. If you want onClickOutside functionality, you *must* have this function defined.

## Regulate which events to listen for

By default, "outside clicks" are based on both `mousedown` and `touchstart` events; if that is what you need, then you do not need to specify anything special. However, if you need different events, you can specify these using the `eventTypes` property. If you just need one event, you can pass in the event name as plain string:

```
<MyComponent eventTypes="click" ... />
```

For multiple events, you can pass in the array of event names you need to listen for:

```
<MyComponent eventTypes={["click", "touchend"]} ... />
```

## Regulate whether or not to listen for outside clicks

Wrapped components have two functions that can be used to explicitly listen for, or do nothing with, outside clicks

- `enableOnClickOutside()` - Enables outside click listening by setting up the event listening bindings.
- `disableOnClickOutside()` - Disables outside click listening by explicitly removing the event listening bindings.

In addition, you can create a component that uses this HOC such that it has the code set up and ready to go, but not listening for outside click events until you explicitly issue its `enableOnClickOutside()`, by passing in a properly called `disableOnClickOutside`:

```javascript
var onClickOutside = require('react-onclickoutside');

var MyComponent = onClickOutside(React.createClass({
  ...,
  handleClickOutside: function(evt) {
    // ...
  },
  ...
}));

var Container = React.createClass({
  render: function(evt) {
    return <MyComponent disableOnClickOutside={true} />
  }
});
```

Using `disableOnClickOutside()` or `enableOnClickOutside()` within `componentDidMount` or `componentWillMount` is considered an anti-pattern, and does not have consistent behavior when using the mixin and HOC/ES7 Decorator. Favor setting the `disableOnClickOutside` property on the component.

## Regulating `evt.preventDefault()` and `evt.stopPropagation()`

Technically this HOC lets you pass in `preventDefault={true/false}` and `preventDefault={true/false}` to regulate what happens to the event when it hits your `handleClickOutside(evt)` function, but beware: `stopPropagation` may not do what you expect it to do.

Each component adds new event listeners to the document, which may or may not cause as many event triggers as there are event listening bindings. In the test file found in `./test/browser/index.html`, the coded uses `stopPropagation={true}` but sibling events still make it to "parents".   

## Marking elements as "skip over this one" during the event loop

If you want the HOC to ignore certain elements, you can tell the HOC which CSS class name it should use for this purposes. If you want explicit control over the class name, use `outsideClickIgnoreClass={some string}` as component property, or if you don't, the default string used is `ignore-react-onclickoutside`.

## Older React code: "What happened to the Mixin??"

Due to ES2015/ES6 `class` syntax making mixins essentially impossible, and the fact that HOC wrapping works perfectly fine in ES5 and older versions of React, as of this package's version 5.0.0 no Mixin is offered anymore.

If you *absolutely* need a mixin... you really don't.

### But how can I access my component? It has an API that I rely on!

No, I get that. I constantly have that problem myself, so while there is no universal agreement on how to do that, this HOC offers a `getInstance()` function that you can call for a reference to the component you wrapped, so that you can call its API without headaches:

```javascript
var onClickOutside = require('react-onclickoutside');

var MyComponent = onClickOutside(React.createClass({
  ...,
  handleClickOutside: function(evt) {
    // ...
  },
  ...
}));

var Container = React.createClass({
  someFunction: function() {
    var ref = this.refs.mycomp;
    // 1) Get the wrapped component instance: 
    var superTrueMyComponent = ref.getInstance();   
    // and call instance functions defined for it: 
    superTrueMyComponent.customFunction();
  },

  render: function(evt) {
    return <MyComponent disableOnClickOutside={true} ref="mycomp"/>
  }
});
```

Note that there is also a `getClass()` function, to get the original Class that was passed into the HOC wrapper, but if you find yourself needing this you're probably doing something wrong: you really want to define your classes as real, require'able etc. units, and then write wrapped components separately, so that you can always access the original class's `statics` etc. properties without needing to extract them out of a HOC.

## Which version do I need for which version of React?

If you use **React 0.12 or 0.13**, **version 2.4 and below** will work.

If you use **React 0.14*, use **v2.5 through v4.9**, as these specifically use `react-DOM` for the necessary DOM event bindings.

If you use **React 15** (or higher), you can use **v4.x, which offers both a mixin and HOC, or use v5.x, which is HOC-only**.

### Support-wise, only the latest version will receive updates and bug fixes.

I do not believe in perpetual support for outdated libraries, so if you find one of the older versions is not playing nice with an even older React: you know what to do, and it's not "keep using that old version of React".

## IE does not support classList for SVG elements!

This is true, but also an edge-case problem that only exists for older versions of IE (including IE11), and should be addressed by you, rather than by  thousands of individual libraries that assume browsers have proper HTML API implementations (IE Edge has proper `classList` support even for SVG).

If you need this to work, you can add a shim for `classList` to your page(s), loaded before you load your React code, and you'll have instantly fixed *every* library that you might remotely rely on that makes use of the `classList` property. You can find several shims quite easily, a good one to start with is the [dom4](https://github.com/WebReflection/dom4) shim, which addss all manner of good DOM4 properties to "not quite at DOM4 yet" browser implementations.

Eventually this problem will stop being one, but in the mean time *you* are responsible for making *your* site work by shimming everything that needs shimming for IE.  As such, **if you file a PR to fix classList-and-SVG issues specifically for this library, your PR will be clossed and I will politely point you to this README.md section**. I will not accept PRs to fix this issue. You already have the power to fix it, and I expect you to take responsibility as a fellow developer to let Microsoft know you need them to implement this.
