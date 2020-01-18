const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')

const dev = process.env.NODE_ENV === 'development'

const config = {
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

!dev &&
  config.plugins.push(
    cssnano({
      preset: 'default',
    })
  )

module.exports = config
