module.exports = function (grunt) {

	grunt.config('karma', {
		backbone_es6: {
			options: {
				basePath: './',
				frameworks: ['qunit'],

				reporters: ['progress'],

				port: 9877,
				colors: true,
				logLevel: 'INFO',
				autoWatch: false,
				browsers: ['PhantomJS'],
				singleRun: true,
				// list of files / patterns to load in the browser
				files: [
					'test/vendor/object-assign-polyfill.js',
					'test/vendor/prototype-bind-polyfill.js',
					'test/vendor/bluebird.js',
					'test/vendor/jquery.min.js',
					'test/vendor/underscore.js',
					'dist/backbone.umd.js',
					'test/backbone_es6/setup/*.js',
					'jspm_packages/github/jashkenas/backbone*/test/*.js'
				]

			}
		}

	});

	grunt.loadNpmTasks('grunt-karma');

};
