const sequence = require('gulp-sequence');

module.exports = function (gulp, package) {
  gulp.task('test:' + package.name, sequence('build:test:' + package.name, 'run:test:' + package.name));
};
