import InstaMap from 'ig_map';
'use strict';

QUnit.module("InstaMap Entities");

QUnit.test("Check validity of InstaMap provider", function (assert) {

	window.globalmap = new InstaMap(document.getElementById('map'), {
		zoom: 8,
		center: {
			lat: 41,
			lng: -73
		}
	});

	assert.equal(typeof InstaMap, 'function', 'InstaMap should be if type function');

	assert.ok(window.globalmap instanceof InstaMap, 'globalmap  should be instance of InstaMap');

});
export default InstaMap;
