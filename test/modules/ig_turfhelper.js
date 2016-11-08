import turfHelpers from 'providers/ig_turfhelper';
'use strict';
//console.debug('turfHelpers', turfHelpers);

//if (turfHelpers.__esModule === true && turfHelpers.default) {		turfHelpers = turfHelpers.default;	}
QUnit.module("turfHelpers Entities");

QUnit.test("Check validity of turfHelpers provider", function (assert) {

	assert.equal(typeof turfHelpers, 'object', 'turfHelpers should be if type object');

});
export default turfHelpers;
