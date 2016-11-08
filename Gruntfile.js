module.exports = function (grunt) {

	grunt.config('karma', {
		options: {
			basePath: './',
			frameworks: ['qunit', 'jasmine'],

			reporters: ['progress'],

			port: 9877,
			colors: true,
			logLevel: 'INFO',
			autoWatch: false,
			browsers: ['PhantomJS'],
			singleRun: true

		},
		ig_backbone: {
			options: {
				frameworks: ['qunit'],
				// list of files / patterns to load in the browser
				files: [
					'test/vendor/object-assign-polyfill.js',
					'test/vendor/prototype-bind-polyfill.js',
					'test/vendor/bluebird.js',
					'dist/ig_backbone.bundle.js',
					'test/ig_backbone/setup/*.js',
					'test/ig_backbone/*.js'
				]

			}
		},

		ig_backgrid: {

			// base path that will be used to resolve all patterns (eg. files, exclude)
			options: {

				// frameworks to use
				// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
				frameworks: ['jasmine'],

				// list of files / patterns to load in the browser
				files: [
					'test/vendor/object-assign-polyfill.js',
					'test/vendor/prototype-bind-polyfill.js',
					'test/vendor/jquery.js',
					'test/vendor/underscore.js',
					'dist/ig_backgrid.bundle.js',
					'test/ig_backgrid/setup/environment.js',
					'test/ig_backgrid/*.js'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-karma');

};
