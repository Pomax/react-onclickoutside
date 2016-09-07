module.exports = function(config) {
  config.set({

    files: [
      'test.js'
    ],

    frameworks: ['mocha', 'chai'],

    preprocessors: {
      'test.js': ['webpack', 'babel']
    },

    babelPreprocessor: {
      options: {
        presets: ['es2015'],
        sourceMap: 'inline'
      },
      filename: function (file) {
        return file.originalPath.replace(/\.js$/, '.es5.js');
      },
      sourceFileName: function (file) {
        return file.originalPath;
      }
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
      require('karma-spec-reporter'),
      require('karma-babel-preprocessor')
    ],

    browsers: ['PhantomJS']

  });
};
