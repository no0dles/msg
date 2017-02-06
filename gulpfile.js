const gulp = require('gulp');
const sequence = require('gulp-sequence');

const build = require('./tools/build');
const unlink = require('./tools/unlink');
const watch = require('./tools/watch');
const test = require('./tools/test');
const install = require('./tools/install');
const installBuild = require('./tools/install-build');
const packages = require('./tools/packages');
const link = require('./tools/link');
const clean = require('./tools/clean');
const cleanBuild = require('./tools/clean-build');
const linkBuild = require('./tools/link-build');
const setup = require('./tools/setup');
const publish = require('./tools/publish');
const bump = require('./tools/bump');

const tasks = {
  'install': install,
  'install-build': installBuild,
  'link': link,
  'link-build': linkBuild,
  'build': build,
  'watch': watch,
  'test': test,
  'unlink': unlink,
  'clean': clean,
  'clean-build': cleanBuild,
  'setup': setup,
  'publish': publish,
  'bump': bump
};

for(var key in tasks) {
  const task = tasks[key];

  for(var i = 0; i < packages.names.length; i++) {
    const package = packages.names[i];
    const instance = task(package, gulp);

    instance.init(package);
    gulp.task(key + ':' + package, instance.deps, instance.fn ? instance.fn() : null);
  }

  gulp.task(key, sequence.apply(sequence, packages.names.map(function(package) { return key + ':' + package })));
}


//todo: install npm
//todo: module generator