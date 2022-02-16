/* eslint-disable-next-line */
const webpack = require('webpack');

module.exports = {
  webpack: {
    plugins: [
      // Work around for Buffer is undefined:
      // https://github.com/webpack/changelog-v5/issues/10
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
    ],
    configure: {
      resolve: {
        fallback: {
          stream: require.resolve('stream-browserify'),
          assert: require.resolve('assert-browserify'),
          util: require.resolve('util'),
          http: require.resolve('http-browserify'),
          https: require.resolve('https-browserify'),
          os: require.resolve('os-browserify'),
          buffer: require.resolve('buffer'),
          url: require.resolve('url'),
        },
      },
    },
  },
};
