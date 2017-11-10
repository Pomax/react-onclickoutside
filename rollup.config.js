import babel from 'rollup-plugin-babel';

var config = {
  output: {
    format: process.env.BABEL_ENV,
    exports: 'named',
  },
  external: ['react', 'react-dom'],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};

export default config;
