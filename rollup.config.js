import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

var config = {
  format: 'umd',
  moduleName: 'onClickOutside',
  exports: 'named',
  external: ['react', 'react-dom'],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM'
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
