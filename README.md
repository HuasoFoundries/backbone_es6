# Backbone ES6

[![Travis CI](https://travis-ci.org/HuasoFoundries/backbone_es6.svg?branch=master)](https://travis-ci.org/HuasoFoundries/backbone_es6)

This repo contains an ES6 version of [Backbone.js]((https://github.com/jashkenas/backbone)) allowing for imports and tree shaking.

This package is made by deconstructing Backbone sources, separating it into modules and reassembling them using JSPM+Rollup.


### Tree Shaking?
Tree shaking allows you to include just the code you need instead of a whole library. Say, for example, your app needs to use just Backbone's router, you can import just that part, resulting in a smaller build size overall.

### Can I use this as a drop in replacement of Backbone
It depends. Is your project already using ES6 imports? If it isn't, don't worry. There is an `umd` compatible build in the `dist` folder that's also used to run the tests. Said tests are the same as the ones in the [official Backbone repo](https://github.com/jashkenas/backbone), to ensure Backbone ES6's compatibility with good old vanilla Backbone.

AMD usage of our umd version is as follows:

```js
define([
  'jquery',
  'underscore',
  'backbone.umd.js'
],function($, _, Backbone) {

  Backbone = 'default' in Backbone ? Backbone.default : Backbone;

  ...your code...


});
```
