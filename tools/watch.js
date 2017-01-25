const spawn = require('./spawn');

module.exports = function (package) {
  return {
    deps: [],
    init: function () {

    },
    fn: function () {
      return spawn.run(package, 'node_modules/.bin/tsc', ['-w'])
    }
  };
};
