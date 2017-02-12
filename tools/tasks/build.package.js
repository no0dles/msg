const sequence = require('gulp-sequence');

module.exports = function (gulp, package) {
  gulp.task('build:' + package.name, sequence(
    'build:npm:' + package.name,
    'build:source:' + package.name
  ));
};
