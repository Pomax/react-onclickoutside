import babel from 'rollup-plugin-babel';
import { list as babelHelpersList } from 'babel-helpers';
import uglify from 'rollup-plugin-uglify';

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM'
};

const external = ['react', 'react-dom'];

const babelOptions = {
  exclude: 'node_modules/**',
  plugins: ['external-helpers'],
  externalHelpersWhitelist: babelHelpersList.filter(helperName => helperName !== 'asyncGenerator')
};

const config = [
  {
    input: 'src/index.js',
    output: {
      name: 'onClickOutside',
      file: 'dist/react-onclickoutside.js',
      format: 'umd',
      exports: 'named'
    },
    external: external,
    globals: globals,
    plugins: [
      babel(babelOptions)
    ]
  },
  {
    input: 'src/index.js',
    output: {
      name: 'onClickOutside',
      file: 'dist/react-onclickoutside.min.js',
      format: 'umd',
      exports: 'named'
    },
    external: external,
    globals: globals,
    plugins: [
      babel(babelOptions), uglify()
    ]
  },

];

export default config;
