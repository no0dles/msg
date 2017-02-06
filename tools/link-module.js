const spawn = require('./spawn');
const package

module.exports = function (package) {
  return {
    deps: ['bump:' + package, 'build:' + package],
    init: function () { },
    fn: function () {
      return spawn.run(package, 'npm', ['publish', '--access=public']);
    }
  };
};