const gulp = require('gulp');
const packages = require('./packages');
const spawn = require('./spawn');

module.exports = function(package) {
  const dependencies = packages.getDependency(package);

  return {
    deps: dependencies.map(function(dep) { return 'npm:link-build:' + package + ':' + dep; }),
    init: function () {
      for(var i = 0; i < dependencies.length; i++) {
        const dependency = dependencies[i];
        const fn = spawn.runInBuild(package, 'npm', ['link', '@msg/' + dependency]);
        const name = 'npm:link-build:' + package + ':' + dependency;

        gulp.task(name, fn);
      }
    },
    fn: function () {
      return spawn.runInBuild(package, 'npm', ['install']);
    }
  };
};