const path = require('path');
const gulp = require('gulp');
const shell = require('gulp-shell');
const sass = require('gulp-sass');
const webpackStream = require('webpack-stream');
const named = require('vinyl-named');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const webpack = require('webpack');

gulp.task('clean', function () {
    return gulp.src('www', { read: false, allowEmpty: true })
        .pipe(clean());
});

sass.compiler = require('node-sass');

gulp.task('sass', function () {
    return gulp.src('src/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('www/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('src/css/**/*.scss', ['sass']);
});

gulp.task('dev-build-js', () =>
    gulp.src('src/js/index.js')
        .pipe(named())
        .pipe(webpackStream({
            mode: 'development',
            output: {
                path: path.resolve(__dirname, 'www/js'),
                filename: 'index.js'
            },
            devtool: 'inline-source-map'
        }))
        .pipe(gulp.dest('www/js'))
);

gulp.task('build-js', () =>
    gulp.src('src/js/index.js')
        .pipe(named())
        .pipe(webpackStream({
            mode: 'production',
            output: {
                path: path.resolve(__dirname, 'www/js'),
                filename: 'index.js'
            },
            module: {
                rules: [
                    {
                        test: /\.(js)$/,
                        exclude: /(node_modules)/,
                        loader: 'babel-loader',
                        query: {
                            presets: ["@babel/preset-env"],
                            "plugins": [
                                [
                                    "@babel/plugin-transform-runtime",
                                    {
                                        "regenerator": true
                                    }
                                ]
                            ],
                        }
                    }
                ]
            },
        }))
        .pipe(gulp.dest('www/js'))
        .pipe(uglify())
        .pipe(gulp.dest('www/js'))
);

gulp.task('html', () =>
    gulp.src('src/index.html')
        .pipe(gulp.dest('www'))
);

gulp.task('assets', () =>
    gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('www/assets'))
);

gulp.task('cordova-build-browser', shell.task('npx cordova build browser'));

gulp.task('cordova-run-android', shell.task('npx cordova run android'));

gulp.task('cordova-debug-build-android', shell.task('npx cordova build android'));

gulp.task('dev-build', gulp.series('dev-build-js', 'sass', 'html', 'assets'));

gulp.task('build', gulp.series('build-js', 'sass', 'html', 'assets'));

gulp.task('watch', () => {
    return gulp.watch([
        'src/**/*.*',
    ],
        gulp.series('dev-build', 'cordova-build-browser')
    );
});

gulp.task('dev', gulp.series('clean', 'dev-build', 'cordova-build-browser', 'watch'));

gulp.task('run-android', gulp.series('clean', 'build', 'cordova-run-android', 'clean', 'dev-build'));

gulp.task('dev-build-android', gulp.series('clean', 'build', 'cordova-debug-build-android', 'clean', 'dev-build'));

gulp.task('default', gulp.series('dev'));
