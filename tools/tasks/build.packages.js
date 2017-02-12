const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  const builds = packages.map(function (package) {
    return 'build:' + package.name
  });

  gulp.task('build', sequence.apply(this, builds));
};
