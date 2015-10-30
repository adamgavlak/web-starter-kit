/* Directories, paths and file config */
var dirs = {
    src: 'source',
    dest: 'public'
};

var paths = {
    styles: dirs.src + '/sass/**/*.scss',
    images: dirs.src + '/images/**/*.{jpg,jpeg,png,gif}',
    scripts: dirs.src + '/js/**/*.js',
    jade: [dirs.src + '/html/*.jade', '!' + dirs.src + '/html/_*.jade'],
    build: dirs.dest + '/',
    assets: dirs.dest + '/assets'
};

var files = {
    javascript: 'app',
    style: 'style'
};

/* Gulp */
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var del = require('del');
var jade = require('gulp-jade');
var imagemin = require('gulp-imagemin');
var browsersync = require('browser-sync').create();
var rename = require('gulp-rename');

gulp.task('default', ['styles', 'scripts', 'jade']); 

gulp.task('clean', function() {
    del(['public/*', '!.gitignore']);
});

gulp.task('jade', function() {
    gulp.src(paths.jade)
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(paths.build))
        .pipe(browsersync.stream());
});

gulp.task('styles', function() {
    gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({browsers: ['last 2 versions']}))
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(rename({basename: files.style, extname: '.css'}))
        .pipe(gulp.dest(paths.assets))
        .pipe(browsersync.stream());
});

gulp.task('scripts', function() {
    gulp.src(paths.scripts)
        .pipe(concat(files.javascript))
        .pipe(uglify())
        .pipe(rename({basename: files.javascript, extname: '.js'}))
        .pipe(gulp.dest(paths.assets))
        .pipe(browsersync.stream());
}); 

gulp.task('images', function() {
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.assets + '/images'))
});

gulp.task('serve', ['styles', 'scripts', 'jade'], function() {
    browsersync.init({server: "./" + dirs.dest});

    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.jade, ['jade']);
    gulp.watch(paths.build + '**/*.html').on('change', browsersync.reload);
});

gulp.task('watch', function() {
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.jade, ['jade']);
});