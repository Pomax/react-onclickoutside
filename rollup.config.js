import babel from 'rollup-plugin-babel';
import { list as babelHelpersList } from 'babel-helpers';
import uglify from 'rollup-plugin-uglify';

var config = {
  output: {
    format: 'umd',
    name: 'onClickOutside',
    exports: 'named',
  },
  external: ['react', 'react-dom'],
  globals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers'],
      externalHelpersWhitelist: babelHelpersList.filter(helperName => helperName !== 'asyncGenerator'),
    }),
  ],
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    })
  );
}

export default config;
