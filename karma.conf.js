module.exports = function (config) {
  var files = [
    'test/vendor/object-assign-polyfill.js',
    'test/vendor/prototype-bind-polyfill.js',
    'test/vendor/jquery.min.js',
    'test/vendor/underscore.js'
  ];

  if (process.env.MINIFIED) {
    files.push('dist/backbone.min.js');
  } else {
    files.push('dist/backbone.js');
  }

  files = files.concat(['test/setup/*.js', 'test/*.js']);

  config.set({
    basePath: '',
    port: 9877,
    colors: true,
    logLevel: 'INFO',
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    frameworks: ['qunit'],
    reporters: ['progress'],

    files: files

  });
};
