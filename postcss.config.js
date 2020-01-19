const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')

const isDev = process.env.NODE_ENV === 'development'

let config = {
  plugins: [
    postcssPresetEnv({
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
  ],
}

!isDev &&
  config.plugins.push(
    cssnano({
      preset: 'default',
    })
  )

module.exports = config
