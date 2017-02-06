const spawn = require('./spawn');
const packages = require('./packages');

module.exports = function (package) {
  const buildPath = packages.getBuildPath(package);
  return {
    deps: ['bump:' + package, 'build:' + package],
    init: function () { },
    fn: function () {
      return spawn.run(buildPath, 'npm', ['publish', '--access=public']);
    }
  };
};