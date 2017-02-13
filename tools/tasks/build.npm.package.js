const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

function mergePackageJson(package) {
  const base = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')).toString());
  const extension = JSON.parse(fs.readFileSync(path.join(package.sourcePath, 'package.json')).toString());

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
