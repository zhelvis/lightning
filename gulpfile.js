const gulp = require('gulp')
const postcss = require('gulp-postcss')
const webpack = require('webpack-stream')
const webpackConfig = require('./webpack.config.js')
const named = require('vinyl-named')
const browsersync = require('browser-sync').create()
const plumber = require('gulp-plumber')

// BrowserSync

function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: './public/',
    },
    port: 8080,
  })
  done()
}

// build css

function css() {
  return gulp
    .src('./src/*.css')
    .pipe(plumber())
    .pipe(postcss())
    .pipe(gulp.dest('./public'))
    .pipe(browsersync.stream())
}

// build js

function js() {
  return gulp
    .src('./src/*.js')
    .pipe(plumber())
    .pipe(named())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./public'))
    .pipe(browsersync.stream())
}

// replace html files

function html() {
  return gulp
    .src('./src/*.html')
    .pipe(gulp.dest('./public'))
    .pipe(browsersync.stream())
}

// Watch files
function watchFiles() {
  gulp.watch('./src/*.css', css)
  gulp.watch('./src/*.js', js)
  gulp.watch('./src/*.html', html)
}

const build = gulp.parallel(css, html, js)
const watch = gulp.parallel(watchFiles, browserSync)

exports.default = gulp.series(build, watch)
