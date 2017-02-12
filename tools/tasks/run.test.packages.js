const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  const runTests = packages.map(function (package) {
    return 'run:test:' + package.name;
  });

  gulp.task('run:test', sequence.apply(this, runTests));
};
