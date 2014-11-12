var gulp         = require('gulp'),
    sass         = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rename       = require('gulp-rename'),
    cssmin       = require('gulp-cssmin'),
    jshint       = require('gulp-jshint'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglify'),
    addsrc       = require('gulp-add-src'),
    watch        = require('gulp-watch'),
    livereload   = require('gulp-livereload'),
    imagemin     = require('gulp-imagemin'),
    order        = require("gulp-order");

gulp.task('sass', function() {
    gulp.src('./css/style.scss')
        .pipe(sass({
            loadPath: [
                process.cwd() + '/css'
            ]
        }))
        .pipe(autoprefixer("last 2 version", "ie 9", "ie 8"))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', function() {
    gulp.src('./js/scripts.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(addsrc('./js/_libs/*.js'))
        .pipe(order([
                'js/_libs/jquery-1.11.1.js',
                'js/scripts.js'
            ], { base: './' }))
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('images', function () {
    return gulp.src('./images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('watch', function() {
    livereload.listen();

    gulp.watch('./css/**/*.scss', ['sass']).on('change', livereload.changed);
    gulp.watch('./js/**/*.js', ['js']).on('change', livereload.changed);
    gulp.watch('./**/*.php').on('change', livereload.changed);
    gulp.watch('./**/*.html').on('change', livereload.changed);
});

gulp.task('default', ['sass', 'js']);
