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

var paths = {
    styles: 'source/sass/**/*.scss',
    images: 'source/images/**/*.{jpg,jpeg,png,gif}',
    scripts: 'source/js/**/*.js',
    jade: ['source/html/*.jade', '!source/html/_*.jade'],
    build: 'public/',
    assets: 'public/assets'
};

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
        .pipe(gulp.dest(paths.assets))
        .pipe(browsersync.stream());
});

gulp.task('scripts', function() {
    gulp.src(paths.scripts)
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.assets))
        .pipe(browsersync.stream());
}); 

gulp.task('images', function() {
    gulp.src(paths.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.assets + '/images'))
});

gulp.task('serve', ['styles', 'scripts', 'jade'], function() {
    browsersync.init({server: "./public"});

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