const bump = require('gulp-bump');
const packages = require("./packages");
const spawn = require('./spawn');
const path = require('path');

module.exports = function (package, gulp) {
  const packagePath = packages.getPath(package);

  return {
    deps: [],
    init: function () { },
    fn: function () {
      return function () {
        const packageFile = path.join(packagePath, 'package.json');

        gulp.src(packageFile)
          .pipe(bump())
          .pipe(gulp.dest(packagePath));
      }
    }
  };
};