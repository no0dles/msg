const gulp = require('gulp');
const mocha = require('gulp-mocha');

const path = require('path');
const packages = require('./packages');

const spawn = require('./spawn');

module.exports = function (package) {
  return {
    deps: ['build-testing-ts-' + package],
    init: function () {
      gulp.task('build-testing-ts-' + package, spawn.run(package, 'node_modules/.bin/tsc', ['-p', 'tsconfig-testing.json']));
    },
    fn: function () {
      return function() {
        var testFiles = path.join(packages.getBuildPath(package), '**/*.test.js');
        var npmDir = path.join(packages.getBuildPath(package), 'node_modules/**/*.js');
        gulp.src(['!' + npmDir, testFiles], {read: false})
          .pipe(mocha({reporter: 'list'}));
      };
    }
  };
};