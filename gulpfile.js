'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const stylus = require('gulp-stylus');
const stylint = require('gulp-stylint');
const sourcemaps = require('gulp-sourcemaps');
const htmlmin = require('gulp-htmlmin');
const amdOptimize = require("amd-optimize");
const concat = require('gulp-concat');
const addsrc = require('gulp-add-src');
const uglify = require('gulp-uglify');
const ifElse = require('gulp-if-else');
const tslint = require('gulp-tslint');
const replace = require('gulp-replace');
const minifyCssNames = require('gulp-minify-cssnames');
const karma = require("karma").Server;
const del = require('del');

//If run task bulid
const PRODUCTION = process.argv.includes('build');
//folder for compiling
const FOLDER = PRODUCTION ? './build' : './deploy';


/**
 *
 * Очищаем папку
 */
gulp.task('clean', () => {
    return del([FOLDER]);
});

/**
 *
 * @desc Compile TypeScript
 * @desc If wa are compiling build, then concat in all minifire file + prepend almond library
 */
gulp.task('typescript', ['clean'], ()=> {

    return gulp.src(['src/ts/*.{ts,tsx}', '!src/ts/*.test.{ts,tsx}'])
        .pipe(ts({
            module: 'amd',
            target: 'es5',
            jsx: 'react',
            files: [
                './typings/browser.d.ts'
            ]
        }))
        .pipe(ifElse(PRODUCTION, ()=> amdOptimize('main')))
        .pipe(ifElse(PRODUCTION, ()=> addsrc.prepend('frontend-libs/almond/almond.js')))
        .pipe(ifElse(PRODUCTION, ()=> concat('main.js')))
        .pipe(ifElse(PRODUCTION, ()=> replace(/$/, 'require("main");')))
        .pipe(ifElse(PRODUCTION, uglify))
        .pipe(gulp.dest(`${FOLDER}/js`));
});

/**
 *
 * Собираем Stylus
 */
gulp.task('css', ['clean'], ()=> {
    let pipeline = gulp.src(['src/style/style.styl']);

    if (PRODUCTION) {
        pipeline = pipeline.pipe(stylus({
                    compress: true
                }));
    } else {
        pipeline = pipeline.pipe(sourcemaps.init())
            .pipe(stylus())
            .pipe(sourcemaps.write());
    }

    return pipeline.pipe(gulp.dest(`${FOLDER}/css`));
});

/**
 *
 * Минификация html
 */
gulp.task('html', ['clean'], ()=> {
    return gulp.src(['src/html/*.html'])
        .pipe(ifElse(PRODUCTION, ()=>
            replace('frontend-libs/requirejs/require.js" data-main="js/main"', 'js/main.js"')
        ))
        .pipe(ifElse(PRODUCTION, ()=>
            htmlmin({
                removeComments: true,
                removeCommentsFromCDATA: true,
                removeCDATASectionsFromCDATA: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                preserveLineBreaks: true
            })
        ))
        .pipe(gulp.dest(`${FOLDER}`));
});

gulp.task('copylibs', ['clean'], () => {
    return gulp.src('./frontend-libs/**/*')
        .pipe(gulp.dest(`${FOLDER}/frontend-libs`));
});

gulp.task('minifyCssNames', ['html', 'css', 'typescript'], ()=>
    gulp.src([`${FOLDER}/*.html`, `${FOLDER}/css/*.css`, `${FOLDER}/js/*.js`], { base: `${FOLDER}` })
        .pipe(minifyCssNames())
        .pipe(gulp.dest(`${FOLDER}`))
);

/**
 *
 * @desc Check TypeScript validation
 */
gulp.task('tslint', ()=>
    gulp.src(['src/ts/*.{ts,tsx}'])
        .pipe(tslint())
        .pipe(tslint.report('verbose'))
);

/**
 *
 * @desc Check stylus validation
 */
gulp.task('styluslint', ()=>
    gulp.src(['src/style/*.styl'])
        .pipe(stylint())
        .pipe(stylint.reporter())
);

/**
*
* @desc validation Stylus and TypeScript
*/
gulp.task('lint', ['tslint', 'styluslint']);

gulp.task('test-prepare-ts', ['test-clean'], ()=> {
    return gulp.src(['src/ts/*.{ts,tsx}'])
        .pipe(ts({
            module: 'amd',
            target: 'es5',
            jsx: 'react',
            files: [
                './typings/browser.d.ts'
            ]
        }))
        .pipe(gulp.dest(`./test/_src/js`));
});

gulp.task('test-prepare-css', ['test-clean'], ()=> {
    return gulp.src(['src/style/style.styl'])
        .pipe(stylus())
        .pipe(gulp.dest(`./test/_src/css`));
});

/**
 *
 * Очищаем папку
 */
gulp.task('test-clean', () => {
    return del('./test/_src');
});


gulp.task('test', ['test-clean', 'test-prepare-ts', 'test-prepare-css'], (done)=> {
    new karma({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});


gulp.task('default', ['clean', 'typescript', 'css', 'html', 'copylibs']);

gulp.task('build', ['clean', 'typescript', 'css', 'html', 'minifyCssNames']);

gulp.task('lint', ['tslint']);
