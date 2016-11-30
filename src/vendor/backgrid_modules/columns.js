import Backbone from 'backbone';

import {
	Backgrid
} from './core.js';

import {
	Column
} from './column.js';
/**
   A Backbone collection of Column instances.

   @class Backgrid.Columns
   @extends Backbone.Collection
 */
var Columns = Backbone.PageableCollection.extend({

	/**
	   @property {Backgrid.Column} model
	 */
	model: Column
});
export {
	Columns
};
