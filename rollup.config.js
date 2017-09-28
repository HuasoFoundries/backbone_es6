export default {
  input: "./src/backbone.umd.js",
  extend: true,

  output: {
    file: "dist/backbone.js",
    format: "umd",
    exports: 'named',
    name: 'BackboneES6'

  },

  external: ['underscore', 'jquery'],
  globals: {
    jquery: '$',
    underscore: '_'
  }
};
