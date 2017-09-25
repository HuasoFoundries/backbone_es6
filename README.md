# Backbone ES6

[![Travis CI](https://travis-ci.org/HuasoFoundries/backbone_es6.svg?branch=master)](https://travis-ci.org/HuasoFoundries/backbone_es6)

This repo contains an ES6 version of [Backbone.js]((https://github.com/jashkenas/backbone)) allowing for imports and tree shaking.

This package is made by deconstructing Backbone sources, separating it into modules and reassembling them using [JSPM](https://github.com/jspm/jspm-cli) + [Rollup](https://github.com/rollup/rollup).

### Installation

## Using npm

Install this package with npm with

```sh
npm install --save backbone_es6
```

## Using JSPM

```sh
jspm install npm:backbone_es6
```

### Tree Shaking?

Tree shaking allows you to include just the code you need instead of a whole library. Say, for example, your app needs to use just Backbone's router, you can import just that part, resulting in a smaller build size overall.



### Can I use this as a drop-in replacement of Backbone?

Is your project already using ES6 imports? If it isn't, don't worry. Under the `dist` folder you can find scripts `backbone.js` and `backbone.min.js` that are in UMD format and can be used as a drop-in replacement for goold old vanilla Backbone. These scripts are also used to run the tests. Said tests are the same as the ones in the [official Backbone repo](https://github.com/jashkenas/backbone), to ensure Backbone ES6's compatibility.

## Using it with AMD

If you use AMD, CommonJS or want to load Backbone ES6 with a script tag, make sure you use `dist/backbone.js` or `dist/backbone.min.js`. E.g. AMD usage of our umd version is as follows:

```js
define([
  'dist/backbone.js'
],function(Backbone) {

  ...your code...

});
```

Whereas, using ES6 syntax, you would use

```js
import {Backbone} from 'backbone.es6.js';
```

## Using it with JSPM

If you installed Backbone ES6 with jspm, `backbone` will be mapped automatically to `dist/backbone.es6.js`, AMD usage would be:

```js
define([
  'backbone'
],function(Backbone) {

  Backbone = 'default' in Backbone ? Backbone.default : Backbone;

  ...your code...

});
```



`package.json` already declares `dist/backbone.js` as the `main` script, while `dist/backbone.es6.js` is declared as the `jsnext:main` script.

If you install


### Can I use classes?

Nope. The inner working of Backbone entities and the way they extend is kept as-is. This project is only a POC to do imports and tree shaking. No more, no less.

