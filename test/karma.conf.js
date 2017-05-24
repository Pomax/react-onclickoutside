module.exports = function(config) {
  config.set({
    files: ['test.js'],

    frameworks: ['mocha', 'chai'],

    preprocessors: {
      'test.js': ['webpack'],
    },

    reporters: ['spec'],

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          {
            test: /.js$/,
            loader: 'babel',
            query: {
              presets: [['es2015', { loose: true }]],
              plugins: ['transform-class-properties'],
            },
          },
        ],
      },
    },

    webpackMiddleware: {
      noInfo: true,
      stats: { errorDetails: true },
    },

    plugins: [
      require('karma-webpack'),
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-phantomjs-launcher'),
      require('karma-spec-reporter'),
    ],

    browsers: ['PhantomJS'],
  });
};
