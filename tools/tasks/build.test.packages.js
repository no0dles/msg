const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  const cleanBuilds = packages.map(function (package) {
    return 'build:test:' + package.name
  });

  gulp.task('build:test', sequence.apply(this, cleanBuilds));
};
