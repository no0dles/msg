const gulp = require('gulp');
const packages = require('./packages');
const path = require('path');
const fs = require('fs');
const spawn = require('./spawn');
const mkdirp = require('mkdirp');

module.exports = function (package) {
  return {
    deps: ['build:ts:' + package, 'build:npm:' + package],
    init: function () {
      gulp.task('build:ts:' + package, spawn.run(package, 'node_modules/.bin/tsc'));
      gulp.task('build:npm:' + package, function () {
        const packagePath = packages.getPath(package);
        const base = require('../package.json');
        const extension = require(path.join(packagePath, 'package.json'));

        for(var key in extension) {
          base[key] = extension[key];
        }

        const buildPath = packages.getBuildPath(package);
        var cb = function () {
          fs.writeFileSync(path.join(buildPath, 'package.json'), JSON.stringify(base, null, 2));

          fs.createReadStream(path.join(__dirname, '.npmignore'))
            .pipe(fs.createWriteStream(path.join(buildPath, '.npmignore')));
        };

        if (!fs.existsSync(buildPath)){
          mkdirp(buildPath, cb);
        } else {
          cb();
        }
      });
    },
    fn: function () {

    }
  };
};