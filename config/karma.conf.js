var webpackConfig = require('./webpack.test');

module.exports = function (config) {
  var _config = {
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      {pattern: './config/karma-test-shim.js', watched: false}
    ],

    preprocessors: {
      './config/karma-test-shim.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    // Coverage reporter configuration
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {type: 'text-summary'},
        {type: 'html', subdir: 'html'}
      ]
    },

    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome'],
    singleRun: true,
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  };

  if (process.env.TRAVIS) {
    _config.browsers = ['Chrome_travis_ci'];
    _config.coverageReporter.reporters.push({type: 'lcov', subdir: './'});
    _config.reporters.push('coveralls');
  }

  config.set(_config);
};
