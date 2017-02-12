const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  const tasks = packages.map(function (package) {
    return 'init:' + package.name;
  });

  gulp.task('init', sequence.apply(this, tasks));
};
