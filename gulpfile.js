const gulp = require('gulp');
const tsify = require('tsify');
const browserify = require('browserify');
const watchify = require('watchify');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');
const stringify = require('stringify');
const del = require('del');
const assign = require('lodash.assign');
const argv = require('yargs').argv;
const $ = require('gulp-load-plugins')();

const src = {
  scripts: {
    all: './src/**/*.ts',
    index: './src/index.ts'
  },
  css: {
    hotkey: './node_modules/angular-hotkeys/build/hotkeys.min.css'
  },
  scss: {
    all: './src/**/*.scss'
  },
  html: {
    all: './src/**/!(index).html'
  },
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
  entries: src.scripts.index,
  debug: true
};
const options = assign({}, watchify.args, customOptions);
const sources = watchify(browserify(options));

sources.plugin(tsify);
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
    .pipe(gulp.dest(out.folder));
}

gulp.task('scripts:prod', () => {
  return browserify()
    .add(src.scripts.index)
    .plugin(tsify)
    .transform(stringify, {
      appliesTo: {
        includeExtensions: ['.html']
      },
      minify: true
    })
    .bundle()
    .pipe(vinylSourceStream(out.scripts.file))
    .pipe(vinylBuffer())
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(gulp.dest(out.folder));
});

gulp.task('sass', () => {
  return gulp.src(src.scss.all)
    .pipe($.sass().on('error', $.sass.logError))
    .pipe($.rename(out.scss.file))
    .pipe(gulp.dest(out.folder));
});

gulp.task('clean', () => {
  return del([dist + '**/*']);
});

gulp.task('config', () => {
  gulp.src('zazu.config.json')
    .pipe($.ngConfig('zazu.config', {
      environment: argv.env,
      wrap: 'export default <%= module %>'
    }))
    .pipe($.rename('zazu.config.ts'))
    .pipe(gulp.dest('./src'))
});

gulp.task('copy-fonts', () => {
  return gulp.src(src.fonts)
    .pipe(gulp.dest(out.folder));
});

gulp.task('copy-hotkey', () => {
  return gulp.src(src.css.hotkey)
    .pipe(gulp.dest(out.folder));
});

gulp.task('copy', [
  'copy-fonts',
  'copy-hotkey'
]);

gulp.task('watch', () => {
  gulp.watch(src.scripts.all, ['scripts']);
  gulp.watch(src.html.all, ['scripts']);
  gulp.watch(src.scss.all, ['sass']);
});

gulp.task('default', [
  'config',
  'copy',
  'scripts',
  'sass',
  'watch'
]);

gulp.task('package', [
  'config',
  'clean',
  'copy',
  'scripts:prod',
  'sass'
]);
