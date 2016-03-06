const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');
const ngHtml2Js = require('browserify-ng-html2js');
const plugins = require('gulp-load-plugins')();

const src = {
  scripts: {
    all: './src/**/*.js',
    zazu: './src/index.js',
    main: './src/main.js'
  },
  scss: {
    all: './src/**/*.scss'
  },
  html: {
    index: './src/index.html'
  },
  package: './package.json',
  fonts: [
    './node_modules/source-code-pro/WOFF/OTF/SourceCodePro-Regular.otf.woff',
    './node_modules/source-code-pro/WOFF2/OTF/SourceCodePro-Regular.otf.woff2'
  ]
};

const dist = './dist/';

const out = {
  folder: dist,
  scripts: {
    file: 'zazu.min.js'
  },
  scss: {
    file: 'zazu.min.css'
  }
};

gulp.task('scripts', () => {
  const sources = browserify({
    entries: src.scripts.zazu
  })
    .transform(babelify)
    .transform(ngHtml2Js({
      module: 'templates',
      requireAngular: false
    }));

  return sources.bundle()
    .pipe(vinylSourceStream(out.scripts.file))
    .pipe(vinylBuffer())
    .pipe(gulp.dest(out.folder));
});

gulp.task('sass', () => {
  return gulp.src(src.scss.all)
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.rename(out.scss.file))
    .pipe(gulp.dest(out.folder));
});

gulp.task('copy-main', () => {
  return gulp.src(src.scripts.main)
    .pipe(gulp.dest(out.folder));
});

gulp.task('copy-index', () => {
  return gulp.src(src.html.index)
    .pipe(gulp.dest(out.folder));
});

gulp.task('copy-package', () => {
  return gulp.src(src.package)
    .pipe(gulp.dest(out.folder));
});

gulp.task('copy-fonts', () => {
  return gulp.src(src.fonts)
    .pipe(gulp.dest(out.folder));
});

gulp.task('watch', () => {
  gulp.watch(src.scripts.main, ['copy-main']);
  gulp.watch(src.html.index, ['copy-index']);
  gulp.watch(src.package, ['copy-package']);
  gulp.watch(src.scripts.all, ['scripts']);
  gulp.watch(src.scss.all, ['sass']);
});

gulp.task('default', ['copy-main', 'copy-index', 'copy-package', 'copy-fonts', 'scripts', 'sass', 'watch']);
