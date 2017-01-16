//     Backbone.js 1.3.3

//     (c) 2010-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org
import $ from 'jquery';
import _ from 'underscore';
import {
  Backbone
} from './backbone_modules/core.js';
import {
  Events
} from './backbone_modules/events.js';
import {
  Model
} from './backbone_modules/model.js';
import {
  Collection
} from './backbone_modules/collection.js';
import {
  View
} from './backbone_modules/view.js';
import {
  Router
} from './backbone_modules/router.js';
import {
  History
} from './backbone_modules/history.js';

// Allow the `Backbone` object to serve as a global event bus, for folks who
// want global "pubsub" in a convenient place.
_.extend(Backbone, Events);

// Helpers
// -------

// Helper function to correctly set up the prototype chain for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var extend = function (protoProps, staticProps) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function () {
      return parent.apply(this, arguments);
    };
  }

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function and add the prototype properties.
  child.prototype = _.create(parent.prototype, protoProps);
  child.prototype.constructor = child;

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};

// Set up inheritance for the model, collection, router, view and history.
Model.extend = Collection.extend = Router.extend = View.extend = History.extend =
  extend;

Backbone.Model = Model;

Backbone.Collection = Collection;

Backbone.View = View;

Backbone.Router = Router;

Backbone.History = History;

// Create the default Backbone.history.
Backbone.history = new History;

export default Backbone;
