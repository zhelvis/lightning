const postcssPresetEnv = require('postcss-preset-env')

module.exports = {
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
