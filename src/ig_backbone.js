import Backbone from 'backbone';

import './backbone_extensions/backbone.localStorage.js';
import './backbone_extensions/backbone.modal.js';
import './backbone_extensions/backbone-forms.js';
import {
	PageableCollection
} from './backbone_extensions/backbone.paginator.js';

Backbone.PageableCollection = PageableCollection;
export {
	Backbone
};
export default Backbone;
