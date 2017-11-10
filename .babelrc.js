const loose = true;

module.exports = {
  presets: [
    ['@babel/env', { loose, modules: false }],
  ],
  plugins: [
    ['@babel/proposal-class-properties', { loose }],
    '@babel/proposal-object-rest-spread',
  ],
};
