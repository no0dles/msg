const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  const install = packages.map(function (package) {
    return 'install:source:' + package.name
  });

  gulp.task('install:source', sequence.apply(this, install));
};
