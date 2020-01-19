const gulp = require('gulp')
const postcss = require('gulp-postcss')
const webpack = require('webpack-stream')
const imagemin = require('gulp-imagemin')
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
    .src('./src/css/*.css')
    .pipe(plumber())
    .pipe(postcss())
    .pipe(gulp.dest('./public/css'))
    .pipe(browsersync.stream())
}

// build js

function js() {
  return gulp
    .src('./src/js/*.js')
    .pipe(plumber())
    .pipe(named())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./public/js'))
    .pipe(browsersync.stream())
}

// replace html files

function html() {
  return gulp
    .src('./src/*.html')
    .pipe(gulp.dest('./public'))
    .pipe(browsersync.stream())
}

// compress images

function img() {
  return gulp
    .src('src/img/*')
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest('./public/img'))
    .pipe(browsersync.stream())
}

// replace fonts

function fonts() {
  return gulp
    .src('src/fonts/*')
    .pipe(gulp.dest('./public/fonts'))
    .pipe(browsersync.stream())
}

// Watch files

function watchFiles() {
  gulp.watch('./src/css/*.css', css)
  gulp.watch('./src/js/*.js', js)
  gulp.watch('./src/*.html', html)
  gulp.watch('./src/img/*', img)
  gulp.watch('./src/fonts/*', fonts)
}

// complex behavior

const build = gulp.series(cleanUp, gulp.parallel(fonts, css, html, js, img))
const watch = gulp.parallel(watchFiles, browserSync)

// public tasks

gulp.task('clean', cleanUp)
gulp.task('build', build)
gulp.task('watch', watch)

gulp.task('default', gulp.series(build, watch))
