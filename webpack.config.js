const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  plugins: [new ESLintPlugin({ fix: true })],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: { version: 3, proposals: true },
                  },
                ],
              ],
            },
          },
        ],
      },
    ],
  },
}
