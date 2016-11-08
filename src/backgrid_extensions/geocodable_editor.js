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

Backgrid.InputCellEditor.prototype._class = 'Backgrid.InputCellEditor';

Backgrid.InputCellEditor.prototype.events = {
	"blur": "blurEvent",
	"keydown": "interceptEvent",
	"click": "interceptEvent"
};

Backgrid.InputCellEditor.prototype.initialize = function (options) {
	var _this = this;
	Backgrid.InputCellEditor.__super__.initialize.apply(this, arguments);

	if (options.placeholder) {
		this.$el.attr("placeholder", options.placeholder);
	}

	//console.zdebug('CellEditor initialize', this.model);

	_.delay(function () {
		//console.zdebug('Cleaning Cell Editor');
		_this.$el.closest('td').removeClass('selected');
	}, 500);
};

Backgrid.InputCellEditor.prototype.enableField = function () {
	//console.zdebug('Backgrid.InputCellEditor enableField');
	this.readonly = false;
	return this;
};

Backgrid.InputCellEditor.prototype.blurEvent = function (e) {
	//console.zdebug('Backgrid.InputCellEditor blurEvent');
	this.saveOrCancel(e);
	return this;
};

Backgrid.InputCellEditor.prototype.alterEvent = function (e) {

	if (this.readonly === undefined) {
		if (e.type === "click" || e.type === "blur") {
			this.enableField();
		} else if (e.type === "keydown") {
			switch (e.keyCode) {
			case 13:
				this.enableField();
				break;

			case 39:
				e.keyCode = 9;
				e.shiftKey = false;
				break;

			case 37:
				e.keyCode = 9;
				e.shiftKey = true;
				break;

			case 9:
			case 40:
			case 38:

				// flecha arriba y flecha abajo, no altero el evento
				break;

			default:
				this.enableField();
				break;
			}
		}
	}

	return e;
};

Backgrid.InputCellEditor.prototype.interceptEvent = function (e) {
	var evt;
	if (this.readonly === undefined) {
		evt = this.alterEvent(e);
	} else {
		evt = e;
	}

	this.saveOrCancel(evt);
};

var GeocodableEditor = Backgrid.InputCellEditor.extend({
	_class: 'GeocodableEditor',
	id: 'addressEditor',

	place_found: null,

	enableField: function () {
		var _this = this;

		if (window.google.maps) {
			var gmaps = window.google.maps;
		} else {
			console.warn('GeocodableEditor cannot run without google maps in the window scope');
			return false;
		}
		this.readonly = false;

		this.model.trigger('mute', true);

		this.place_found = false;
		var input = _this.$el[0];
		var autocompleteOptions = {};
		var country = null;
		if (this.model.has('country')) {
			country = this.model.get('country');

		} else if (this.model.has('pais')) {
			country = this.model.get('pais');

		}

		if (country !== null) {
			autocompleteOptions.componentRestrictions = {
				country: country
			};
		}

		var autocomplete = new gmaps.places.Autocomplete(input, autocompleteOptions);
		input.placeholder = 'Find an address';

		gmaps.event.addListener(autocomplete, 'place_changed', function () {
			_this.place_found = true;
			var place = autocomplete.getPlace();
			var address = {};
			_.each(place.address_components, function (component) {
				address[component.types[0]] = component.short_name;
			});
			console.info('Place CHANGED', {
				address: address,
				place: place
			});

			if (place.geometry) {
				_this.model.save({
					geocodingAddress: place.place_id,
					latGoogle: place.geometry.location.lat(),
					lonGoogle: place.geometry.location.lng(),
					geoStatus: 'OK',
					geoResult: 1,
					pais: address.country,
					region: address.administrative_area_level_1,
					ciudad: address.administrative_area_level_2,
					comuna: (address.locality || address.administrative_area_level_3),
					country: address.country,
					state: address.administrative_area_level_1,
					county: address.administrative_area_level_2,
					city: address.administrative_area_level_3

				});

			}

			return;
		});

		return this;
	},

	interceptEvent: function (e) {
		var _this = this,
			evt;

		if (this.readonly === undefined) {
			evt = this.alterEvent(e);
			this.saveOrCancel(evt);
			//console.zdebug('GeocodableEditor interceptEvent', evt, this.readonly);
		} else if (globalvars.isValidEvent(e, true)) {
			this.saveOrCancel(e);
			_.delay(function () {
				if (_this.place_found === false) {
					_this.model.save();
				}
				_this.model.trigger('mute', false);
			}, 1000);
		}

	}

});

export {
	GeocodableEditor
};

export default GeocodableEditor;
