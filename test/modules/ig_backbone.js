import {
	Backbone
} from 'providers/ig_backbone';
import {
	Backgrid
} from 'providers/ig_backbone/ig_backgrid.js';
'use strict';

QUnit.module("Backbone Entities");

QUnit.test("Check validity of Backbone provider", function (assert) {

	assert.equal(typeof Backbone, 'object', 'Backbone should be if type object');

	assert.equal(typeof Backbone.Model, 'function', 'Backbone.Model should be if type function');
	assert.equal(typeof Backbone.View, 'function', 'Backbone.View should be if type function');
	assert.equal(typeof Backbone.Collection, 'function', 'Backbone.Collection should be if type function');

});

QUnit.module("Backgrid Entities");

QUnit.test("Check validity of Backgrid provider", function (assert) {

	assert.equal(typeof Backgrid, 'object', 'Backbone.Backgrid should be if type object');
	assert.equal(typeof Backgrid.Column, 'function', 'Backbone.Backgrid.Column should be if type function');
	assert.equal(typeof Backgrid.Columns, 'function', 'Backbone.Backgrid.Columns should be if type function');
	assert.equal(typeof Backgrid.Body, 'function', 'Backbone.Backgrid.Body should be if type function');

});

export default Backbone;
