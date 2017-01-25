const gulp = require('gulp');
const packages = require('./packages');
const spawn = require('./spawn');

module.exports = function(package) {
  const dependencies = packages.getDependency(package);

  return {
    deps: dependencies.map(function(dep) { return 'npm:link:' + package + ':' + dep; }),
    init: function () {
      for(var i = 0; i < dependencies.length; i++) {
        const dependency = dependencies[i];
        const fn = spawn.run(package, 'npm', ['link', '@msg/' + dependency]);
        const name = 'npm:link:' + package + ':' + dependency;

        gulp.task(name, fn);
      }
    },
    fn: function () {
      return spawn.run(package, 'npm', ['install']);
    }
  };
};