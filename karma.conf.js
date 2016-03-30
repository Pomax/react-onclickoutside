module.exports = function(config) {
  config.set({

    files: [
      'test.js'
    ],

    frameworks: ['mocha', 'chai'],

    preprocessors: {
      'test.js': ['webpack']
    },

    reporters: ['spec'],

    webpackMiddleware: {
      noInfo: true
    },

    plugins: [
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-phantomjs-launcher'),
      require('karma-spec-reporter')
    ],

    browsers: ['PhantomJS']

  });
};
