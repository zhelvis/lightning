const stylelint = require('stylelint')
const postCssPresetEnv = require('postcss-preset-env')
const postCssRepotrter = require('postcss-reporter')

const config = {
  plugins: [
    stylelint(),
    postCssRepotrter({ clearReportedMessages: true }),
    postCssPresetEnv({
      stage: 0,
      autoprefixer: { grid: true },
      features: {
        'custom-properties': {
          preserve: false,
        },
        'color-mod-function': {
          unresolved: 'warn',
        },
      },
    }),
    ...(process.env.NODE_ENV === 'production'
      ? [
          require('@fullhuman/postcss-purgecss')({
            content: ['./src/**/*.html'],
          }),
          require('cssnano')({
            preset: 'default',
          }),
        ]
      : []),
  ],
}

module.exports = config
