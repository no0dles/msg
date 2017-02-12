const mocha = require('gulp-mocha');
const path = require('path');

module.exports = function (gulp, package) {
  gulp.task('run:test:' + package.name, function () {
    var testFiles = path.join(package.buildPath, '**/*.test.js');
    var npmDir = path.join(package.buildPath, 'node_modules/**/*.js');

    return gulp.src(['!' + npmDir, testFiles], {read: false})
      .pipe(mocha({reporter: 'list'}));
  });
};
