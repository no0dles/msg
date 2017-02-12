const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  const install = packages.map(function (package) {
    return 'installSource:source:' + package.name
  });

  gulp.task('installSource:source', sequence.apply(this, install));
};
