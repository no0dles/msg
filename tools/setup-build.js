module.exports = function(package) {
  return {
    deps: ['build:' + package, 'install-build:' + package, 'link-build:' + package],
    init: function () { },
    fn: function () {
      return function () {

      };
    }
  };
};