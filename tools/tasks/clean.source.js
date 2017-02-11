const clean = require('gulp-clean');
const path = require('path');

module.exports = function (gulp, package) {
  gulp.task('clean:source:' + package.name, [], function () {
    return gulp.src(path.join(package.sourcePath, 'node_modules'), { read: false })
      .pipe(clean());
  });
};
