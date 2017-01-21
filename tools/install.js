const spawn = require('./spawn');

module.exports.run = function(package) {
  return spawn.run(package, 'npm', ['install']);
};

module.exports.runInBuild = function(package) {
  return spawn.runInBuild(package, 'npm', ['install']);
}