const gulp = require('gulp');
const mocha = require('gulp-mocha');

const path = require('path');
const packages = require('./packages');

module.exports.run = function(package) {
  return function () {
    var testFiles = path.join(packages.getBuildPath(package), '**/*.test.js');
    gulp.src(testFiles, {read: false})
      .pipe(mocha({reporter: 'list'}));
  }
}