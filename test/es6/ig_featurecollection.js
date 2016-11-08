import gmaps from 'gmaps';
import FeatureCollection from 'ig_featurecollection';
'use strict';

QUnit.module("FeatureCollection Entities");

QUnit.test("Check validity of FeatureCollection provider", function (assert) {

	assert.equal(typeof FeatureCollection, 'function', 'FeatureCollection should be if type function');

	assert.equal(FeatureCollection.constructor, gmaps.MVCObject.constructor, 'FeatureCollection Layer object should extend google.maps.MVCObject');

});
export default FeatureCollection;
