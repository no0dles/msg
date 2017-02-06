const sequence = require('gulp-sequence');

module.exports = function(package) {
  return {
    deps: [],
    init: function () { },
    fn: function () {
      return sequence('install:' + package, 'link:' + package, 'build:' + package);
    }
  };
};