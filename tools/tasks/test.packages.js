const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  const testPackages = packages.map(function (package) {
    return 'test:' + package.name
  });

  gulp.task('test', sequence.apply(this, testPackages));
};
