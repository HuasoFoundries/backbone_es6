import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';

import './backbone_extensions/backbone.localStorage.js';
import './backbone_extensions/backbone.modal.js';
import './backbone_extensions/backbone-forms.js';

export {
	$,
	_,
	Backbone
};
export default {
	$: $,
	_: _,
	Backbone: Backbone
};
