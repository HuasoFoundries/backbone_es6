//     Backbone.js 1.3.3

//     (c) 2010-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org
import $ from 'jquery';
import _ from 'underscore';




// Establish the root object, `window` (`self`) in the browser, or `global` on the server.
// We use `self` instead of `window` for `WebWorker` support.
var root = (typeof self == 'object' && self.self === self && self) ||
  (typeof global == 'object' && global.global === global && global);

// Initial Setup
// -------------
var previousBackbone = root.Backbone;

// Create a local reference to a common array method we'll want to use later.
var slice = Array.prototype.slice;

// Current version of the library. Keep in sync with `package.json`.
var Backbone = {
  VERSION: '1.3.3-es6'
};

// For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
// the `$` variable.
Backbone.$ = $;

// Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
// to its previous owner. Returns a reference to this Backbone object.
Backbone.noConflict = function () {
  root.Backbone = previousBackbone;
  return this;
};



// Proxy Backbone class methods to Underscore functions, wrapping the model's
// `attributes` object or collection's `models` array behind the scenes.
//
// collection.filter(function(model) { return model.get('age') > 10 });
// collection.each(this.addView);
//
// `Function#apply` can be slow so we use the method's arg count, if we know it.
var addMethod = function (length, method, attribute) {
  switch (length) {
  case 1:
    return function () {
      return _[method](this[attribute]);
    };
  case 2:
    return function (value) {
      return _[method](this[attribute], value);
    };
  case 3:
    return function (iteratee, context) {
      return _[method](this[attribute], cb(iteratee, this),
        context);
    };
  case 4:
    return function (iteratee, defaultVal, context) {
      return _[method](this[attribute], cb(iteratee, this),
        defaultVal, context);
    };
  default:
    return function () {
      var args = slice.call(arguments);
      args.unshift(this[attribute]);
      return _[method].apply(_, args);
    };
  }
};
var addUnderscoreMethods = function (Class, methods, attribute) {
  _.each(methods, function (length, method) {
    if (_[method]) Class.prototype[method] = addMethod(
      length,
      method, attribute);
  });
};

// Support `collection.sortBy('attr')` and `collection.findWhere({id: 1})`.
var cb = function (iteratee, instance) {
  if (_.isFunction(iteratee)) return iteratee;
  if (_.isObject(iteratee) && !instance._isModel(iteratee)) return modelMatcher(
    iteratee);
  if (_.isString(iteratee)) return function (model) {
    return model.get(iteratee);
  };
  return iteratee;
};
var modelMatcher = function (attrs) {
  var matcher = _.matches(attrs);
  return function (model) {
    return matcher(model.attributes);
  };
};

// Throw an error when a URL is needed, and none is supplied.
var urlError = function () {
  throw new Error('A "url" property or function must be specified');
};

// Wrap an optional error callback with a fallback error event.
var wrapError = function (model, options) {
  var error = options.error;
  options.error = function (resp) {
    if (error) error.call(options.context, model, resp, options);
    model.trigger('error', model, resp, options);
  };
};

// Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
// will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
// set a `X-Http-Method-Override` header.
Backbone.emulateHTTP = false;

// Turn on `emulateJSON` to support legacy servers that can't deal with direct
// `application/json` requests ... this will encode the body as
// `application/x-www-form-urlencoded` instead and will send the model in a
// form param named `model`.
Backbone.emulateJSON = false;


// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
var methodMap = {
  'create': 'POST',
  'update': 'PUT',
  'patch': 'PATCH',
  'delete': 'DELETE',
  'read': 'GET'
};
// Backbone.sync
// -------------

// Override this function to change the manner in which Backbone persists
// models to the server. You will be passed the type of request, and the
// model in question. By default, makes a RESTful Ajax request
// to the model's `url()`. Some possible customizations could be:
//
// * Use `setTimeout` to batch rapid-fire updates into a single request.
// * Send up the models as XML instead of JSON.
// * Persist models via WebSockets instead of Ajax.
//
// Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
// as `POST`, with a `_method` parameter containing the true HTTP method,
// as well as all requests with the body as `application/x-www-form-urlencoded`
// instead of `application/json` with the model in a param named `model`.
// Useful when interfacing with server-side languages like **PHP** that make
// it difficult to read the body of `PUT` requests.
Backbone.sync =  function (method, model, options) {
  var type = methodMap[method];

  // Default options, unless specified.
  _.defaults(options || (options = {}), {
    emulateHTTP: Backbone.emulateHTTP,
    emulateJSON: Backbone.emulateJSON
  });

  // Default JSON-request options.
  var params = {
    type: type,
    dataType: 'json'
  };

  // Ensure that we have a URL.
  if (!options.url) {
    params.url = _.result(model, 'url') || urlError();
  }

  // Ensure that we have the appropriate request data.
  if (options.data == null && model && (method === 'create' || method ===
      'update' || method === 'patch')) {
    params.contentType = 'application/json';
    params.data = JSON.stringify(options.attrs || model.toJSON(
      options));
  }

  // For older servers, emulate JSON by encoding the request into an HTML-form.
  if (options.emulateJSON) {
    params.contentType = 'application/x-www-form-urlencoded';
    params.data = params.data ? {
      model: params.data
    } : {};
  }

  // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
  // And an `X-HTTP-Method-Override` header.
  if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' ||
      type ===
      'PATCH')) {
    params.type = 'POST';
    if (options.emulateJSON) params.data._method = type;
    var beforeSend = options.beforeSend;
    options.beforeSend = function (xhr) {
      xhr.setRequestHeader('X-HTTP-Method-Override', type);
      if (beforeSend) return beforeSend.apply(this, arguments);
    };
  }

  // Don't process data on a non-GET request.
  if (params.type !== 'GET' && !options.emulateJSON) {
    params.processData = false;
  }

  // Pass along `textStatus` and `errorThrown` from jQuery.
  var error = options.error;
  options.error = function (xhr, textStatus, errorThrown) {
    options.textStatus = textStatus;
    options.errorThrown = errorThrown;
    if (error) error.call(options.context, xhr, textStatus,
      errorThrown);
  };

  // Make the request, allowing the user to override any Ajax options.
  var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
  model.trigger('request', model, xhr, options);
  return xhr;
};


// Set the default implementation of `Backbone.ajax` to proxy through to `$`.
// Override this if you'd like to use a different library.
Backbone.ajax = function () {
  return Backbone.$.ajax.apply(Backbone.$, arguments);
};



export {urlError,wrapError,addUnderscoreMethods,Backbone};
