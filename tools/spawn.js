const spawn = require('child_process').spawn;
const packages = require('./packages');

module.exports.run = function(package, command, args) {
  return function(done) {
    var packagePath = packages.getPath(package);
    var options = { cwd: packagePath, stdio: 'inherit'};

    spawn(command, args || [], options)
      .on('close', done);
  }
};

module.exports.runInBuild = function(package, command, args) {
  return function(done) {
    var packagePath = packages.getBuildPath(package);
    var options = { cwd: packagePath, stdio: 'inherit'};

    spawn(command, args || [], options)
      .on('close', done);
  }
};