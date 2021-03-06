const gulp = require('gulp')
const through2 = require('through2')
const gulpif = require('gulp-if')
const postcss = require('gulp-postcss')
const nunjucks = require('gulp-nunjucks-render')
const htmlmin = require('gulp-htmlmin')
const prettyHtml = require('gulp-pretty-html')
const imagemin = require('gulp-imagemin')
const browsersync = require('browser-sync').create()
const clean = require('gulp-clean')

const isDev = process.env.NODE_ENV === 'development'

const data = require('./data.json')
const { static, port } = require('./config')

const resolveOutputHtmlPath = () => through2.obj(function(file, _, cb) {

  if (!file.isBuffer()) return
  
  const { basename, stem, extname, path } = file

  if(file.stem === 'index'){
    cb(null, file)
    return
  }

  file.path = `${path.replace(basename, '')}/${stem}/index${extname}`

  cb(null, file);
})

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
    port,
  })
  done()
}

// build css

function css() {
  return gulp
    .src('./src/css/**/*.css')
    .pipe(postcss())
    .pipe(gulp.dest('./public/css'))
    .pipe(browsersync.stream())
}

// render html

function html() {
  return gulp
    .src('./src/pages/**/*.html')
    .pipe(
      nunjucks({
        path: ['./src/templates'],
        data,
      })
    )
    .pipe(gulpif(isDev, prettyHtml(), htmlmin({ collapseWhitespace: true })))
    .pipe(gulpif(static, resolveOutputHtmlPath()))
    .pipe(gulp.dest('./public'))
    .pipe(browsersync.stream())
}

// compress images

function img() {
  return gulp
    .src('src/img/**/*')
    .pipe(gulpif(!isDev, imagemin()))
    .pipe(gulp.dest('./public/img'))
    .pipe(browsersync.stream())
}

// replace fonts

function fonts() {
  return gulp
    .src('src/fonts/**/*')
    .pipe(gulp.dest('./public/fonts'))
    .pipe(browsersync.stream())
}

// Watch files

function watchFiles() {
  gulp.watch('./src/css/**/*.css', css)
  gulp.watch(['./src/pages/**/*.html', './src/templates/**/*.html', './data.json'], html)
  gulp.watch('./src/img/**/*', img)
  gulp.watch('./src/fonts/**/*', fonts)
}

// complex behavior

const build = gulp.series(cleanUp, gulp.parallel(fonts, css, html, img))
const watch = gulp.parallel(watchFiles, browserSync)

// public tasks

gulp.task('clean', cleanUp)
gulp.task('build', build)
gulp.task('watch', watch)

gulp.task('default', gulp.series(build, watch))
