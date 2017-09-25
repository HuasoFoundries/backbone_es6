module.exports = function (grunt) {

	grunt.config('karma', {
		backbone: {
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
					//'dist/backbone2.js',
					//'test/backbone_es6/setup/environment2.js',
					'dist/backbone.js',
					'test/backbone_es6/setup/environment.js',
					'test/backbone_es6/setup/dom-setup.js',
					'jspm_packages/github/jashkenas/backbone*/test/*.js'
				]

			}
		},
		backbone_min: {
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
					'dist/backbone.min.js',
					'test/backbone_es6/setup/environment.js',
					'test/backbone_es6/setup/dom-setup.js',
					'jspm_packages/github/jashkenas/backbone*/test/*.js'
				]

			}
		}

	});

	grunt.loadNpmTasks('grunt-karma');

};
