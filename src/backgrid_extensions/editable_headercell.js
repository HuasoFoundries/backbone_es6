import $ from 'jquery';
import _ from 'underscore';
import {
	Backbone,
	Backgrid
} from 'backgrid';

_.templateSettings = {
	interpolate: /\{\{(.+?)\}\}/g,
	evaluate: /\{\{(.+?)\}\}/g,
	escape: /\{\{-(.+?)\}\}/g
};

var EditableHeaderCell = Backgrid.HeaderCell.extend({

	events: {
		"click .fontello-filter": "toggleFilterDialog",
		"blur label.editable": "renameColumn",
		"keydown label.editable": "renameColumn",
		"click a": "onClick"

	},

	renameColumn: function (e) {
		var _this = this,
			$this = _this.$('label.editable');

		//console.zdebug($this, $this.text().trim(), globalvars.isValidEvent(e));

		// Esc deshace el cambio
		if (e.keyCode === 27) {
			$this.text(_this.column.get('label'));
		} else if (globalvars.isValidEvent(e)) {
			var newLabel = $this.text().trim();
			_this.column.set('label', newLabel);
		}
	},

	toggleFilterDialog: function (e) {
		console.warn(e, 'Unimplemented toggleFilterDialog, it needs to be overridden');
		return null;
	},

	showFilterinput: function (e) {
		var width = Math.max(this.column.get("width"), this.$el.width());
	},

	updateInputFromCriteria: function () {
		var _this = this,
			strCriteria = "";

		if (_this.column.has('filtercriteria')) {
			var filtercriteria = _this.column.get('filtercriteria');

			if (filtercriteria && filtercriteria.objCriteria) {
				strCriteria = (typeof filtercriteria.objCriteria === 'string') ?
					filtercriteria.objCriteria :
					JSON.stringify(filtercriteria.objCriteria);
				_this.showFilterinput();
			}

			this.$el.data('strCriteria', strCriteria);
			_this.$el.addClass('active_filter');
		} else {
			this.$el.data('strCriteria', null);
			_this.$el.removeClass('active_filter');
		}

	},

	render: function () {
		var _this = this;
		this.$el.empty();
		var column = this.column;
		var sortable = Backgrid.callByNeed(column.sortable(), column, this.collection);
		var label;
		if (sortable) {
			label = $("<label>").html(column.get("label"));

			this.$el.append('<span class="sort_container"><a ><b class="sort-caret"></b><i class="fontello-sort"></i></a></span>');

		} else {
			label = document.createTextNode(column.get("label"));
		}

		this.$el.prepend(label);

		if (column.get('editable')) {
			this.$el.find('label').addClass('editable').attr('contenteditable', true);
		}

		if (column.get('filterable')) {

			this.$el.find('.sort_container').prepend('<i class="fontello-filter"></i>');

			_this.listenTo(this.column, 'change:filtercriteria', function () {
				console.zdebug('EditableHeaderCell filtercriteria changed');
				_this.updateInputFromCriteria();

			});
		}

		this.$el.addClass(column.get("name"));
		this.$el.addClass(column.get("direction"));

		this.delegateEvents();
		return this;
	}

});

export {
	EditableHeaderCell
};
export default EditableHeaderCell;
