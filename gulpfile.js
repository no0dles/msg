const gulp = require('gulp');
const build = require('./tools/build');
const unlink = require('./tools/unlink');
const watch = require('./tools/watch');
const test = require('./tools/test');
const install = require('./tools/install');
const packages = require('./tools/packages');
const link = require('./tools/link');

const tasks = {
  'install': install,
  'link': link,
  'build': build,
  'watch': watch,
  'test': test,
  'unlink': unlink
};

for(var key in tasks) {
  const task = tasks[key];

  for(var i = 0; i < packages.names.length; i++) {
    const package = packages.names[i];
    const instance = task(package);

    instance.init(package);
    gulp.task(key + ':' + package, instance.deps, instance.fn ? instance.fn(package) : null);
  }

  gulp.task(key, packages.names.map(function(package) { return key + ':' + package }))
}
