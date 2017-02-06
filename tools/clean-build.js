const packages = require('./packages');
const clean = require('gulp-clean');

module.exports = function(package, gulp) {
  const buildPath = packages.getBuildPath(package);

  return {
    deps: [],
    init: function () { },
    fn: function () {
      return function () {
        return gulp.src(buildPath, { read: false })
          .pipe(clean());
      };
    }
  };
};