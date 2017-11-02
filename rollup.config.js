import uglify from 'rollup-plugin-uglify';

var input = "./src/backbone.umd.js",
  plugins = [],
  output = {
    file: "dist/backbone.js",
    format: "umd",
    exports: 'named',
    name: 'BackboneES6'
  };

if (process.env.MINIFY) {
  plugins.push(uglify({
    mangle: false
  }));
  output = {
    file: "dist/backbone.min.js",
    format: "umd",
    exports: 'named',
    name: 'BackboneES6',
    sourcemap: true

  };
} else if (process.env.ES6) {
  input = "./src/backbone_es6.js";
  output = {
    file: "dist/backbone.es6.js",
    format: "es"
  };
}

export default {
  input: input,
  plugins: plugins,
  output: output,
  extend: true,
  external: ['underscore', 'jquery'],
  globals: {
    jquery: '$',
    underscore: '_'
  }
};
