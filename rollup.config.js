import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

var config = {
  format: 'umd',
  moduleName: 'onClickOutside',
  exports: 'named',
  external: ['react'],
  globals: {
    react: 'React'
  },
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    babel({
      exclude: 'node_modules/**',
    })
  ]
};

export default config;
