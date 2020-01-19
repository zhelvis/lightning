const gulp = require('gulp')
const postcss = require('gulp-postcss')
const webpack = require('webpack-stream')
const named = require('vinyl-named')
const browsersync = require('browser-sync').create()
const plumber = require('gulp-plumber')
const clean = require('gulp-clean')

const webpackConfig = require('./webpack.config.js')

// clean public folder

function cleanUp() {
  return gulp.src('./public', { allowEmpty: true, read: false }).pipe(clean())
}

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

const build = gulp.series(cleanUp, gulp.parallel(css, html, js))
const watch = gulp.parallel(watchFiles, browserSync)

gulp.task('clean', cleanUp)
gulp.task('build', build)
gulp.task('watch', watch)

gulp.task('default', gulp.series(build, watch))
