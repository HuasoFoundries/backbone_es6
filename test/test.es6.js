/**
 * * TESTS each module reading directly from each of them
 */

var debugMode = true;

console.log('globalvars', JSON.stringify(globalvars));

if (debugMode === true) {
	console.zdebug = console.debug.bind(console, '%cDEBUG:', "color:#A39;font-weight:bold;");
	console.zlog = console.log.bind(console, '%cLOG:', 'color:#090;font-weight:bold;');
	console.zinfo = console.info.bind(console, '%cINFO:', 'color:#33C;font-weight:bold;');
	console.zwarn = console.warn.bind(console, '%cWARN:', 'color:orange;font-weight:bold;');
	console.ztable = console.table.bind(console, '%cTABLE:', 'color:orange;font-weight:bold;');
} else {
	console.zdebug = function () {};
	console.zlog = function () {};
	console.zinfo = function () {};
	console.zwarn = function () {};
	console.ztable = function () {};
}

var timeStart = _.now();

console.timerInfo = function () {};

QUnit.config.autostart = false;
QUnit.config.reorder = true;

QUnit.log(function (details) {
	if (details.result) {
		return;
	}
	var loc = details.module + ": " + details.name + ": ",
		output = "FAILED: " + loc + (details.message ? details.message + ", " : "");

	if (details.actual) {
		output += "expected: " + details.expected + ", actual: " + details.actual;
	}
	if (details.source) {
		output += ", " + details.source;
	}
	console.log(output);
});

jQuery(document).ready(function () {

	return System.import("test/es6/ig_map.js")
		.then(function (InstaMap) {
			console.zlog('loaded InstaMap', {
				InstaMap: InstaMap
			});

			return System.import("test/es6/ig_featurecollection.js");

		}).then(function (FeatureCollection) {
			console.zlog('loaded FeatureCollection', {
				FeatureCollection: FeatureCollection
			});

			return System.import("test/es6/ig_overlay.js");
		}).then(function (InstaOverlay) {

			console.zlog('Loaded InstaOverlay', {
				InstaOverlay: InstaOverlay
			});
			return;

		}).then(function () {

			QUnit.load();
			QUnit.start();

		}).catch(function (e) {
			console.warn('Exception Main test thread');
			console.trace(e);
		});

});
