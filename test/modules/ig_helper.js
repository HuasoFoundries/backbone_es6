import * as IGProviders from 'providers/ig_helper';
'use strict';

QUnit.module("IGProviders Entities");

QUnit.test("Check validity of IGProviders provider", function (assert) {

	assert.equal(typeof IGProviders, 'object', 'IGProviders should be if type object');

});
export default IGProviders;
