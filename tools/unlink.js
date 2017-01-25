const gulp = require('gulp');
const packages = require('./packages');
const spawn = require('./spawn');

module.exports = function (package) {
  const dependencies = packages.getDependency(package);

  return {
    deps: dependencies.map(function(dep) { return 'npm:unlink:' + package + ':' + dep; }),
    init: function () {
      for(var i = 0; i < dependencies.length; i++) {
        const dependency = dependencies[i];
        const fn = spawn.run(package, 'npm', ['unlink', '@msg/' + dependency]);
        const name = 'npm:unlink:' + package + ':' + dependency;

        gulp.task(name, fn);
      }
    }
  };
};