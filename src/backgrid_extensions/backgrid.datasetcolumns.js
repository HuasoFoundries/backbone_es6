import $ from 'jquery';
import _ from 'underscore';
import {
	Backbone,
	Backgrid
} from 'backgrid';

import EditableHeaderCell from './editable_headercell.js';
import GeocodableEditor from './geocodable_editor.js';

import './backgrid-sizeable-columns.js';
import './backgrid-paginator.js';

_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g,
	evaluate: /\{\{(.+?)\}\}/g,
	escape: /\{\{-(.+?)\}\}/g
};

Backgrid.Extension.ResizableColumns = Backgrid.Extension.SizeAbleColumns.extend({
	className: 'resizablecols'
});

/**
 * [render description]
 * @param  {[type]} ) {		this.$el.html(this.template(this.model.attributes));		this.delegateEvents();		return this;	}} [description]
 * @return {[type]}   [description]
 */
Backgrid.DeleteCell = Backgrid.Cell.extend({
	template: _.template(
		'<a class="removerow" data-row="{{id}}"><i class="fontello-trash" id="removerow{{id}}" data-row="{{id}}"></i></a>&nbsp;{{id}}'),

	render: function () {
		this.$el.html(this.template(this.model.attributes));
		this.delegateEvents();
		return this;
	}
});

/**
 * [initialize description]
 * @param  {[type]} ) {		Backgrid.StringCell.prototype.initialize.apply(this, arguments);	}} [description]
 * @return {[type]}   [description]
 */
var GeocodableCell = Backgrid.StringCell.extend({
	_class: 'Backgrid.GeocodableCell',
	className: "geocodable-cell",
	formatter: Backgrid.StringFormatter,
	editor: GeocodableEditor,
	initialize: function () {

		Backgrid.StringCell.prototype.initialize.apply(this, arguments);
	}
});
Backgrid.GeocodableCell = GeocodableCell;

/**
 * [constructor description]
 * @param  {[type]} ) {		var       _this [description]
 * @return {[type]}   [description]
 */
var DatasetColumn = Backgrid.Column.extend({
	_class: 'Backgrid.DatasetColumn',

	constructor: function () {
		var _this = this;
		//console.zdebug('Constructor DatasetColumn');
		this.on('backgrid:edited', function () {
			console.zdebug('backgrid:edit DatasetColumn');
		});

		this.on('change:filtercriteria', function () {
			console.zdebug('DatasetColumn filtercriteria changed', _this.get('filtercriteria'));
		});

		this.on('change:label', function () {
			var changedAttrs = _this.changedAttributes();
			console.zdebug('Label Changed', _this.get('label'), changedAttrs);
			if (changedAttrs.label && _this.has('label') && _this.has('model')) {
				_this.get('model').set('alias', _this.get('label')).save();
			}
		});

		Backgrid.Column.apply(this, arguments);
	},

	parseCriteria: function (strCriteria) {
		var _this = this;

		var objCriteria, val_operador, val_condition;
		try {
			objCriteria = JSON.parse(strCriteria);
			val_operador = _.keys(objCriteria)[0];
			val_condition = _.values(objCriteria)[0];
		} catch (e) {
			objCriteria = strCriteria;
			val_operador = "";
			val_condition = strCriteria;
		}

		var filtercriteria = {
			val_campo: _this.get('nombre_fisico'),
			val_operador: val_operador,
			val_condition: val_condition,
			objCriteria: objCriteria
		};

		console.zdebug(this.get('name'), filtercriteria, objCriteria);

		_this.set('filtercriteria', filtercriteria);
		return filtercriteria;
	}
});

Backgrid.DatasetColumn = DatasetColumn;

/**
 * [constructor description]
 * @param  {[type]} models   [description]
 * @param  {Array}  options) {		if        (options.tableModel) {			var theModels [description]
 * @return {[type]}          [description]
 */
var DatasetColumns = Backgrid.Columns.extend({
	_class: 'Backgrid.DatasetColumns',
	model: Backgrid.DatasetColumn,

	constructor: function (models, options) {

		if (options.tableModel) {

			var theModels = [{
				name: "id_instagis",
				label: "ID",
				editable: false,
				cell: Backgrid.DeleteCell,
				resizeable: true,
				minWidth: 60,
				width: 80,
				maxWidth: 100,
				nombre_fisico: "id_instagis"

			}].concat(

				options.tableModel.columns.map(function (columna) {
					var columnObj = {
						id: columna.get('id'),
						name: columna.get('nombre_fisico'),
						label: columna.get('alias').replace(/_/g, ' '),
						cell: "string",
						resizeable: true,
						editable: true,
						headerCell: EditableHeaderCell,
						minWidth: 110,
						width: 160,
						maxWidth: 250,
						model: columna,
						filterable: true,
						nombre_fisico: columna.get('nombre_fisico')
					};
					if ((columnObj.name === 'direccion' || columnObj.name === 'address')) {
						_.extend(columnObj, {
							width: 300,
							minWidth: 240,
							maxWidth: 500,
							cell: Backgrid.GeocodableCell
						});
					} else if ((columnObj.name === 'description' || columnObj.name === 'descripcion')) {
						_.extend(columnObj, {
							width: 400,
							minWidth: 240,
							maxWidth: 600
						});
					}

					return columnObj;
				})

			).concat([{
					name: "lat_google",
					label: "latitude",
					editable: false,
					resizeable: true,
					cell: Backgrid.NumberCell.extend({
						decimals: 6
					}),
					minWidth: 80,
					width: 80,
					maxWidth: 100,
					nombre_fisico: "lat_google"

				}, {
					name: "lon_google",
					label: "longitude",
					editable: false,
					resizeable: true,
					cell: Backgrid.NumberCell.extend({
						decimals: 6
					}),
					minWidth: 80,
					width: 80,
					maxWidth: 100,
					nombre_fisico: "lon_google"

				}, {
					name: "geo_status",
					label: "geo_status",
					editable: false,
					cell: Backgrid.StringCell,
					headerCell: EditableHeaderCell,
					minWidth: 110,
					width: 120,
					maxWidth: 120,
					filterable: true,
					resizeable: true,
					nombre_fisico: "geo_status"

				}, {
					name: "geo_result",
					label: "geo_result",
					editable: false,
					resizeable: true,
					cell: Backgrid.IntegerCell,

					minWidth: 100,
					width: 100,
					maxWidth: 100,
					nombre_fisico: "geo_result"

				}

			]);

			Backgrid.Columns.apply(this, [theModels]);
		}

	}
});

Backgrid.EditableHeaderCell = EditableHeaderCell;
Backgrid.DatasetColumns = DatasetColumns;
Backgrid.GeocodableEditor = GeocodableEditor;

export {
	EditableHeaderCell,
	GeocodableCell,
	DatasetColumn,
	DatasetColumns,
	GeocodableEditor
};
