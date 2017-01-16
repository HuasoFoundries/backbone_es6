# Backbone ES6

[![Travis CI](https://travis-ci.org/HuasoFoundries/backbone_es6.svg?branch=master)](https://travis-ci.org/HuasoFoundries/backbone_es6)

This repo contains an ES6 version of Backbone.js, allowing to perform tree shaking and decrease bundle sizes when you only use, say, the router of Backbone, and don't want to include the rest of it in your build.

There is an `umd` compatible build in the `dist` folder that's also used to run the tests. Said tests are the same as the ones in the [https://github.com/jashkenas/backbone](official Backbone repo), to ensure Backbone ES6's compatibility with good old vanilla Backbone.
