const packages = require('./packages');
const clean = require('gulp-clean');
const path = require('path');

module.exports = function(package, gulp) {
  const nodeModulesPath = path.join(packages.getPath(package), 'node_modules');

  return {
    deps: [],
    init: function () { },
    fn: function () {
      return function () {
        return gulp.src(nodeModulesPath, { read: false })
          .pipe(clean());
      };
    }
  };
};