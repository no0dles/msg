const sequence = require('gulp-sequence');

module.exports = function (gulp, packages) {
  for(var i = 0; i < packages.length; i++) {
    gulp.task('install:' + packages[i].name, [
      'install:source:' + packages[i].name
    ]);
  }

  gulp.task('install', packages.map(function (package) {
    return 'install:' + package.name
  }));
};
