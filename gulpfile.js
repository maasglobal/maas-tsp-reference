'use strict';

const argv = require('yargs').argv;
const gulp = require('gulp');
const jsonlint = require('gulp-jsonlint');
const jsonclint = require('gulp-json-lint');
const eslint = require('gulp-eslint');
const gmocha = require('gulp-mocha');
const gulpSequence = require('gulp-sequence');
const gutil = require('gulp-util');

const jsoncFiles = ['.eslintrc']; // json with comments
const jsonFiles = ['**/*.json', '!**/node_modules/**/*.json', '!_meta/**/*.json', '!schemas/**/*.json'];
const jsFiles = ['**/*.js', '!**/node_modules/**/*.js', '!_meta/**/*.js', '!schemas/**/*.js'];

gulp.task('jsonclint', () => {

  // Unfortunately does not support failOnError at the moment
  // See https://github.com/panuhorsmalahti/gulp-json-lint/issues/2

  return gulp.src(jsoncFiles)
    .pipe(jsonclint({ comments: true }))
    .pipe(jsonclint.report('verbose'));
});

gulp.task('jsonlint', () => {
  return gulp.src(jsonFiles)
    .pipe(jsonlint())
    .pipe(jsonlint.reporter())
    .pipe(jsonlint.failOnError());
});

gulp.task('eslint', () => {
  return gulp.src(jsFiles)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('mocha', () => {
  return gulp.src('tests/test.js', { read: false })
    .pipe(gmocha({ grep: argv.grep }))
    .on('error', error => {
      gutil.log(error);
      process.exit(1);
    })
    .on('end', () => {
      process.exit();
    });
});

gulp.task('validate', ['jsonclint', 'jsonlint', 'eslint']);

gulp.task('test', gulpSequence('validate', 'mocha'));

gulp.task('default');
