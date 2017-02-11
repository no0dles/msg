const path = require('path');
const fs = require('fs');
const semver = require('semver');

module.exports = function (gulp, packages) {
  gulp.task('bump', function () {
    var maxVersion = '0.0.0';

    for(var i = 0; i < packages.length; i++) {
      const packageFile = require(path.join(packages[i].sourcePath, 'package.json'));
      const version = packageFile['version'];
      if(semver.gt(version, maxVersion)) {
        maxVersion = version;
      }
    }

    const nextVersion = semver.inc(maxVersion, 'patch');

    for(var i = 0; i < packages.length; i++) {
      const package = packages[i];
      const packageFilePath = path.join(package.sourcePath, 'package.json');
      const packageFile = require(packageFilePath);
      packageFile['version'] = nextVersion;

      for(var j = 0; j < package.dependencies.length; j++) {
        const dependency = package.dependencies[j];
        const depName = "@msg/" + dependency;

        if(depName in packageFile.dependencies) {
          packageFile.dependencies[depName] = nextVersion;
        }
      }

      fs.writeFileSync(packageFilePath, JSON.stringify(packageFile, null, 2));
    }
  });
};
