// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var sass = require('gulp-dart-sass');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleancss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var ssi = require('browsersync-ssi');
var merge = require('merge-stream');


//Package Json array
var pkg = require('./package.json');

// Compile Our Sass to CSS
function css() {
    return gulp.src('_assets-custom/sass/*.scss')
    //.pipe(sourcemaps.init())
    .pipe(sass())
    //.pipe(sourcemaps.write())
    //.pipe(postcss([require('postcss-flexibility')]))
    .pipe(autoprefixer({flexbox: true, browsers: ['last 3 versions', 'Safari >= 8']}))
    //.pipe(gulp.dest(config.srcDir + '/assets/css')) disable unminified css temporarily
    .pipe(cleancss({compatibility: '*'}))
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('_assets-custom/css'));
};


// Lint Task
function lint() {
    return gulp.src([
            '_assets-custom/js/*.js',
            '!_assets-custom/js/*.min.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
};

// Concatenate & Minify JS
function scripts() {
    return gulp.src([
            '_assets-custom/js/*.js',
            '!_assets-custom/js/*.min.js'
        ])
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('_assets-custom/js'));
};

// Copy all HTML files from src to dist
function copyHTML() {
  return gulp.src('*.html')
  .pipe(gulp.dest(config.distDir));
};

// Configure dist folder
function dist() {
    var html = gulp.src('*.html')
            .pipe(gulp.dest('dist'));

    var js = gulp.src('_assets-custom/js/*.min.js')
            .pipe(gulp.dest('dist/_assets-custom/js'));

    var css = gulp.src('_assets-custom/css/*.min.css')
            .pipe(gulp.dest('dist/_assets-custom/css')); 

    var image = gulp.src('_assets-custom/images/*')
            .pipe(gulp.dest('dist/_assets-custom/images')); 

    var inc = gulp.src('_assets-custom/includes/*')
            .pipe(gulp.dest('dist/_assets-custom/includes')); 

    return merge(html, js, css, image, inc);
};

//Serve the dist files
function server() {
    browserSync({
        notify: false,
        logPrefix: 'CTK',
        server: {
            baseDir: './',
            middleware: ssi({
              baseDir:'./',
              ext: '.html',
              version: '1.4.0'
            })
        },
        port: 3000
    });

    gulp.watch('./*.html').on('change', browserSync.reload);
    gulp.watch('_assets-custom/sass/*.scss', gulp.parallel(css)).on('change', browserSync.reload);
    gulp.watch(['_assets-custom/js/*.js','!_assets-custom/js/*.min.js'], gulp.parallel(lint, scripts)).on('change', browserSync.reload);
};


// Build Task
gulp.task('build', gulp.parallel(lint, css, scripts));
gulp.task('serve', gulp.series('build', server));
gulp.task('dist', gulp.series(dist));