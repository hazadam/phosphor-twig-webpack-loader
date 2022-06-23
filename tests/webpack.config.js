const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.twig$/,
        use: ['phosphor-loader'],
      },
    ],
  },
  resolveLoader: {
    alias: {
      'phosphor-loader': path.resolve(__dirname, './../src/phosphor-loader.js'),
    },
  },
};
