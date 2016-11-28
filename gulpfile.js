/* ~~~~~~ GULP DEPENDENCIES ~~~~~~ */
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var map = require('map-stream');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");
var revDeleteOriginal = require("gulp-rev-delete-original");
var gutil = require('gulp-util');
var filesize = require('gulp-filesize');
var livereload = require('gulp-livereload');


/* ~~~~~~ BUILD DEPENDENCIES ~~~~~~ */
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

/* ~~~~~~ STYLE DEPENDENCIES ~~~~~~ */
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var cleanCSS = require('gulp-clean-css');

/* ~~~~~~ DEVELOPMENT DEPENDENCIES ~~~~~~ */
var jshint = require('gulp-jshint');

var srcDir = "src";
var buildDir = "docs";

require('gulp-stats')(gulp);

/* ~~~~~~ FUNCTIONS ~~~~~~ */
var handleError = function (err) {
    console.log(err.toString());
    this.emit('end');
};

/* ~~~~~~ GLOBAL TASKS ~~~~~~ */

gulp.task('clean', [], function () {
    return gulp.src(buildDir)
        .pipe(clean({read: false, force: true}));
});

gulp.task('rev', ['uglify', 'minify-css'], function () {
    return gulp.src([buildDir + "/**/*.js", buildDir + "/**/*.css"])
        .pipe(filesize())
        .pipe(rev())
        .pipe(revDeleteOriginal())
        .pipe(gulp.dest(buildDir))
        .pipe(rev.manifest())
        .pipe(gulp.dest(buildDir));
});

gulp.task('revreplace', ['rev'], function () {
    var manifest = gulp.src(buildDir + "/rev-manifest.json");

    return gulp.src(buildDir + "/index.html")
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest(buildDir));
});

/* ~~~~~~ JS TASKS ~~~~~~ */
gulp.task('lint-app', function () {
    return gulp.src(srcDir + '/**/*.js')
        .pipe(jshint())
        .on('error', handleError)
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('uglify', function () {
    return gulp.src(srcDir + '/scripts/app.js')
        .pipe(filesize())
        .pipe(uglify())
        .pipe(gulp.dest(buildDir + '/scripts'));
});

/* ~~~~~~ CSS TASKS ~~~~~~ */

gulp.task('styles', [], function () {
    return gulp.src(srcDir + '/styles/main.less')
        .pipe(sourcemaps.init())
        .pipe(concat('concat.css'))
        .pipe(less())
        .on('error', handleError)
        .pipe(prefix({cascade: true}))
        .pipe(sourcemaps.write())
        .pipe(rename('styles.css'))
        .pipe(gulp.dest(buildDir + '/styles'))
        .pipe(livereload());
});

gulp.task('minify-css', ['styles'], function () {
    return gulp.src(buildDir + '/styles/styles.css')
        .pipe(filesize())
        .pipe(cleanCSS())
        .pipe(gulp.dest(buildDir + '/styles'));
});

/* ~~~~~~ IMAGES TASKS ~~~~~~ */

gulp.task('copy-images', [], function () {
    return gulp.src(srcDir + '/images/**')
        .pipe(gulp.dest(buildDir + '/images'))
        .pipe(livereload());
});

gulp.task('copy-favicon', [], function () {
    return gulp.src(srcDir + '/*.ico')
        .pipe(gulp.dest(buildDir));
});

/* ~~~~~~ FONTS TASKS ~~~~~~ */

gulp.task('copy-fonts', [], function () {
    return gulp.src(srcDir + '/styles/fonts/**')
        .pipe(gulp.dest(buildDir + '/styles/fonts'))
        .pipe(livereload());
});

/* ~~~~~~ VIEWS TASKS ~~~~~~ */

gulp.task('copy-views', [], function () {
    return gulp.src(srcDir + '/**/*.html')
        .pipe(gulp.dest(buildDir))
        .pipe(livereload());
});

/* ~~~~~~ BUILDS ~~~~~~ */

gulp.task('default', function (callback) {
    runSequence('clean', ['revreplace', 'copy-views', 'copy-images', 'copy-favicon', 'copy-fonts'], callback);
});

gulp.task('watch', ['styles', 'copy-views', 'copy-images', 'copy-favicon', 'copy-fonts'], function () {
    var fileLogger = function (file, cb) {
        return map(function (file, cb) {
            console.log(gutil.colors.cyan('lint file :'), file.path, '\n');
            cb(null, file);
        });
    };

    var lintAndCopyFile = function (file) {
        gulp.src(file.path)
            .pipe(jshint())
            .pipe(fileLogger())
            .pipe(jshint.reporter('jshint-stylish'))
            .pipe(gulp.dest(buildDir + '/scripts/'))
            .pipe(livereload());
    };

    livereload.listen();

    gulp.watch(srcDir + '/**/*.js').on('add', lintAndCopyFile);
    gulp.watch(srcDir + '/**/*.js').on('change', lintAndCopyFile);
    gulp.watch(srcDir + '/**/*.less', ['styles']);
    gulp.watch(srcDir + '/**/*.css', ['styles']);
    gulp.watch(srcDir + '/styles/fonts/**', ['copy-fonts']);
    gulp.watch(srcDir + '/styles/fonts', ['copy-fonts']);
    gulp.watch(srcDir + '/**/*.html', ['copy-views']);
    gulp.watch(srcDir + '/images/**', ['copy-images']);
    gulp.watch(srcDir + '/*.ico', ['copy-favicon']);
    gulp.watch(srcDir + '/**/*.json', ['copy-dev-files']);
});