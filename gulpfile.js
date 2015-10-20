'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const stylus = require('gulp-stylus');
const minifyHTML = require('gulp-minify-html');
const amdOptimize = require("amd-optimize");
const concat = require('gulp-concat');
const addsrc = require('gulp-add-src');
const uglify = require('gulp-uglify');
const ifElse = require('gulp-if-else');
const tslint = require('gulp-tslint');
const replace = require('gulp-replace');
const karma = require("karma").Server;
const ncp = require('ncp').ncp;
const del = require('del');

//If run task bulid
const PRODUCTION = process.argv.indexOf('build') !== -1;
//folder for compiling
const FOLDER = PRODUCTION ? './build' : './deploy';


/**
 *
 * Очищаем папку
 */
gulp.task('clean', ()=> {
    del([FOLDER]);
});

/**
 *
 * @desc Compile TypeScript
 * @desc If wa are compiling build, then concat in all minifire file + prepend almond library
 */
gulp.task('typescript', ()=> {

    return gulp.src(['src/ts/*.{ts,tsx}', '!src/ts/*.test.{ts,tsx}'])
        .pipe(ts({
            module: 'amd',
            target: 'es5',
            jsx: 'react'
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
gulp.task('css',()=> {
    return gulp.src(['src/style/style.styl'])
        .pipe(ifElse(PRODUCTION,
            ()=> stylus({
                    compress: true
                })
            ,
            stylus))
        .pipe(gulp.dest(`${FOLDER}/css`));
});

/**
 *
 * Минификация html
 */
gulp.task('html', ()=> {
    return gulp.src(['src/html/*.html'])
        .pipe(ifElse(PRODUCTION, ()=>
            replace('frontend-libs/requirejs/require.js" data-main="js/main"', 'js/main.js"')
        ))
        .pipe(ifElse(PRODUCTION, ()=>
            minifyHTML({
                empty: true,
                loose: true
            })
        ))
        .pipe(gulp.dest(`${FOLDER}`));
});

gulp.task('copylibs', ()=>{
    ncp("./frontend-libs", `${FOLDER}/frontend-libs`);
});

/**
 *
 * Проверка TypeScript валидатором
 */
gulp.task('tslint', ()=> 
    gulp.src(['src/ts/*.{ts,tsx}'])
        .pipe(tslint())
);


gulp.task('test-prepare-ts', ()=> {
    return gulp.src(['src/ts/*.{ts,tsx}'])
        .pipe(ts({
            module: 'amd',
            target: 'es5',
            jsx: 'react'
        }))
        .pipe(gulp.dest(`./test/_src/js`));
});

gulp.task('test-prepare-css', ()=> {
    return gulp.src(['src/style/style.styl'])
        .pipe(stylus())
        .pipe(gulp.dest(`./test/_src/css`));
});

/**
 *
 * Очищаем папку
 */
gulp.task('test-clean', ()=> {
    del('./test/_src');
});


gulp.task('test', ['test-clean', 'test-prepare-ts', 'test-prepare-css'], (done)=> {
    new karma({
        configFile: __dirname + '/karma.conf.js'
    }, function() {
        done();
    }).start();
});


gulp.task('default', ['clean', 'typescript', 'css', 'html', 'copylibs']);

gulp.task('build', ['clean', 'typescript', 'css', 'html']);