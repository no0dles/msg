const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  const buildPackages = packages.map(function (package) {
    return 'build:test:' + package.name
  });

  const installPackages = packages.map(function (package) {
    return 'install:build:' + package.name
  });

  const testPackages = packages.map(function (package) {
    return 'test:' + package.name
  });

  gulp.task('test', sequence.apply(this, installPackages.concat(buildPackages.concat(testPackages))));
};
