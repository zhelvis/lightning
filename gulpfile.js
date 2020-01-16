const gulp = require('gulp')
const postcss = require('gulp-postcss')
const webpack = require('webpack-stream')
const webpackConfig = require('./webpack.config.js')
const named = require('vinyl-named')

gulp.task('css', () => {
  return gulp
    .src('./src/*.css')
    .pipe(postcss())
    .pipe(gulp.dest('./public'))
})

gulp.task('js', () => {
  return gulp
    .src('./src/*.js')
    .pipe(named())
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./public'))
})

// just replace html files
gulp.task('html', () => {
  return gulp.src('./src/*.html').pipe(gulp.dest('./public'))
})

gulp.task('default', gulp.parallel('css', 'js', 'html'))
