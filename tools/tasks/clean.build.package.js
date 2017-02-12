const clean = require('gulp-clean');

module.exports = function (gulp, package) {
  gulp.task('clean:build:' + package.name, [], function () {
    return gulp.src(package.buildPath, { read: false })
      .pipe(clean());
  });
};
