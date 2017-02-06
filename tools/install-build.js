const spawn = require('./spawn');

module.exports = function (package) {
  return {
    deps: [],
    init: function () {

    },
    fn: function () {
      return spawn.runInBuild(package, 'npm', ['install']);
    }
  };
};
