
const bump = require('gulp-bump');

function bumpPackage(package) {
  return function() {
    var packagePath = path.join(packagesPath, package);
    var packageFile = path.join(packagePath, 'package.json');

    gulp.src(packageFile)
      .pipe(bump())
      .pipe(gulp.dest(packagePath));
  }
}
