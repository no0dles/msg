const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  for(var i = 0; i < packages.length; i++) {
    gulp.task('build:' + packages[i].name, [
      'build:package:' + packages[i].name,
      'build:source:' + packages[i].name
    ]);
  }

  const builds = packages.map(function (package) {
    return 'build:' + package.name
  });

  gulp.task('build', sequence.apply(this, builds));
};
