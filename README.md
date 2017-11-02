# Backbone ES6

[![npm](https://img.shields.io/npm/dm/backbone_es6.svg?style=plastic)](https://www.npmjs.com/package/backbone_es6) [![Travis CI](https://travis-ci.org/HuasoFoundries/backbone_es6.svg?branch=master)](https://travis-ci.org/HuasoFoundries/backbone_es6) [![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/HuasoFoundries/backbone_es6/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/HuasoFoundries/backbone_es6/?branch=master) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/1fd6d39caced49a4bfb9d65439ee491c)](https://www.codacy.com/app/amenadiel/backbone_es6?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=HuasoFoundries/backbone_es6&amp;utm_campaign=Badge_Grade)

This repo contains an ES6 version of [Backbone.js]((https://github.com/jashkenas/backbone)) allowing for imports and **tree shaking**.

This package is made by deconstructing Backbone sources, separating it into modules and reassembling them using [Rollup](https://github.com/rollup/rollup).

## Tree Shaking?

Tree shaking allows you to include just the code you need instead of a whole library. Say, for example, your app needs to use just Backbone's router, you can import just that part, resulting in a smaller build size overall.


## Dependencies

To use this library, your project sould already have

- [jQuery](https://jquery.com/)
- [Underscore](http://underscorejs.org/)

They aren't explicitly listed as dependencies in `package.json` (for npm nor jspm), because you might want to use other drop in replacements for these dependencies
(for example, [lodash@^3](https://www.npmjs.com/package/lodash) instead of Underscore, or jquery.slim.js build instead of jquery.min.js).


## Installation


### Including it with a script tag

Include this package in your HTML file directly with a script tag  using [unpkg](https://unpkg.com/#/) or [jsdelivr](https://www.jsdelivr.com/)

```html
<script src="https://unpkg.com/backbone_es6/dist/backbone.min.js"></script>
```


**or**


```html
<script src="https://cdn.jsdelivr.net/npm/backbone_es6/dist/backbone.min.js"></script>
```



### Using npm

Install this package with npm with

```sh
npm install --save backbone_es6
```

### Using [JSPM](https://github.com/jspm/jspm-cli)

```sh
jspm install npm:backbone_es6
```


## Can I use this as a drop-in replacement of Backbone?

**Yes you can**. Under the `dist` folder you can find scripts `backbone.js` and `backbone.min.js` that are in UMD format and can be used as a drop-in replacement for goold old vanilla Backbone. The minified version is listed as the `main` property in `package.json` so it's what you'll use by default.

These scripts are also used to run the tests. Said tests are the same as the ones in the [official Backbone repo](https://github.com/jashkenas/backbone), to ensure full Backbone ES6's compatibility with its parent framework.


### Using it with AMD

If you use AMD, CommonJS or want to load Backbone ES6 with a script tag, make sure you use `dist/backbone.js` or `dist/backbone.min.js`. E.g. AMD usage of our umd version is as follows:

```js
define([
  './node_modules/backbone_es6/dist/backbone.js'
],function(Backbone) {

  ...your code...

});
```

Whereas, using ES6 syntax, you would use

```js
import {Backbone} from './node_modules/backbone_es6/dist/backbone.es6.js';
```

`package.json` declares `dist/backbone.es6.js` as the `jsnext:main` and `module` script properties.



### Using it with [JSPM](https://github.com/jspm/jspm-cli)

If you installed Backbone ES6 with jspm, `backbone_es6` will be mapped automatically to `dist/backbone.es6.js`. If you're tranpiling (using [plugin-babel](https://github.com/systemjs/plugin-babel)) you can import the module as:


```js
import {Backbone} from 'backbone_es6';
```

or you could use AMD syntax as:


```js
define([
  'backbone_es6'
],function(Backbone) {

  // Please note that you need to check for the "default" export
  Backbone = 'default' in Backbone ? Backbone.default : Backbone;

  ...your code...

});
```


If you are **not using a transpiler** and want to use the AMD build, use:


```js
define([
  'backbone_es6/backbone.min.js'
],function(Backbone) {

  ...your code...

});
```



## Can I use classes?

Nope. The inner working of Backbone entities and the way they extend is kept as-is. This project is only a POC to do imports and tree shaking. No more, no less.


## Documentation

As this library is meant to be a full drop-in replacement of Backbone.js, the same [docs](http://backbonejs.org/) apply.

