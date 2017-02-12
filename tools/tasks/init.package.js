const sequence = require('gulp-sequence');

module.exports = function (gulp, package) {
  gulp.task('init:' + package.name, sequence(
    'build:npm:' + package.name,
    'link:build:' + package.name,
    'link:source:dep:' + package.name
  ));
};
