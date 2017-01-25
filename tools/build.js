const gulp = require('gulp');
const packages = require('./packages');
const path = require('path');
const fs = require('fs');
const spawn = require('./spawn');

module.exports = function (package) {
  return {
    deps: [],
    init: function () {
      gulp.task('build-ts-' + package, spawn.run(package, 'node_modules/.bin/tsc'));
      gulp.task('build-npm-' + package, function () {
        const packagePath = packages.getPath(package);
        const base = require('../package.json');
        const extension = require(path.join(packagePath, 'package.json'));

        for(var key in extension) {
          base[key] = extension[key];
        }

        const buildPath = packages.getBuildPath(package);

        if (!fs.existsSync(buildPath)){
          fs.mkdirSync(buildPath);
        }

        fs.writeFileSync(path.join(buildPath, 'package.json'), JSON.stringify(base, null, 2));

        fs.createReadStream(path.join(__dirname, '.npmignore'))
          .pipe(fs.createWriteStream(path.join(buildPath, '.npmignore')));
      });
    },
    fn: function () {
      return spawn.run(package, 'node_modules/.bin/tsc');
    }
  };
};