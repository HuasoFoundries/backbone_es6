(function(global,factory) {
  if (typeof define == 'function' && define.amd)
    define([], factory);
  else if (typeof module == 'object' && module.exports && typeof require == 'function')
    module.exports = factory();
  else
    Helpers = factory();
}(this,function() {
	var MockHelpers = {
		setModalClass: function () {},
		getGlobalElement: function (category, id) {
			MockHelpers[category] = MockHelpers[category] || {};
			return MockHelpers[category][id];
		},
		getTemplate: function () {
			return null;
		},
		gettext: function (key) {
			return key;
		},
		loadingcircle: function () {
			return true;
		},
		setGlobalElement: function (category, id, object) {
			MockHelpers[category] = MockHelpers[category] || {};
			MockHelpers[category][id] = object;
			return object;
		},
		MapCollapsible: function () {
			return null;
		},
		loadingcircle:function() {
			
		}

	};
	return MockHelpers;
}));

