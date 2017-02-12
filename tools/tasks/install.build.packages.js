const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  const install = packages.map(function (package) {
    return 'install:build:' + package.name
  });

  gulp.task('install:build', sequence.apply(this, install));
};
