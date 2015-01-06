var OnClickOutside = require('./index');

var register = OnClickOutside.onClickOutside.bind({
  getDOMNode: function() {
    return {};
  }
});

global.document = {
  addEventListener: function(){},
  removeEventListener: function(){}
}
var cache = register(function(evt) { console.log(evt); });
cache.remove();
