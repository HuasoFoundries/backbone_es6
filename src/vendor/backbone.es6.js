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

/**
 * Will execute a function on matching child elements, or set a MutationObserver to detect if they are appended afterwards
 * @param  {function} onFound   function to execute on matching elements once they exist
 * @param  {String} [querySelector] optional CSS type selector to filter which elements should receive the onFound function
 * @param  {Boolean}  [once] optional flag to execute the onFound function only on the first matching child
 * @return {object} the element, as to keep the return chainable
 */
$.fn.waitforChild = function (onFound, querySelector, once) {
  // allows for an object single parameter
  if (typeof arguments[0] === 'object') {
    once = arguments[0].once || false;
    querySelector = arguments[0].querySelector || null;
    onFound = arguments[0].onFound;
  }

  if (!onFound) {
    onFound = function () {};
  }

  var $this = this;

  // If no querySelector was asked, and the element has children, apply the onFound function either to the first or to all of them
  if (!querySelector && $this.children().length) {

    if (once) {
      onFound($this.children().first());

    } else {
      $this.children().each(function (key, element) {
        onFound($(element));
      });
    }

    // If the element already has matching children, apply the onFound function either to the first or to all of them
  } else if ($this.find(querySelector).length !== 0) {
    if (once) {
      onFound($this.find(querySelector).first());

    } else {
      $this.find(querySelector).each(function (key, element) {
        onFound($(element));
      });
    }
  } else {
    if ($this.length === 0) {
      console.warn("Can't attach an observer to a null node", $this);
    } else {
      // Otherwise, set a new MutationObserver and inspect each new inserted child from now on.
      var observer = new MutationObserver(function (mutations) {
        var _this = this;
        mutations.forEach(function (mutation) {
          if (mutation.addedNodes) {
            if (!querySelector) {
              onFound($(mutation.addedNodes[0]));
              if (once) {
                _this.disconnect();
              }
            } else {
              for (var i = 0; i < mutation.addedNodes.length; ++i) {
                var addedNode = mutation.addedNodes[i];
                if ($(addedNode).is(querySelector)) {
                  onFound($(addedNode));
                  if (once) {
                    _this.disconnect();
                    break;
                  }
                }
              }
            }
          }
        });
      });

      observer.observe($this[0], {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
      });
    }

  }

  return $this;
};

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
