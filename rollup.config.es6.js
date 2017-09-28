export default {
  input: "./src/backbone_es6.js",
  extend: true,

  output: {
    file: "dist/backbone.es6.js",
    format: "es"
  },

  external: ['underscore', 'jquery'],
  globals: {
    jquery: '$',
    underscore: '_'
  }
};
