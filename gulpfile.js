var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var vinylSourceStream = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');

var src = {
  scripts: {
    all: 'src/**/*.js',
    zazu: 'src/zazu.js'
  }
};

var dist = 'dist/';

var out = {
  scripts: {
    file: 'zazu.min.js',
    folder: dist
  }
};

gulp.task('scripts', function () {
  var sources = browserify({
    entries: src.scripts.zazu
  })
    .transform(babelify.configure({
      presets: ['es2015']
    }));

  return sources.bundle()
    .pipe(vinylSourceStream(out.scripts.file))
    .pipe(vinylBuffer())
    .pipe(gulp.dest(out.scripts.folder));
});

gulp.task('watch', function () {
  gulp.watch(src.scripts.all, ['scripts']);
});

gulp.task('default', ['scripts', 'watch']);
