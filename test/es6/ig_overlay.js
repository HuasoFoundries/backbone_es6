import gmaps from 'gmaps';
import InstaOverlay from 'ig_overlay';
'use strict';

QUnit.module("InstaOverlay Entities");

QUnit.test("Check validity of InstaOverlay provider", function (assert) {

	assert.equal(typeof InstaOverlay, 'object', 'InstaOverlay should be if type function');

	assert.equal(gmaps.BaseOverlay.constructor, gmaps.OverlayView.constructor, 'InstaOverlay should extend google.maps.OverlayView');
	assert.equal(gmaps.Heatmap.constructor, gmaps.BaseOverlay.constructor, 'gmaps.Heatmap should extend InstaOverlay');
	assert.equal(gmaps.MarkerClusterer.constructor, gmaps.BaseOverlay.constructor, 'gmaps.MarkerClusterer should extend InstaOverlay');
	assert.equal(gmaps.MarkerGrid.constructor, gmaps.BaseOverlay.constructor, 'gmaps.MarkerGrid should extend InstaOverlay');
	assert.equal(gmaps.MarkerSelector.constructor, gmaps.BaseOverlay.constructor, 'gmaps.MarkerSelector should extend InstaOverlay');
	assert.equal(gmaps.ShapeArray.constructor, gmaps.BaseOverlay.constructor, 'gmaps.ShapeArray should extend InstaOverlay');

});

QUnit.module("InstaOverlay Factories");

QUnit.test("InstaOverlay factories should be able to produce ShapeArray", function (assert) {
	var done = assert.async();
	expect(1);
	InstaOverlay.ShapeArray(window.globalmap, {
		visualization: 'shape',
		property: 'count',
		gradientid: '0'
	}).then(function (myShapeArray) {
		assert.ok(myShapeArray instanceof gmaps.BaseOverlay, 'instanced myShapeArray should be instance of gmaps.BaseOverlay');
		return done();
	});
});

QUnit.test("InstaOverlay factories should be able to produce MarkerGrid", function (assert) {
	var done = assert.async();
	expect(1);
	InstaOverlay.MarkerGrid(window.globalmap, {
		visualization: 'grid',
		property: 'count',
		gradientid: '0'
	}).then(function (myMarkerGrid) {
		assert.ok(myMarkerGrid instanceof gmaps.BaseOverlay, 'instanced myMarkerGrid should be instance of gmaps.BaseOverlay');
		return done();
	});
});

QUnit.test("InstaOverlay factories should be able to produce Heatmap", function (assert) {
	var done = assert.async();
	expect(1);
	InstaOverlay.Heatmap(window.globalmap, {
		visualization: 'heatmap',
		active: false
	}).then(function (myHeatmap) {
		assert.ok(myHeatmap instanceof gmaps.BaseOverlay, 'instanced myHeatmap should be instance of gmaps.BaseOverlay');
		return done();
	});
});

QUnit.test("InstaOverlay factories should be able to produce MarkerSelector", function (assert) {
	var done = assert.async();
	expect(1);
	InstaOverlay.MarkerSelector(window.globalmap, {
		visualization: 'marker',
		active: false
	}).then(function (myMarkerSelector) {
		assert.ok(myMarkerSelector instanceof gmaps.BaseOverlay, 'instanced myMarkerSelector should be instance of gmaps.BaseOverlay');
		return done();
	});
});

QUnit.test("InstaOverlay factories should be able to produce DotLayer", function (assert) {
	var done = assert.async();
	expect(1);
	InstaOverlay.DotLayer(window.globalmap, {
		visualization: 'dot',
		active: false
	}).then(function (myDotLayer) {
		assert.ok(myDotLayer instanceof gmaps.BaseOverlay, 'instanced myDotLayer should be instance of gmaps.BaseOverlay');
		return done();
	});
});

QUnit.test("InstaOverlay factories should be able to produce MarkerGrid", function (assert) {
	var done = assert.async();
	expect(1);
	InstaOverlay.MarkerGrid(window.globalmap, {
		visualization: 'cluster',
		active: false,
		maxZoom: 17
	}).then(function (myMarkerClusterer) {
		assert.ok(myMarkerClusterer instanceof gmaps.BaseOverlay, 'instanced myMarkerClusterer should be instance of gmaps.BaseOverlay');
		return done();
	});
});

QUnit.test("InstaOverlay factories should be able to produce ImageCanvas", function (assert) {
	var done = assert.async();
	expect(1);
	InstaOverlay.ImageCanvas(window.globalmap, {})
		.then(function (myImageCanvas) {
			assert.ok(myImageCanvas instanceof gmaps.OverlayView, 'instanced myImageCanvas should be instance of gmaps.OverlayView');
			return done();
		});
});
export {
	InstaOverlay
};
export default InstaOverlay;
