var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    notify = require("gulp-notify"),
    del = require("del"),
    clean = require("gulp-clean"),
    zip = require('gulp-zip'),
    addsrc = require('gulp-add-src'),

    fs = require('fs'),
    pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));


var build = 'build';

gulp.task('build', ['clean', 'sass', 'js-libs', 'js-common'], function () {

    var buildZipBlogger = gulp.src([
        '!app/sass/**/*',
        '!app/sass',
        '!app/img/**/*',
        '!app/img',
        'placeholder/**/*',
        'app/**/*'
    ])
        .pipe(rename(function (file) {
            file.dirname = 'html/' + file.dirname;
        }))
        .pipe(zip(pkg.name + '_' + pkg.version + '.zip'))
        .pipe(gulp.dest(build));

    var buildZipBloggerDev = gulp.src([
        '!app/img/**/*',
        '!app/img',
        'placeholder/**/*',
        'app/**/*',
    ])
        .pipe(rename(function (file) {
            file.dirname = 'html/' + file.dirname;
        }))
        .pipe(addsrc([
            '*docs/**/*',
            'package.json',
            'gulpfile.js',
            '*licenses/**/*'
        ]))
        .pipe(zip(pkg.name + '_dev_' + pkg.version + '.zip'))
        .pipe(gulp.dest(build));

    var buildZipScreens = gulp.src('presentation/**/*')
        .pipe(zip('blogger-screenshots-' + pkg.version + '.zip'))
        .pipe(gulp.dest(build));
});

gulp.task('clean', function () {
    del.sync(build);
});

// Server and Browsersync page auto-refreshment 
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false,
        // tunnel: true,
        tunnel: "sigma", //Demonstration page: http://sigma.localtunnel.me
    });
});

// Minifying user scripts of a project and JS libraries into one file
gulp.task('js-libs', function () {
    return gulp.src([
        'app/libs/jquery/dist/jquery-3.2.1.js',
        'app/libs/jquery-ui-1.12.1/jquery-ui.min.js',
        'app/js/common.js',
    ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('app/js'))
        .pipe(concat('scripts.min.js'))
        .pipe(uglify()) // Mimimazing all the js (on the choiсe)
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('js-common', function () {
    return gulp.src([
        'app/js/common.js'
    ])
        .pipe(gulp.dest('app/js'))
        .pipe(concat('common.min.js'))
        .pipe(uglify()) // Mimimazing all the js (on the choiсe)
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('sass', function () {
    return gulp.src('app/sass/**/*.sass')
        .pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
        .pipe(rename({ suffix: '.min', prefix: '' }))
        .pipe(autoprefixer(['last 15 versions']))
        .pipe(cleanCSS()) // Optionally, comment during debugging
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('watch', ['sass', 'js-common', 'js-libs', 'browser-sync'], function () {
    gulp.watch('app/sass/**/*.sass', ['sass']);
    gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js-common', 'js-libs']);
    gulp.watch('app/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);