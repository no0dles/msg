const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function mergePackageJson(package) {
  const base = require('../package.json');
  const extension = require(path.join(package.sourcePath, 'package.json'));

  for(var key in extension) {
    base[key] = extension[key];
  }

  return base;
}

module.exports = function (gulp, package) {
  gulp.task('build:npm:' + package.name, [], function (done) {
    const packageFile = path.join(package.buildPath, 'package.json');
    mkdirp(package.buildPath, function () {

      fs.createReadStream(path.join(__dirname, '../.npmignore'))
        .pipe(fs.createWriteStream(path.join(package.buildPath, '.npmignore')));

      const content = mergePackageJson(package);
      fs.writeFile(packageFile, JSON.stringify(content, null, 2), function (err) {
        done(err);
      });
    });
  });
};
