const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  const publish = packages.map(function (package) {
    return 'publish:npm:' + package.name
  });

  gulp.task('publish:npm', sequence.apply(this, publish));
};
