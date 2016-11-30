import Backbone from 'backbone';

function lpad(str, length, padstr) {
	var paddingLen = length - (str + '').length;
	paddingLen = paddingLen < 0 ? 0 : paddingLen;
	var padding = '';
	for (var i = 0; i < paddingLen; i++) {
		padding = padding + padstr;
	}
	return padding + str;
}

var Backgrid = {
	VERSION: '0.3.7-es6',
	Extension: {},

	resolveNameToClass: function (name, suffix) {
		if (_.isString(name)) {
			var key = _.map(name.split('-'), function (e) {
				return e.slice(0, 1).toUpperCase() + e.slice(1);
			}).join('') + suffix;
			var klass = Backgrid[key] || Backgrid.Extension[key];
			if (_.isUndefined(klass)) {
				throw new ReferenceError("Class '" + key + "' not found");
			}
			return klass;
		}

		return name;
	},

	callByNeed: function () {
		var value = arguments[0];
		if (!_.isFunction(value)) return value;

		var context = arguments[1];
		var args = [].slice.call(arguments, 2);
		return value.apply(context, !!(args + '') ? args : []);
	},
	$: Backbone.$

};
_.extend(Backgrid, Backbone.Events);

export {
	lpad,
	Backgrid
};
