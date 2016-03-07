const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const watchify = require('watchify');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');
const stringify = require('stringify');
const argv = require('yargs').argv;
const assign = require('lodash.assign');
const $ = require('gulp-load-plugins')();

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
    all: './src/**/!(index).html',
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

const customOptions = {
  entries: src.scripts.zazu,
  debug: true
};
const options = assign({}, watchify.args, customOptions);
const sources = watchify(browserify(options));

sources.transform(babelify);
sources.transform(stringify, {
  appliesTo: {
    includeExtensions: ['.html']
  },
  minify: true
});

gulp.task('scripts', bundle);
sources.on('update', bundle);
sources.on('log', $.util.log);

function bundle () {
  return sources.bundle()
    .on('error', $.util.log.bind($.util, 'Browserify Error'))
    .pipe(vinylSourceStream(out.scripts.file))
    .pipe(vinylBuffer())
    .pipe($.if(argv.prod, $.ngAnnotate()))
    .pipe($.if(argv.prod, $.uglify()))
    .pipe(gulp.dest(out.folder));
}

gulp.task('sass', () => {
  return gulp.src(src.scss.all)
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.rename(out.scss.file))
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
  gulp.watch(src.html.all, ['scripts']);
  gulp.watch(src.scss.all, ['sass']);
});

gulp.task('default', ['copy-main', 'copy-index', 'copy-package', 'copy-fonts', 'scripts', 'sass', 'watch']);
