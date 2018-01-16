const { BABEL_ENV, NODE_ENV } = process.env;
const modules = BABEL_ENV === 'cjs' || NODE_ENV === 'test' ? 'commonjs' : false;
const loose = true;

module.exports = {
  presets: [
    ['@babel/env', {
    	loose,
    	modules: modules,
    	exclude: ['transform-typeof-symbol'],
    }],
  ],
  plugins: [
    ['@babel/proposal-class-properties', { loose }],
    '@babel/proposal-object-rest-spread',
  ],
};
