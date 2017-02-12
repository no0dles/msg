const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  const clean = packages.map(function (package) {
    return 'clean:build:' + package.name
  });

  const build = packages.map(function (package) {
    return 'build:' + package.name
  });

  const publish = packages.map(function (package) {
    return 'publishNpm:npm:' + package.name
  });

  const tasks = clean
    .concat(['bump'])
    .concat(build)
    .concat(publish);

  gulp.task('publish', sequence.apply(this, tasks));
};
